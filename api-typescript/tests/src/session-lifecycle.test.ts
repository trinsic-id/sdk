import assert from "node:assert/strict";
import { after } from "node:test";
import { configuration, sdk, sdkConfiguration, targetLabel } from "./support.js";

import { test, recordCompatibilityCase } from "./results.js";

interface BrowserResponse {
  location?: string;
  status: number;
  url: string;
}

interface CompletedSession {
  redirectToken: string;
  resultsAccessKey: string;
  sessionId: string;
}

const TEST_PROVIDER = "trinsic-test-redirect";
const createdSessions = new Set<string>();
let completedSession: Promise<CompletedSession> | undefined;
const completed = () => completedSession ??= completeRedirectSession();
after(async () => {
  for (const id of createdSessions) {
    try { await new sdk.SessionsApi(sdkConfiguration()).cancelSession(id); }
    catch { /* Completed or redacted sessions may no longer be cancellable. */ }
  }
});

test(`${targetLabel}: GetProvider returns the redirect test integration`, async () => {
  await recordCompatibilityCase("api.providers.get", async () => {
    const provider = await new sdk.ProvidersApi(sdkConfiguration()).getProvider(TEST_PROVIDER);
    assert.equal(provider.provider.id, TEST_PROVIDER);
    assert.equal(typeof provider.provider.name, "string");
  });
});

test(`${targetLabel}: CreateHostedProviderSession returns a launch URL and access key`, () =>
  recordCompatibilityCase("api.sessions.create-hosted-provider", async () => {
    const response = await new sdk.SessionsApi(sdkConfiguration()).createHostedProviderSession({
      provider: TEST_PROVIDER,
      redirectUrl: await testRedirectUrl(),
      verificationProfileId: configuration.verificationProfileId,
    });

    createdSessions.add(response.sessionId);
    assertUuid(response.sessionId, "Hosted session ID");
    assertUrl(response.launchUrl, "Hosted session launch URL");
    assertNonEmptyString(response.resultsAccessKey, "Hosted session results access key");

  }));

test(`${targetLabel}: CreateDirectProviderSession returns a launch step`, () =>
  recordCompatibilityCase("api.sessions.create-direct-provider", async () => {
    const session = await createDirectSession();
    assert.equal(session.nextStep.method, "LaunchBrowser");
    assertUrl(session.nextStep.content, "Direct session launch URL");
  }));

test(`${targetLabel}: GetSession reads a direct session`, () =>
  recordCompatibilityCase("api.sessions.get", async () => {
    const session = await createDirectSession();
    const fetched = await new sdk.SessionsApi(sdkConfiguration()).getSession(session.sessionId);
    assert.equal(fetched.session.id, session.sessionId);
    assert.equal(fetched.session.done, false);
  }));

test(`${targetLabel}: CancelSession cancels a direct session`, () =>
  recordCompatibilityCase("api.sessions.cancel", async () => {
    const session = await createDirectSession();
    const cancelled = await new sdk.SessionsApi(sdkConfiguration()).cancelSession(session.sessionId);
    assert.equal(cancelled.session.id, session.sessionId);
    assert.equal(cancelled.session.done, true);
    assert.equal(cancelled.session.success, false);
  }));

test(`${targetLabel}: GetSessionResult reads a completed session`, () =>
  recordCompatibilityCase("api.sessions.get-result", async () => {
    const session = await completed();
    const result = await new sdk.SessionsApi(sdkConfiguration()).getSessionResult(
      session.sessionId, { resultsAccessKey: session.resultsAccessKey },
    );
    assert.equal(result.session.id, session.sessionId);
    assert.equal(result.session.done, true);
    assert.equal(result.session.success, true);
    assert.ok(result.identityData, "Redirect test provider must return identity data");
    assert.equal(result.identityData.originatingProviderId, TEST_PROVIDER);
    assert.ok(result.identityData.attachments.length > 0, "Redirect test provider must return attachments");
  }));

test(`${targetLabel}: GetAttachment reads a completed session attachment`, () =>
  recordCompatibilityCase("api.sessions.get-attachment", async () => {
    const session = await completed();
    const result = await new sdk.SessionsApi(sdkConfiguration()).getSessionResult(
      session.sessionId, { resultsAccessKey: session.resultsAccessKey },
    );
    const attachmentId = result.identityData?.attachments[0]?.id;
    assert.ok(attachmentId, "Completed redirect session must include an attachment");
    const attachment = await new sdk.SessionsApi(sdkConfiguration()).getAttachment(
      session.sessionId, attachmentId, { resultsAccessKey: session.resultsAccessKey },
    );
    assertNonEmptyString(attachment.content, "Attachment content");
    assert.equal(attachment.contentType, "image/png");
  }));

test(`${targetLabel}: RedactSession redacts a completed session`, () =>
  recordCompatibilityCase("api.sessions.redact", async () => {
    const session = await completed();
    const result = await new sdk.SessionsApi(sdkConfiguration()).redactSession(session.sessionId);
    assert.equal(result, undefined);
  }));

async function createDirectSession() {
  const response = await new sdk.SessionsApi(sdkConfiguration()).createDirectProviderSession({
    capabilities: ["LaunchBrowser", "CaptureRedirect"],
    fallbackToHostedUI: false,
    provider: TEST_PROVIDER,
    redirectUrl: await testRedirectUrl(),
    verificationProfileId: configuration.verificationProfileId,
  });

  createdSessions.add(response.sessionId);
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

  return {
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
