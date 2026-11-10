import inspect
from enum import Enum

from pydantic import ValidationError
import trinsic_api
from trinsic_api import (
    CreateDirectProviderSessionRequest, IntegrationCapability, IntegrationLaunchMethod,
    IntegrationStep, PersonData, Session, SessionErrorCode, Sex,
)

# A value added to the API after this SDK was generated must not fail the response.
step = IntegrationStep.from_json('{"method":"FutureLaunchMethod","content":"content"}')
assert step.method is IntegrationLaunchMethod.UNKNOWN_DEFAULT_OPEN_API and step.content == "content"
session = Session.from_json('{"id":"session-id","done":true,"success":false,"errorCode":"FutureErrorCode","created":1,"updated":2}')
assert session.error_code is SessionErrorCode.UNKNOWN_DEFAULT_OPEN_API and session.id == "session-id"
request = CreateDirectProviderSessionRequest.from_json('{"provider":"provider","verificationProfileId":"00000000-0000-0000-0000-000000000001","capabilities":["LaunchBrowser","FutureCapability"],"enableRedirectBackwardsCompatibility":false}')
assert request.capabilities == [IntegrationCapability.LAUNCHBROWSER, IntegrationCapability.UNKNOWN_DEFAULT_OPEN_API]

# Known values, including a real member named Unknown, and nulls are unchanged.
assert PersonData.from_json('{"sex":"Unknown"}').sex is Sex.UNKNOWN, "Known value was replaced"
assert PersonData.from_json('{"sex":null}').sex is None, "Null became a value"
assert IntegrationStep(method=IntegrationLaunchMethod.LAUNCHBROWSER, content="content").to_dict()["method"] == "LaunchBrowser"
try:
    IntegrationStep.from_json('{"method":null,"content":"content"}')
except ValidationError:
    pass
else:
    raise AssertionError("Null accepted for a required enum")

# Every generated enum must fall back.
enums = [
    model for model in vars(trinsic_api).values()
    if inspect.isclass(model)
    and model.__module__.startswith("trinsic_api.models.")
    and issubclass(model, Enum)
]
assert enums, "No generated enums were inspected"
for enum in enums:
    assert enum("FutureValue") is enum.UNKNOWN_DEFAULT_OPEN_API, f"Unknown value rejected: {enum}"
    assert enum.from_json('"FutureValue"') is enum.UNKNOWN_DEFAULT_OPEN_API, f"Unknown value rejected: {enum}"
print(f"Unknown enum values fell back for {len(enums)} enums")
