const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const bundle = readFileSync(join(__dirname, "../sdk/dist/index.iife.js"), "utf8");

function loadSdk(window) {
  return runInNewContext(bundle + "\nTrinsicUI", { URL, window });
}

test("the browser bundle exposes the redirect and wallet APIs", () => {
  assert.deepEqual(Object.keys(loadSdk({})).sort(), [
    "isUserOnEligibleAppleWalletBrowser",
    "isUserOnEligibleGoogleWalletBrowser",
    "launchRedirect",
    "performMdlExchange",
  ]);
});

test("a redirect replaces legacy launch modes and preserves the regional session URL", async () => {
  const window = { location: {} };
  window.top = window;
  const { launchRedirect } = loadSdk(window);
  await launchRedirect("https://verify.eu.trinsic.id/start?launchMode=popup&sessionId=123&launchMode=mobile#continue");
  const url = new URL(window.location.href);
  assert.equal(url.origin, "https://verify.eu.trinsic.id");
  assert.equal(url.pathname, "/start");
  assert.equal(url.hash, "#continue");
  assert.equal(url.searchParams.get("sessionId"), "123");
  assert.deepEqual(url.searchParams.getAll("launchMode"), ["redirect"]);
});

test("an embedded launch rejects before navigating", async () => {
  const window = { top: {}, location: {} };
  await assert.rejects(loadSdk(window).launchRedirect("https://verify.trinsic.id/start"), /top-level/);
  assert.equal(window.location.href, undefined);
});
