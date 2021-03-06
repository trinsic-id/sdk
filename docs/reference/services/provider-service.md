# Provider Service

The Provider Service enables the creation and management of ecosystems and webhooks.

!!! warning "Named vs Anonymous ecosystems"
    There are two types of ecosystems: *named* and *anonymous*.

    Named ecosystems are suitable for production, and will be prepared for you by Trinsic during onboarding.

    Anonymous ecosystems have auto-generated names (such as `eager-elephant-94jkn5h`), and may be created by anyone at any time.

    Using an anonymous ecosystem for purposes other than prototyping and testing is considered an unauthorized use of Trinsic's platform.

---

## Create Ecosystem

Creates a new ecosystem, along with a root controlling account.

If `name` is left empty, an anonymous ecosystem will be created.

{{proto_sample_start()}}
    === "Trinsic CLI"
        ```bash
        trinsic provider create-ecosystem --name <ECOSYSTEM_NAME> --email <OWNER_EMAIL>
        ```
    === "TypeScript"
        <!--codeinclude-->
        ```typescript
        [CreateEcosystem](../../../web/test/ProviderService.test.ts) inside_block:createEcosystem
        ```
        <!--/codeinclude-->

    === "C#"
        <!--codeinclude-->
        ```csharp
        [CreateEcosystem](../../../dotnet/Tests/Tests.cs) inside_block:createEcosystem
        ```
        <!--/codeinclude-->

    === "Python"
        <!--codeinclude-->
        ```python
        [CreateEcosystem](../../../python/samples/ecosystem_demo.py) inside_block:createEcosystem
        ```
        <!--/codeinclude-->

    === "Go"
        <!--codeinclude-->
        ```golang
        [CreateEcosystem](../../../go/services/services_test.go) inside_block:createEcosystem
        ```
        <!--/codeinclude-->

    === "Java"
        <!--codeinclude-->
        ```java
        [CreateEcosystem](../../../java/src/test/java/trinsic/EcosystemsDemo.java) inside_block:createEcosystem
        ```
        <!--/codeinclude-->

{{ proto_method_tabs("services.provider.v1.Provider.CreateEcosystem") }}

---

## Update Ecosystem

Updates the active ecosystem's `description` or `uri`.

{{proto_sample_start()}}
    === "Trinsic CLI"
        ```bash
        trinsic provider update-ecosystem \
                         --description "New description" \
                         --uri "https://new-example.com"
        ```

    === "TypeScript"
        <!--codeinclude--> 
        ```typescript
        [UpdateEcosystem](../../../web/test/ProviderService.test.ts) inside_block:updateEcosystem
        ```
        <!--/codeinclude-->

    === "C#"
        <!--codeinclude-->
        ```csharp
        [UpdateEcosystem](../../../dotnet/Tests/Tests.cs) inside_block:updateEcosystem
        ```
        <!--/codeinclude-->

    === "Python"
        <!--codeinclude-->
        ```python
        [UpdateEcosystem](../../../python/samples/provider_demo.py) inside_block:updateEcosystem
        ```
        <!--/codeinclude-->

    === "Go"
        <!--codeinclude-->
        ```golang
        [UpdateEcosystem](../../../go/services/provider_service_test.go) inside_block:updateEcosystem
        ```
        <!--/codeinclude-->

    === "Java"
        <!--codeinclude-->
        ```java
        [UpdateEcosystem](../../../java/src/test/java/trinsic/EcosystemsDemo.java) inside_block:updateEcosystem
        ```
        <!--/codeinclude-->

{{ proto_method_tabs("services.provider.v1.Provider.UpdateEcosystem") }}

---

## Get Ecosystem Info

Fetches information about the active ecosystem.

{{ proto_sample_start() }}
    === "Trinsic CLI"
        ```bash
        trinsic provider ecosystem-info
        ```

    === "TypeScript"
        <!--codeinclude--> 
        ```typescript
        [EcosystemInfo](../../../web/test/ProviderService.test.ts) inside_block:ecosystemInfo
        ```
        <!--/codeinclude-->

    === "C#"
        <!--codeinclude-->
        ```csharp
        [EcosystemInfo](../../../dotnet/Tests/Tests.cs) inside_block:ecosystemInfo
        ```
        <!--/codeinclude-->

    === "Python"
        <!--codeinclude-->
        ```python
        [EcosystemInfo](../../../python/samples/provider_demo.py) inside_block:ecosystemInfo
        ```
        <!--/codeinclude-->

    === "Go"
        <!--codeinclude-->
        ```golang
        [EcosystemInfo](../../../go/services/provider_service_test.go) inside_block:ecosystemInfo
        ```
        <!--/codeinclude-->

    === "Java"
        <!--codeinclude-->
        ```java
        [EcosystemInfo](../../../java/src/test/java/trinsic/EcosystemsDemo.java) inside_block:ecosystemInfo
        ```
        <!--/codeinclude-->

