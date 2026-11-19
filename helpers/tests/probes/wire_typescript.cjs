const assert = require('node:assert/strict');
const sdk = require(process.env.SDK_TEST_ROOT + '/api-typescript/sdk/dist');
const runtime = require(process.env.SDK_TEST_ROOT + '/api-typescript/sdk/dist/runtime');
for (const value of ['1990-01-01', '2024-02-29', '2026-03-08', '2011-12-30', '0099-01-01']) {
  const model = sdk.PersonDataFromJSON({dateOfBirth: value});
  assert.equal(model.dateOfBirth.toISOString(), value + 'T00:00:00.000Z');
  assert.equal(sdk.PersonDataToJSON(model).dateOfBirth, value);
  assert.equal(sdk.AadhaarInputToJSON({dateOfBirth: new Date(value + 'T00:00:00Z')}).dateOfBirth, value);
}
assert.equal(runtime.serializeDate(new Date('2026-08-05T23:30:00Z')), '2026-08-05');
assert.ok(Number.isNaN(runtime.parseDate('2026-02-30').getTime()));
assert.equal(runtime.serializeDateTime(runtime.parseDateTime('2026-08-05T01:02:03.123+05:30')), '2026-08-04T19:32:03.123Z');
assert.equal(sdk.AadhaarInputToJSON({dateOfBirth: null}).dateOfBirth, null);
