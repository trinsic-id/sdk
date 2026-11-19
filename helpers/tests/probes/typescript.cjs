const assert = require("node:assert/strict");
const http = require("node:http");
const { Configuration, SessionsApi, ProvidersApi } = require(`${process.env.SDK_TEST_ROOT}/api-typescript/sdk/dist`);

async function main() {
  const headers = { Authorization: "Bearer sdk-header-test-token", "X-Test-Header": "preserved" };
  const config = new Configuration({
    basePath: process.env.SDK_TEST_URL,
    accessToken: "sdk-header-test-token",
    headers: { "X-Test-Header": "preserved" },
  });
  const sessions = new SessionsApi(config);
  const sessionId = "00000000-0000-0000-0000-000000000001";
  await new ProvidersApi(config).listProvidersRaw({});
  await sessions.cancelSessionRaw({ sessionId });
  // Each HeadersInit representation and async overrides must retain the SDK header.
  for (const override of [headers, Object.entries(headers), new Headers(headers)]) {
    await sessions.cancelSessionRaw({ sessionId }, { headers: override });
  }
  await sessions.cancelSessionRaw({ sessionId }, async () => ({ headers: new Headers(headers) }));
  await sessions.withPreMiddleware(async ({ url, init }) => ({
    url, init: { ...init, headers: { ...headers } },
  })).cancelSessionRaw({ sessionId });
  // A middleware retry goes back through the same request pipeline.
  let retried = false;
  await sessions.withMiddleware({
    post: async ({ fetch, url, init, response }) => {
      if (retried) return response;
      retried = true;
      return fetch(url, { ...init, headers: { ...headers } });
    },
  }).cancelSessionRaw({ sessionId });

  // A custom transport must work without installing Fetch API globals.
  const headerOverrides = [
    { ...headers, "x-trinsic-sdk": "stale", "X-Trinsic-SDK": "also-stale" },
    [...Object.entries(headers), ["x-trinsic-sdk", "stale"], ["X-Multi-Value", "first"], ["X-Multi-Value", "second"]],
    new Headers({ ...headers, "x-trinsic-sdk": "stale" }),
  ];
  const originalHeaders = globalThis.Headers;
  const originalFetch = globalThis.fetch;
  let customFetchCalls = 0;
  delete globalThis.Headers;
  delete globalThis.fetch;
  try {
    const customConfig = new Configuration({
      basePath: process.env.SDK_TEST_URL,
      accessToken: "sdk-header-test-token",
      headers: { "X-Test-Header": "preserved" },
      fetchApi: (url, init) => new Promise((resolve, reject) => {
        customFetchCalls++;
        // Node's HTTP API expects a header object; retain repeated tuple values.
        let transportHeaders = init.headers;
        if (Array.isArray(transportHeaders)) {
          transportHeaders = transportHeaders.reduce((result, [name, value]) => {
            const key = name.toLowerCase();
            result[key] = result[key] ? [...result[key], value] : [value];
            return result;
          }, {});
          assert.deepEqual(transportHeaders["x-multi-value"], ["first", "second"]);
        }
        const request = http.request(url, { method: init.method, headers: transportHeaders }, (response) => {
          response.resume();
          response.on("end", () => resolve({
            status: response.statusCode,
            clone() { return this; },
          }));
        });
        request.on("error", reject);
        request.end();
      }),
    });
    await new ProvidersApi(customConfig).listProvidersRaw({});
    const customSessions = new SessionsApi(customConfig);
    await customSessions.cancelSessionRaw({ sessionId });
    for (const override of headerOverrides) {
      const snapshot = JSON.stringify(override instanceof originalHeaders ? [...override.entries()] : override);
      await customSessions.cancelSessionRaw({ sessionId }, { headers: override });
      assert.equal(JSON.stringify(override instanceof originalHeaders ? [...override.entries()] : override), snapshot);
    }
    assert.equal(customFetchCalls, 5);
  } finally {
    globalThis.Headers = originalHeaders;
    globalThis.fetch = originalFetch;
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
