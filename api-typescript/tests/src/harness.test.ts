import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "./results.js";

test("Lifecycle failures retain their own cases and do not suppress later operations", () => {
  const directory = mkdtempSync(join(tmpdir(), "trinsic-lifecycle-regression-"));
  try {
    const mock = join(directory, "mock.mjs"), output = join(directory, "results.json");
    writeFileSync(mock, `
      import { sdk } from ${JSON.stringify(new URL("./support.ts", import.meta.url).href)};
      const id = "00000000-0000-4000-8000-000000000001";
      const base = "https://example.test";
      sdk.ProvidersApi.prototype.getProvider = async () => ({ provider: { id: "trinsic-test-redirect", name: "test" } });
      sdk.RedirectUrisApi.prototype.list = async () => ({ uris: [{ uri: base + "/app" }] });
      sdk.SessionsApi.prototype.createHostedProviderSession = async () => ({ sessionId: id, launchUrl: base + "/start", resultsAccessKey: "key" });
      sdk.SessionsApi.prototype.createDirectProviderSession = async () => ({ sessionId: id, nextStep: { method: "LaunchBrowser", content: base + "/start" }, resultCollection: { method: "CaptureRedirect", resultsAccessKey: "key" } });
      sdk.SessionsApi.prototype.getSession = async () => { throw new Error("injected get failure"); };
      sdk.SessionsApi.prototype.getSessionResult = async () => { throw new Error("injected result decoder failure"); };
      sdk.SessionsApi.prototype.cancelSession = async () => ({ session: { id, done: true, success: false } });
      sdk.SessionsApi.prototype.redactSession = async () => undefined;
      globalThis.fetch = async input => {
        const url = new URL(input);
        const location = url.pathname === "/start" ? base + "/integrations/trinsic-test-redirect?redirectUrl=" + encodeURIComponent(base + "/callback")
          : url.pathname === "/callback" ? base + "/verification"
          : url.pathname === "/verification" ? base + "/completion"
          : base + "/app?redirectToken=complete";
        return new Response(null, { status: 302, headers: { location } });
      };
    `);
    const env: NodeJS.ProcessEnv = { ...process.env, SDK_TARGET_LABEL: "typescript regression", SDK_VERSION: "3.2.1", SDK_COMPATIBILITY_RESULT_FILE: output, TRINSIC_TEST_BASE_URL: "https://example.test", TRINSIC_TEST_ACCESS_TOKEN: "test-only", TRINSIC_TEST_VERIFICATION_PROFILE_ID: "00000000-0000-4000-8000-000000000001" };
    delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, ["--import", "tsx", "--import", mock, "--test", fileURLToPath(new URL("./session-lifecycle.test.ts", import.meta.url))], {
      cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8",
      env,
    });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.ok(existsSync(output), result.stdout + result.stderr);
    const cases = JSON.parse(readFileSync(output, "utf8")).testCases;
    assert.equal(cases.length, 8, result.stdout + result.stderr);
    const byId = new Map<string, any>(cases.map((entry: any) => [entry.id, entry]));
    for (const id of ["api.providers.get", "api.sessions.create-hosted-provider", "api.sessions.create-direct-provider", "api.sessions.cancel", "api.sessions.redact"]) assert.equal(byId.get(id)?.status, "passed", id);
    assert.equal(byId.get("api.sessions.get")?.failure.message, "injected get failure");
    for (const id of ["api.sessions.get-result", "api.sessions.get-attachment"]) assert.equal(byId.get(id)?.failure.message, "injected result decoder failure");
    assert.ok(cases.every((entry: any) => entry.status !== "failed" || entry.nativeTest));
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