{{ proto_method_tabs("services.provider.v1.Provider.EcosystemInfo") }}

---

## Add Webhook

Adds a webhook to an ecosystem.

{{ proto_sample_start() }}
    === "Trinsic CLI"
        ```bash
        trinsic provider add-webhook \
                        --url "https://example.com/webhooks/trinsic" \
                        --secret "my well-kept secret" \
                        --events "*"
        ```

    === "TypeScript"
        <!--codeinclude--> 
        ```typescript
        [AddWebhook](../../../web/test/ProviderService.test.ts) inside_block:addWebhook
        ```
        <!--/codeinclude-->

    === "C#"
        <!--codeinclude-->
        ```csharp
        [AddWebhook](../../../dotnet/Tests/Tests.cs) inside_block:addWebhook
        ```
        <!--/codeinclude-->

    === "Python"
        <!--codeinclude-->
        ```python
        [AddWebhook](../../../python/samples/provider_demo.py) inside_block:addWebhook
        ```
        <!--/codeinclude-->

    === "Go"
        <!--codeinclude-->
        ```golang
        [AddWebhook](../../../go/services/provider_service_test.go) inside_block:addWebhook
        ```
        <!--/codeinclude-->

    === "Java"
        <!--codeinclude-->
        ```java
        [AddWebhook](../../../java/src/test/java/trinsic/EcosystemsDemo.java) inside_block:addWebhook
        ```
        <!--/codeinclude-->

{{ proto_method_tabs("services.provider.v1.Provider.AddWebhook") }}

!!! warning "Webhook Limits"
    At present, an ecosystem can have no more than 10 webhooks.

!!! tip "Wallet Webhook Events"
    In order to receive webhooks for events which occur on a wallet, an additional authorization step must be performed.

    See [AuthorizeWebhook](/reference/services/account-service#authorize-webhook) for more info.

---

## Delete Webhook

Deletes a webhook from an ecosystem.

{{ proto_sample_start() }}
    === "Trinsic CLI"
        ```bash
        trinsic provider delete-webhook --webhook-id <WEBHOOK_ID>
        ```

    === "TypeScript"
        <!--codeinclude--> 
        ```typescript
        [DeleteWebhook](../../../web/test/ProviderService.test.ts) inside_block:deleteWebhook
        ```
        <!--/codeinclude-->

    === "C#"
        <!--codeinclude-->
        ```csharp
        [DeleteWebhook](../../../dotnet/Tests/Tests.cs) inside_block:deleteWebhook
        ```
        <!--/codeinclude-->

    === "Python"
        <!--codeinclude-->
        ```python
        [DeleteWebhook](../../../python/samples/provider_demo.py) inside_block:deleteWebhook
        ```
        <!--/codeinclude-->

    === "Go"
        <!--codeinclude-->
        ```golang
        [DeleteWebhook](../../../go/services/provider_service_test.go) inside_block:deleteWebhook
        ```
        <!--/codeinclude-->

    === "Java"
        <!--codeinclude-->
        ```java
        [DeleteWebhook](../../../java/src/test/java/trinsic/EcosystemsDemo.java) inside_block:deleteWebhook
        ```
        <!--/codeinclude-->

{{ proto_method_tabs("services.provider.v1.Provider.DeleteWebhook") }}

<!-- 
// This call is not yet implemented
## List Ecosystems

Lists all available ecosystem for the current authentication context.

When using one of the SDKs, you must supply an [List Ecosystem Request](../proto/index.md#listecosystemrequest) object. This object follows the model below:

{{ proto_message('services.provider.v1.ListEcosystemRequest') }}

The response model is of type [List Ecosystem Response](../proto/index.md#listecosystemresponse):

{{ proto_message('services.provider.v1.ListEcosystemResponse') }} 
-->

<!--

Excluding invitation documentation pending re-thinking

To revert this, find the contents of this file before 6/9/2022 :~)

-->