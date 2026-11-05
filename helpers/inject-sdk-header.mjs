import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Keep these small request-construction patches alongside the pinned generator.
// Fail generation when its output changes instead of silently dropping telemetry.
export function injectSdkHeader(language, version, outputFolder) {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid SDK version: ${version}`);
  }

  const sdkLanguage = language === "typescript-fetch" ? "typescript" : language;
  const value = JSON.stringify(`${sdkLanguage}/${version}`);
  const patches = {
    csharp: {
      directory: "src/Trinsic.Api/Api",
      filePattern: /^(?!IApi\.cs$).*Api\.cs$/,
      anchor: "                using (HttpRequestMessage httpRequestMessageLocalVar = new HttpRequestMessage())\n                {",
      addition: `\n                    httpRequestMessageLocalVar.Headers.Add("X-Trinsic-SDK", ${value});`,
    },
    go: {
      file: "client.go",
      anchor: "\tfor header, value := range c.cfg.DefaultHeader {\n\t\tlocalVarRequest.Header.Add(header, value)\n\t}",
      addition: `\n\tlocalVarRequest.Header.Set("X-Trinsic-SDK", ${value})`,
    },
    java: {
      directory: "src/main/java/id/trinsic/api",
      filePattern: /Api\.java$/,
      anchor: "    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();",
      addition: `\n    localVarRequestBuilder.header("X-Trinsic-SDK", ${value});`,
    },
    php: {
      directory: "lib/Api",
      filePattern: /Api\.php$/,
      anchor: "        $defaultHeaders = [];",
      addition: `\n        $defaultHeaders['X-Trinsic-SDK'] = ${value};`,
    },
    python: {
      file: "trinsic_api/api_client.py",
      anchor: "        header_params.update(self.default_headers)",
      addition: `\n        header_params['X-Trinsic-SDK'] = ${value}`,
    },
    ruby: {
      file: "lib/trinsic_api/api_client.rb",
      anchor: "      header_params = @default_headers.merge(opts[:header_params] || {})",
      addition: `\n      header_params['X-Trinsic-SDK'] = ${value}`,
    },
    "typescript-fetch": {
      file: "src/runtime.ts",
      // Apply after init overrides and user middleware, including retry requests.
      anchor: "        let response: Response | undefined = undefined;",
      addition: `
        // HeadersInit may be tuples, a plain object, or a Headers instance.
        // Copy each form without new Headers(), since custom fetch runtimes may not provide it.
        const requestHeaders = fetchParams.init.headers;
        let sdkHeaders: HeadersInit;
        if (Array.isArray(requestHeaders)) {
            // Keep repeated header values and leave the caller's tuples untouched.
            sdkHeaders = [
                ...requestHeaders.filter(([name]) => name.toLowerCase() !== 'x-trinsic-sdk'),
                ['X-Trinsic-SDK', ${value}],
            ];
        } else {
            const headerValues: HTTPHeaders = Object.create(null);
            // Headers is only a type here; custom fetch implementations need no global constructor.
            if (requestHeaders && typeof (requestHeaders as Headers).forEach === 'function') {
                (requestHeaders as Headers).forEach((value, name) => { headerValues[name] = value; });
            } else {
                Object.assign(headerValues, requestHeaders);
            }
            for (const name of Object.keys(headerValues)) {
                if (name.toLowerCase() === 'x-trinsic-sdk') delete headerValues[name];
            }
            headerValues['X-Trinsic-SDK'] = ${value};
            sdkHeaders = headerValues;
        }
        fetchParams.init = { ...fetchParams.init, headers: sdkHeaders };`,
    },
  };

  const patch = patches[language];
  if (!patch) {
    throw new Error(`SDK header injection is not configured for ${language}`);
  }

  const files = patch.file
    ? [patch.file]
    : readdirSync(join(outputFolder, patch.directory))
        .filter((file) => patch.filePattern.test(file))
        .map((file) => join(patch.directory, file));
  if (files.length === 0) {
    throw new Error(`No generated API files found for ${language}`);
  }

  // Validate every file before writing any changes.
  const updates = files.map((file) => {
    const path = join(outputFolder, file);
    const original = readFileSync(path, "utf8");
    const source = original.replace(/\r\n/g, "\n");
    const occurrences = source.split(patch.anchor).length - 1;
    if (occurrences === 0 || (patch.file && occurrences !== 1)) {
      throw new Error(`Expected SDK header injection point missing or ambiguous in ${file}; check the OpenAPI Generator templates`);
    }
    if (source.includes("X-Trinsic-SDK")) {
      throw new Error(`SDK header already present in ${file}; regenerate before injecting`);
    }
    const updated = source.split(patch.anchor).join(patch.anchor + patch.addition);
    return [path, original.includes("\r\n") ? updated.replace(/\n/g, "\r\n") : updated];
  });

  for (const [path, contents] of updates) {
    writeFileSync(path, contents);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [language, version, outputFolder] = process.argv.slice(2);
  if (!language || !version || !outputFolder) {
    throw new Error("Usage: node inject-sdk-header.mjs <generator> <sdk-version> <output-folder>");
  }
  injectSdkHeader(language, version, outputFolder);
}
