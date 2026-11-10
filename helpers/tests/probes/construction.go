package main

import (
	sdk "SDK_MODULE"
	"encoding/json"
	"fmt"
)

func main() {
	request := sdk.CreateHostedProviderSessionRequest{
		Provider:                             "provider-a",
		VerificationProfileId:                "00000000-0000-0000-0000-000000000001",
		RedirectUrl:                          "https://example.test",
		EnableRedirectBackwardsCompatibility: false,
		AdditionalProperties:                 map[string]interface{}{"extra": "preserved"},
	}
	data, err := json.Marshal(request)
	if err != nil {
		panic(err)
	}
	var decoded sdk.CreateHostedProviderSessionRequest
	if err := json.Unmarshal(data, &decoded); err != nil {
		panic(err)
	}
	if decoded.Provider != request.Provider || decoded.RedirectUrl != request.RedirectUrl || decoded.EnableRedirectBackwardsCompatibility || decoded.AdditionalProperties["extra"] != "preserved" {
		panic("Keyed construction changed serialization")
	}
	defaults := sdk.NewCreateHostedProviderSessionRequestWithDefaults()
	defaults.SetProvider("provider-b")
	if defaults.GetProvider() != "provider-b" {
		panic("Named setter failed")
	}
	fmt.Println("Keyed construction and JSON behavior passed")
}
