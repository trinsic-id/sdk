import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import { MINIMUM_SDK_VERSION } from "./contracts.js";
import { isSdkVersionAtLeast, readTestConfiguration } from "./config.js";
import { recordCompatibilityCase, recordSkippedCompatibilityCase } from "./results.js";

type SdkModule = Record<string, any>;

interface BrowserResponse {
  location?: string;
  status: number;
  url: string;
}

interface CompletedSession {
  attachmentId: string;
  redirectToken: string;
  resultsAccessKey: string;
  sessionId: string;
}

const TEST_PROVIDER = "trinsic-test-redirect";
const installRoot = requiredEnvironment("SDK_INSTALL_ROOT");
const sdkVersion = requiredEnvironment("SDK_VERSION");
const targetLabel = requiredEnvironment("SDK_TARGET_LABEL");
const configuration = readTestConfiguration();
const sdk = loadSdk(installRoot);

test(`${targetLabel}: GetProvider returns the redirect test integration`, async () => {
  if (!isSdkVersionAtLeast(sdkVersion, MINIMUM_SDK_VERSION.getProvider)) {
    recordSkippedCompatibilityCase(
      "api.providers.get",
      `ProvidersApi.getProvider was introduced in ${MINIMUM_SDK_VERSION.getProvider}.`,
    );
    return;
  }

  await recordCompatibilityCase("api.providers.get", async () => {
    const provider = await new sdk.ProvidersApi(sdkConfiguration()).getProvider(TEST_PROVIDER);
    assert.equal(provider.provider.id, TEST_PROVIDER);
    assert.equal(typeof provider.provider.name, "string");
  });
});

test(`${targetLabel}: CreateHostedProviderSession returns a launch URL and access key`, () =>
  recordCompatibilityCase("api.sessions.create-hosted-provider", async () => {
    const response = await new sdk.SessionsApi(sdkConfiguration()).createHostedProviderSession({
      enableRedirectBackwardsCompatibility: false,
      provider: TEST_PROVIDER,
      redirectUrl: await testRedirectUrl(),
      verificationProfileId: configuration.verificationProfileId,
    });

    assertUuid(response.sessionId, "Hosted session ID");
    assertUrl(response.launchUrl, "Hosted session launch URL");
    assertNonEmptyString(response.resultsAccessKey, "Hosted session results access key");

    await new sdk.SessionsApi(sdkConfiguration()).cancelSession(response.sessionId);
  }));

test(`${targetLabel}: Direct redirect session can be read and cancelled`, () =>
  recordCompatibilityCase("api.sessions.create-direct-provider", async () => {
    const session = await createDirectSession();
    assert.equal(session.nextStep.method, "LaunchBrowser");
    assertUrl(session.nextStep.content, "Direct session launch URL");

    await recordCompatibilityCase("api.sessions.get", async () => {
      const fetched = await new sdk.SessionsApi(sdkConfiguration()).getSession(session.sessionId);
      assert.equal(fetched.session.id, session.sessionId);
      assert.equal(fetched.session.done, false);
    });

    await recordCompatibilityCase("api.sessions.cancel", async () => {
      const cancelled = await new sdk.SessionsApi(sdkConfiguration()).cancelSession(session.sessionId);
      assert.equal(cancelled.session.id, session.sessionId);
      assert.equal(cancelled.session.done, true);
      assert.equal(cancelled.session.success, false);
    });
  }));

test(`${targetLabel}: Redirect session results, attachments, and redaction use the supported contract`, async () => {
  const completed = await completeRedirectSession();

  await recordCompatibilityCase("api.sessions.get-result", async () => {
    const result = await new sdk.SessionsApi(sdkConfiguration()).getSessionResult(
      completed.sessionId,
      {
        redirectToken: completed.redirectToken,
        resultsAccessKey: completed.resultsAccessKey,
      },
    );

    assert.equal(result.session.id, completed.sessionId);
    assert.equal(result.session.done, true);
    assert.equal(result.session.success, true);
    assert.ok(result.identityData, "Redirect test provider must return identity data");
    assert.equal(result.identityData.originatingProviderId, TEST_PROVIDER);
    assert.ok(result.identityData.attachments.length > 0, "Redirect test provider must return attachments");
    assert.equal(result.identityData.attachments[0].id, completed.attachmentId);
  });

  await recordCompatibilityCase("api.sessions.get-attachment", async () => {
    const attachment = await new sdk.SessionsApi(sdkConfiguration()).getAttachment(
      completed.sessionId,
      completed.attachmentId,
      { resultsAccessKey: completed.resultsAccessKey },
    );

    assertNonEmptyString(attachment.content, "Attachment content");
    assert.equal(attachment.contentType, "image/png");
  });

  await recordCompatibilityCase("api.sessions.redact", async () => {
    const result = await new sdk.SessionsApi(sdkConfiguration()).redactSession(completed.sessionId);
    assert.equal(result, undefined);
  });
});

