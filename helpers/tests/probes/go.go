package main

import (
	api "SDK_MODULE"
	"context"
	"os"
)

func main() {
	config := api.NewConfiguration()
	config.Servers = api.ServerConfigurations{{URL: os.Getenv("SDK_TEST_URL")}}
	config.DefaultHeader = map[string]string{"X-Test-Header": "preserved"}
	client := api.NewAPIClient(config)
	ctx := context.WithValue(context.Background(), api.ContextAccessToken, "sdk-header-test-token")
	if _, _, err := client.ProvidersAPI.ListProviders(ctx).Execute(); err != nil {
		panic(err)
	}
	if _, _, err := client.SessionsAPI.CancelSession(ctx, "00000000-0000-0000-0000-000000000001").Execute(); err != nil {
		panic(err)
	}
}
