package main

import (
	sdk "SDK_MODULE"
	"encoding/json"
	"fmt"
)

func decode(data string, target interface{}) {
	if err := json.Unmarshal([]byte(data), target); err != nil {
		panic(err)
	}
}

func main() {
	// A value added to the API after this SDK was generated must not fail the response.
	var step sdk.IntegrationStep
	decode(`{"method":"FutureLaunchMethod","content":"content"}`, &step)
	if step.Method != sdk.INTEGRATIONLAUNCHMETHOD_UNKNOWN_DEFAULT_OPEN_API || step.Content != "content" {
		panic("Required enum did not fall back")
	}
	var session sdk.Session
	decode(`{"id":"session-id","done":true,"success":false,"errorCode":"FutureErrorCode","created":1,"updated":2}`, &session)
	if session.GetErrorCode() != sdk.SESSIONERRORCODE_UNKNOWN_DEFAULT_OPEN_API || session.Id != "session-id" {
		panic("Nullable enum did not fall back")
	}
	var request sdk.CreateDirectProviderSessionRequest
	decode(`{"provider":"provider","verificationProfileId":"00000000-0000-0000-0000-000000000001","capabilities":["LaunchBrowser","FutureCapability"],"enableRedirectBackwardsCompatibility":false}`, &request)
	if len(request.Capabilities) != 2 || request.Capabilities[0] != sdk.INTEGRATIONCAPABILITY_LAUNCH_BROWSER || request.Capabilities[1] != sdk.INTEGRATIONCAPABILITY_UNKNOWN_DEFAULT_OPEN_API {
		panic("Enum list did not fall back")
	}

	// Known values, including a real member named Unknown, and nulls are unchanged.
	var person sdk.PersonData
	decode(`{"sex":"Unknown"}`, &person)
	if person.GetSex() != sdk.SEX_UNKNOWN {
		panic("Known value was replaced")
	}
	var empty sdk.PersonData
	decode(`{"sex":null}`, &empty)
	if empty.Sex.Get() != nil {
		panic("Null became a value")
	}
	if data, err := json.Marshal(sdk.INTEGRATIONLAUNCHMETHOD_LAUNCH_BROWSER); err != nil || string(data) != `"LaunchBrowser"` {
		panic("Enum serialization changed")
	}
	fmt.Println("Unknown enum values fell back")
}