async function createDirectSession(): Promise<any> {
  const response = await new sdk.SessionsApi(sdkConfiguration()).createDirectProviderSession({
    capabilities: ["LaunchBrowser", "CaptureRedirect"],
    enableRedirectBackwardsCompatibility: false,
    fallbackToHostedUI: false,
    provider: TEST_PROVIDER,
    redirectUrl: await testRedirectUrl(),
    verificationProfileId: configuration.verificationProfileId,
  });

  assertUuid(response.sessionId, "Direct session ID");
  assert.equal(response.resultCollection.method, "CaptureRedirect");
  assertNonEmptyString(response.resultCollection.resultsAccessKey, "Direct session results access key");
  return response;
}

async function completeRedirectSession(): Promise<CompletedSession> {
  const session = await createDirectSession();
  const browser = new BrowserSession();
  const launch = await browser.fetch(session.nextStep.content);
  assert.equal(launch.status, 302, "Direct session launch must redirect to the test integration");

  const integrationUrl = new URL(requiredLocation(launch), launch.url);
  assert.equal(integrationUrl.pathname, `/integrations/${TEST_PROVIDER}`);
  const callbackUrl = new URL(requiredSearchParameter(integrationUrl, "redirectUrl"));
  callbackUrl.searchParams.set("resultState", "success");

  const integrationComplete = await browser.fetch(callbackUrl.toString());
  const verificationComplete = await browser.fetch(
    new URL(requiredLocation(integrationComplete), callbackUrl).toString(),
  );
  const redirectComplete = await browser.fetch(
    new URL(requiredLocation(verificationComplete), verificationComplete.url).toString(),
  );
  const applicationRedirectUrl = new URL(
    requiredLocation(redirectComplete),
    redirectComplete.url,
  );
  const redirectToken = requiredSearchParameter(applicationRedirectUrl, "redirectToken");

  const result = await new sdk.SessionsApi(sdkConfiguration()).getSessionResult(
    session.sessionId,
    { redirectToken, resultsAccessKey: session.resultCollection.resultsAccessKey },
  );
  assert.ok(result.identityData, "Completed redirect session must have identity data");
  const attachment = result.identityData.attachments[0];
  assert.ok(attachment, "Completed redirect session must include an attachment");

  return {
    attachmentId: attachment.id,
    redirectToken,
    resultsAccessKey: session.resultCollection.resultsAccessKey,
    sessionId: session.sessionId,
  };
}

class BrowserSession {
  private cookie = "";

  async fetch(url: string): Promise<BrowserResponse> {
    const response = await globalThis.fetch(url, {
      headers: this.cookie ? { Cookie: this.cookie } : undefined,
      redirect: "manual",
    });
    const cookies = response.headers.getSetCookie?.() ?? [];
    if (cookies.length > 0) {
      this.cookie = cookies.map((value) => value.split(";", 1)[0]).join("; ");
    }

    return {
      location: response.headers.get("location") ?? undefined,
      status: response.status,
      url,
    };
  }
}

function sdkConfiguration(): any {
  return new sdk.Configuration({
    accessToken: configuration.accessToken,
    basePath: configuration.baseUrl,
  });
}

async function testRedirectUrl(): Promise<string> {
  const response = await new sdk.RedirectUrisApi(sdkConfiguration()).list(undefined, 50);
  const redirectUriEntries = response.uris as Array<{ uri?: unknown }>;
  const uris = redirectUriEntries
    .map((entry) => entry.uri)
    .filter((uri: unknown): uri is string => typeof uri === "string")
    .filter((uri: string) => isHttpUrl(uri));

  assert.ok(uris.length > 0, "The test environment must have at least one registered HTTP(S) redirect URI");
  return uris.find((uri) => new URL(uri).origin === "https://example.com") ?? uris[0];
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function loadSdk(root: string): SdkModule {
  const requireFromInstalledPackage = createRequire(`${root}/package.json`);
  return requireFromInstalledPackage("@trinsic/api") as SdkModule;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be supplied by the compatibility test runner.`);
  return value;
}

function requiredLocation(response: BrowserResponse): string {
  assert.ok(response.location, `Expected ${response.url} to return a redirect location`);
  return response.location;
}

function requiredSearchParameter(url: URL, name: string): string {
  const value = url.searchParams.get(name);
  assert.ok(value, `${url.pathname} must include ${name}`);
  return value;
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  assert.ok(typeof value === "string", `${label} must be a string`);
  assert.ok(value.length > 0, `${label} must not be empty`);
}

function assertUrl(value: unknown, label: string): void {
  assertNonEmptyString(value, label);
  const url = new URL(value);
  assert.ok(url.protocol === "https:" || url.protocol === "http:", `${label} must be HTTP(S)`);
}

function assertUuid(value: unknown, label: string): void {
  assertNonEmptyString(value, label);
  assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, `${label} must be a UUID`);
}
