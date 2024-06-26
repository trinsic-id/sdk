


# Protocol Documentation
<a name="top"></a>

This page documents the Protobuf Services and Messages which compose the Trinsic API.



<a name="services_options_field-options-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/options/field-options.proto


 <!-- end services -->


<a name="services-options-AnnotationOption"></a>

### AnnotationOption



| Field | Type | Description |
| ----- | ---- | ----------- |
| active | [bool](/reference/proto#bool) | Is this annotation active |
| message | [string](/reference/proto#string) | Custom annotation message to provide |






<a name="services-options-SdkTemplateOption"></a>

### SdkTemplateOption



| Field | Type | Description |
| ----- | ---- | ----------- |
| anonymous | [bool](/reference/proto#bool) | Whether the service endpoint allows anonymous (no auth token necessary) authentication This is used by the `protoc-gen-trinsic-sdk` plugin for metadata. |
| ignore | [bool](/reference/proto#bool) | Whether the SDK template generator should ignore this method. This method will be wrapped manually. |
| no_arguments | [bool](/reference/proto#bool) | Whether the SDK template generator should generate this method without arguments, eg ProviderService.GetEcosystemInfo() where the request object is empty |
| experimental | [AnnotationOption](/reference/proto#services-options-AnnotationOption) | This endpoint is experimental. Consider it in beta, so documentation may be incomplete or incorrect. |
| deprecated | [AnnotationOption](/reference/proto#services-options-AnnotationOption) | This endpoint is deprecated. It will be removed in the future. |





 <!-- end messages -->

 <!-- end enums -->


<a name="services_options_field-options-proto-extensions"></a>

### File-level Extensions
| Extension | Type | Base | Number | Description |
| --------- | ---- | ---- | ------ | ----------- |
| optional | bool | .google.protobuf.FieldOptions | 60000 | Whether field is optional in Trinsic's backend. This is not the same as an `optional` protobuf label; it only impacts documentation generation for the field. |
| sdk_template_option | SdkTemplateOption | .google.protobuf.MethodOptions | 60001 |  |

 <!-- end HasExtensions -->



<a name="services_verifiable-credentials_v1_verifiable-credentials-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/verifiable-credentials/v1/verifiable-credentials.proto



<a name="services-verifiablecredentials-v1-VerifiableCredential"></a>

### Service - VerifiableCredential


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| IssueFromTemplate | [IssueFromTemplateRequest](/reference/proto#services-verifiablecredentials-v1-IssueFromTemplateRequest) | [IssueFromTemplateResponse](/reference/proto#services-verifiablecredentials-v1-IssueFromTemplateResponse) | Sign and issue a verifiable credential from a pre-defined template. This process will also add schema validation and revocation registry values to the credential. |
| CheckStatus | [CheckStatusRequest](/reference/proto#services-verifiablecredentials-v1-CheckStatusRequest) | [CheckStatusResponse](/reference/proto#services-verifiablecredentials-v1-CheckStatusResponse) | Check credential status in the revocation registry |
| UpdateStatus | [UpdateStatusRequest](/reference/proto#services-verifiablecredentials-v1-UpdateStatusRequest) | [UpdateStatusResponse](/reference/proto#services-verifiablecredentials-v1-UpdateStatusResponse) | Update credential status by setting the revocation value |
| CreateProof | [CreateProofRequest](/reference/proto#services-verifiablecredentials-v1-CreateProofRequest) | [CreateProofResponse](/reference/proto#services-verifiablecredentials-v1-CreateProofResponse) | Create a proof from a signed document that is a valid verifiable credential and contains a signature from which a proof can be derived. |
| VerifyProof | [VerifyProofRequest](/reference/proto#services-verifiablecredentials-v1-VerifyProofRequest) | [VerifyProofResponse](/reference/proto#services-verifiablecredentials-v1-VerifyProofResponse) | Verifies a proof by checking the signature value, and if possible schema validation, revocation status, and issuer status against a trust registry |
| Send | [SendRequest](/reference/proto#services-verifiablecredentials-v1-SendRequest) | [SendResponse](/reference/proto#services-verifiablecredentials-v1-SendResponse) | Sends a document directly to a user's email within the given ecosystem |
| CreateCredentialOffer | [CreateCredentialOfferRequest](/reference/proto#services-verifiablecredentials-v1-CreateCredentialOfferRequest) | [CreateCredentialOfferResponse](/reference/proto#services-verifiablecredentials-v1-CreateCredentialOfferResponse) | Create credential offer |
| AcceptCredential | [AcceptCredentialRequest](/reference/proto#services-verifiablecredentials-v1-AcceptCredentialRequest) | [AcceptCredentialResponse](/reference/proto#services-verifiablecredentials-v1-AcceptCredentialResponse) | Accept an offer to exchange a credential |
| RejectCredential | [RejectCredentialRequest](/reference/proto#services-verifiablecredentials-v1-RejectCredentialRequest) | [RejectCredentialResponse](/reference/proto#services-verifiablecredentials-v1-RejectCredentialResponse) | Reject an offer to exchange a credential |

 <!-- end services -->


<a name="services-verifiablecredentials-v1-AcceptCredentialRequest"></a>

### AcceptCredentialRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| document_json | [string](/reference/proto#string) | The JSON document that contains the credential offer |
| item_id | [string](/reference/proto#string) | The ID of the credential offer (Parameter ID inside the JSON document) |






<a name="services-verifiablecredentials-v1-AcceptCredentialResponse"></a>

### AcceptCredentialResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | [string](/reference/proto#string) | The ID of the item in the wallet that contains the issued credential |
| document_json | [string](/reference/proto#string) | The JSON document that contains the issued credential. This item is already stored in the wallet. |






<a name="services-verifiablecredentials-v1-CheckStatusRequest"></a>

### CheckStatusRequest
Request to check a credential's revocation status


| Field | Type | Description |
| ----- | ---- | ----------- |
| credential_status_id | [string](/reference/proto#string) | Credential Status ID to check. This is not the same as the credential's ID. |






<a name="services-verifiablecredentials-v1-CheckStatusResponse"></a>

### CheckStatusResponse
Response to `CheckStatusRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| revoked | [bool](/reference/proto#bool) | The credential's revocation status |






<a name="services-verifiablecredentials-v1-CreateCredentialOfferRequest"></a>

### CreateCredentialOfferRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| template_id | [string](/reference/proto#string) | ID of template to use |
| values_json | [string](/reference/proto#string) | JSON document string with keys corresponding to the fields of the template referenced by `template_id` |
| holder_binding | [bool](/reference/proto#bool) | If true, the credential will be issued with holder binding by specifying the holder DID in the credential subject |
| include_governance | [bool](/reference/proto#bool) | If true, the issued credential will contain an attestation of the issuer's membership in the ecosystem's Trust Registry. |
| generate_share_url | [bool](/reference/proto#bool) | If true, a short URL link will be generated that can be used to share the credential offer with the holder. This link will point to the credential offer in the wallet app. |
| signature_type | [SignatureType](/reference/proto#services-verifiablecredentials-v1-SignatureType) | The type of signature to use when signing the credential. Defaults to `EXPERIMENTAL`. |






<a name="services-verifiablecredentials-v1-CreateCredentialOfferResponse"></a>

### CreateCredentialOfferResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| document_json | [string](/reference/proto#string) | The JSON document that contains the credential offer |
| share_url | [string](/reference/proto#string) | If requested, a URL that can be used to share the credential offer with the holder. This is a short URL that can be used in a QR code and will redirect the holder to the credential offer using the wallet app. |






<a name="services-verifiablecredentials-v1-CreateProofRequest"></a>

### CreateProofRequest
Request to create a proof for a Verifiable Credential using public key tied to caller.
Either `item_id`, or `document_json` may be provided, not both.


| Field | Type | Description |
| ----- | ---- | ----------- |
| reveal_document_json | [string](/reference/proto#string) | A valid JSON-LD frame describing which fields should be revealed in the generated proof. If unspecified, all fields in the document will be revealed |
| reveal_template | [RevealTemplateAttributes](/reference/proto#services-verifiablecredentials-v1-RevealTemplateAttributes) | Information about what sections of the document to reveal |
| verification_template_id | [string](/reference/proto#string) | Id of verification template with which to construct the JSON-LD proof document |
| item_id | [string](/reference/proto#string) | ID of wallet item stored in a Trinsic cloud wallet |
| document_json | [string](/reference/proto#string) | A valid JSON-LD Verifiable Credential document string with an unbound signature. The proof will be derived from this document directly. The document will not be stored in the wallet. |
| use_verifiable_presentation | [bool](/reference/proto#bool) | Wrap the output in a verifiable presentation. If the credential used in the proof is bound to the holder DID, the output will always use a verifiable presentation and this field will be ignored. |
| nonce | [bytes](/reference/proto#bytes) | Nonce value used to derive the proof. If not specified, a random nonce will be generated. This value may be represented in base64 format in the proof model. |






<a name="services-verifiablecredentials-v1-CreateProofResponse"></a>

### CreateProofResponse
Response to `CreateProofRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| proof_document_json | [string](/reference/proto#string) | Valid JSON-LD proof for the specified credential |






<a name="services-verifiablecredentials-v1-IssueFromTemplateRequest"></a>

### IssueFromTemplateRequest
Request to create and sign a JSON-LD Verifiable Credential from a template using public key tied to caller


| Field | Type | Description |
| ----- | ---- | ----------- |
| template_id | [string](/reference/proto#string) | ID of template to use |
| values_json | [string](/reference/proto#string) | JSON document string with keys corresponding to the fields of the template referenced by `template_id` |
| save_copy | [bool](/reference/proto#bool) | Save a copy of the issued credential to this user's wallet. This copy will only contain the credential data, but not the secret proof value. Issuers may use this data to keep track of the details for revocation status. |
| expiration_date | [string](/reference/proto#string) | The ISO8601 expiration UTC date of the credential. This is a reserved field in the VC specification. If specified, the issued credential will contain an expiration date. https://www.w3.org/TR/vc-data-model/#expiration |
| include_governance | [bool](/reference/proto#bool) | If true, the issued credential will contain an attestation of the issuer's membership in the ecosystem's Trust Registry. |
| signature_type | [SignatureType](/reference/proto#services-verifiablecredentials-v1-SignatureType) | The type of signature to use when signing the credential. Defaults to `EXPERIMENTAL`. |






<a name="services-verifiablecredentials-v1-IssueFromTemplateResponse"></a>

### IssueFromTemplateResponse
Response to `IssueFromTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| document_json | [string](/reference/proto#string) | Verifiable Credential document, in JSON-LD form, constructed from the specified template and values; signed with public key tied to caller of `IssueFromTemplateRequest` |






<a name="services-verifiablecredentials-v1-RejectCredentialRequest"></a>

### RejectCredentialRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| document_json | [string](/reference/proto#string) | The JSON document that contains the credential offer |
| item_id | [string](/reference/proto#string) | The ID of the credential offer (Parameter ID inside the JSON document) |






<a name="services-verifiablecredentials-v1-RejectCredentialResponse"></a>

### RejectCredentialResponse







<a name="services-verifiablecredentials-v1-RevealTemplateAttributes"></a>

### RevealTemplateAttributes



| Field | Type | Description |
| ----- | ---- | ----------- |
| template_attributes | [string](/reference/proto#string)[] | A list of document attributes to reveal. If unset, all attributes will be returned. |






<a name="services-verifiablecredentials-v1-SendRequest"></a>

### SendRequest
Request to send a document to another user's wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| email | [string](/reference/proto#string) | Email address of user to whom you'll send the item |
| wallet_id | [string](/reference/proto#string) | Wallet ID of the recipient within the ecosystem |
| did_uri | [string](/reference/proto#string) | DID URI of the recipient |
| phone_number | [string](/reference/proto#string) | SMS of user to whom you'll send the item |
| send_notification | [bool](/reference/proto#bool) | Send email notification that credential has been sent to a wallet |
| document_json | [string](/reference/proto#string) | JSON document to send to recipient |






<a name="services-verifiablecredentials-v1-SendResponse"></a>

### SendResponse
Response to `SendRequest`






<a name="services-verifiablecredentials-v1-UpdateStatusRequest"></a>

### UpdateStatusRequest
Request to update a credential's revocation status


| Field | Type | Description |
| ----- | ---- | ----------- |
| credential_status_id | [string](/reference/proto#string) | Credential Status ID to update. This is not the same as the credential's ID. |
| revoked | [bool](/reference/proto#bool) | New revocation status of credential |






<a name="services-verifiablecredentials-v1-UpdateStatusResponse"></a>

### UpdateStatusResponse
Response to `UpdateStatusRequest`






<a name="services-verifiablecredentials-v1-ValidationMessage"></a>

### ValidationMessage
Result of a validation check on a proof


| Field | Type | Description |
| ----- | ---- | ----------- |
| is_valid | [bool](/reference/proto#bool) | Whether this validation check passed |
| messages | [string](/reference/proto#string)[] | If validation failed, contains messages explaining why |






<a name="services-verifiablecredentials-v1-VerifyProofRequest"></a>

### VerifyProofRequest
Request to verify a proof


| Field | Type | Description |
| ----- | ---- | ----------- |
| proof_document_json | [string](/reference/proto#string) | JSON-LD proof document string to verify |






<a name="services-verifiablecredentials-v1-VerifyProofResponse"></a>

### VerifyProofResponse
Response to `VerifyProofRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| is_valid | [bool](/reference/proto#bool) | Whether all validations in `validation_results` passed |
| validation_results | [VerifyProofResponse.ValidationResultsEntry](/reference/proto#services-verifiablecredentials-v1-VerifyProofResponse-ValidationResultsEntry)[] | Results of each validation check performed, such as schema conformance, revocation status, signature, etc. Detailed results are provided for failed validations. |






<a name="services-verifiablecredentials-v1-VerifyProofResponse-ValidationResultsEntry"></a>

### VerifyProofResponse.ValidationResultsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [ValidationMessage](/reference/proto#services-verifiablecredentials-v1-ValidationMessage) |  |





 <!-- end messages -->


<a name="services-verifiablecredentials-v1-SignatureType"></a>

### SignatureType


| Name | Number | Description |
| ---- | ------ | ----------- |
| UNSPECIFIED | 0 | The signature type is not specified. The experimental signature type will be used. |
| STANDARD | 1 | The signature type uses EdDSA with the Ed25519 curve (NIST compliant). This type of signature does not support selective disclosure of attributes. |
| EXPERIMENTAL | 2 | The signature type uses BBS signatures with BLS12-381 curve (experimental). This type of signature allows for selective disclosure of attributes. |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_verifiable-credentials_templates_v1_templates-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/verifiable-credentials/templates/v1/templates.proto



<a name="services-verifiablecredentials-templates-v1-CredentialTemplates"></a>

### Service - CredentialTemplates


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| Create | [CreateCredentialTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest) | [CreateCredentialTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-CreateCredentialTemplateResponse) | Create a credential template in the current ecosystem |
| Get | [GetCredentialTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-GetCredentialTemplateRequest) | [GetCredentialTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-GetCredentialTemplateResponse) | Fetch a credential template by ID |
| Update | [UpdateCredentialTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest) | [UpdateCredentialTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-UpdateCredentialTemplateResponse) | Update metadata of a template |
| List | [ListCredentialTemplatesRequest](/reference/proto#services-verifiablecredentials-templates-v1-ListCredentialTemplatesRequest) | [ListCredentialTemplatesResponse](/reference/proto#services-verifiablecredentials-templates-v1-ListCredentialTemplatesResponse) | Search credential templates using SQL, returning strongly-typed template data |
| Search | [SearchCredentialTemplatesRequest](/reference/proto#services-verifiablecredentials-templates-v1-SearchCredentialTemplatesRequest) | [SearchCredentialTemplatesResponse](/reference/proto#services-verifiablecredentials-templates-v1-SearchCredentialTemplatesResponse) | Search credential templates using SQL, returning raw JSON data |
| Delete | [DeleteCredentialTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-DeleteCredentialTemplateRequest) | [DeleteCredentialTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-DeleteCredentialTemplateResponse) | Delete a credential template from the current ecosystem by ID |
| CreateVerificationTemplate | [CreateVerificationTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-CreateVerificationTemplateRequest) | [CreateVerificationTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-CreateVerificationTemplateResponse) | Create/update verification templates |
| ListVerificationTemplates | [ListVerificationTemplatesRequest](/reference/proto#services-verifiablecredentials-templates-v1-ListVerificationTemplatesRequest) | [ListVerificationTemplatesResponse](/reference/proto#services-verifiablecredentials-templates-v1-ListVerificationTemplatesResponse) |  |
| GetVerificationTemplate | [GetVerificationTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-GetVerificationTemplateRequest) | [GetVerificationTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-GetVerificationTemplateResponse) |  |
| UpdateVerificationTemplate | [UpdateVerificationTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-UpdateVerificationTemplateRequest) | [UpdateVerificationTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-UpdateVerificationTemplateResponse) |  |
| DeleteVerificationTemplate | [DeleteVerificationTemplateRequest](/reference/proto#services-verifiablecredentials-templates-v1-DeleteVerificationTemplateRequest) | [DeleteVerificationTemplateResponse](/reference/proto#services-verifiablecredentials-templates-v1-DeleteVerificationTemplateResponse) |  |

 <!-- end services -->


<a name="services-verifiablecredentials-templates-v1-AppleWalletOptions"></a>

### AppleWalletOptions
Configuration options for Apple Wallet when


| Field | Type | Description |
| ----- | ---- | ----------- |
| background_color | [string](/reference/proto#string) | Background color, in hex format, of credential when stored in an Apple Wallet. |
| foreground_color | [string](/reference/proto#string) | Foreground color, in hex format, of credential when stored in an Apple Wallet. |
| label_color | [string](/reference/proto#string) | Label color, in hex format, of credential when stored in an Apple Wallet. |
| primary_field | [string](/reference/proto#string) | The ID of the template field which should be used as the primary field of a credential. |
| secondary_fields | [string](/reference/proto#string)[] | The secondary fields of the credential. This is a mapping between the order of a secondary field (0 or 1) and the field name. |
| auxiliary_fields | [string](/reference/proto#string)[] | The auxiliary fields of the credential. This is a mapping between the order of an auxiliary field (0 or 1) and the field name. |






<a name="services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest"></a>

### CreateCredentialTemplateRequest
Request to create a new template


| Field | Type | Description |
| ----- | ---- | ----------- |
| name | [string](/reference/proto#string) | Name of new template. Must be a unique identifier within its ecosystem. |
| fields | [CreateCredentialTemplateRequest.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest-FieldsEntry)[] | Fields which compose the template |
| allow_additional_fields | [bool](/reference/proto#bool) | Whether credentials may be issued against this template which have fields not specified in `fields` |
| title | [string](/reference/proto#string) | Human-readable name of template |
| description | [string](/reference/proto#string) | Human-readable description of template |
| field_ordering | [CreateCredentialTemplateRequest.FieldOrderingEntry](/reference/proto#services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest-FieldOrderingEntry)[] | Optional map describing how to order and categorize the fields within the template. The key of this map is the field `name`. If not provided, this will be auto-generated. |
| apple_wallet_options | [AppleWalletOptions](/reference/proto#services-verifiablecredentials-templates-v1-AppleWalletOptions) | Options for rendering the template in Apple Wallet |






<a name="services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest-FieldOrderingEntry"></a>

### CreateCredentialTemplateRequest.FieldOrderingEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [FieldOrdering](/reference/proto#services-verifiablecredentials-templates-v1-FieldOrdering) |  |






<a name="services-verifiablecredentials-templates-v1-CreateCredentialTemplateRequest-FieldsEntry"></a>

### CreateCredentialTemplateRequest.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [TemplateField](/reference/proto#services-verifiablecredentials-templates-v1-TemplateField) |  |






<a name="services-verifiablecredentials-templates-v1-CreateCredentialTemplateResponse"></a>

### CreateCredentialTemplateResponse
Response to `CreateCredentialTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| data | [TemplateData](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData) | Created template |






<a name="services-verifiablecredentials-templates-v1-CreateVerificationTemplateRequest"></a>

### CreateVerificationTemplateRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| name | [string](/reference/proto#string) | Name of new template. Must be a unique identifier within its ecosystem. |
| fields | [CreateVerificationTemplateRequest.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-CreateVerificationTemplateRequest-FieldsEntry)[] | Fields which will be required in the verification proof template

TODO - Add support for predicate types - currently only equality. |
| credential_template_id | [string](/reference/proto#string) | Source credential template, used for verifying that the specified `fields` are present in the credential template |
| title | [string](/reference/proto#string) | Human-readable name of template |
| description | [string](/reference/proto#string) | Human-readable description of template |






<a name="services-verifiablecredentials-templates-v1-CreateVerificationTemplateRequest-FieldsEntry"></a>

### CreateVerificationTemplateRequest.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [VerificationTemplateField](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateField) |  |






<a name="services-verifiablecredentials-templates-v1-CreateVerificationTemplateResponse"></a>

### CreateVerificationTemplateResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| data | [VerificationTemplateData](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateData) |  |






<a name="services-verifiablecredentials-templates-v1-DeleteCredentialTemplateRequest"></a>

### DeleteCredentialTemplateRequest
Request to delete a template by ID


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of template to delete |






<a name="services-verifiablecredentials-templates-v1-DeleteCredentialTemplateResponse"></a>

### DeleteCredentialTemplateResponse
Response to `DeleteCredentialTemplateRequest`






<a name="services-verifiablecredentials-templates-v1-DeleteVerificationTemplateRequest"></a>

### DeleteVerificationTemplateRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| verification_template_id | [string](/reference/proto#string) |  |






<a name="services-verifiablecredentials-templates-v1-DeleteVerificationTemplateResponse"></a>

### DeleteVerificationTemplateResponse
This space intentionally left blank






<a name="services-verifiablecredentials-templates-v1-FieldOrdering"></a>

### FieldOrdering
Ordering information for a template field


| Field | Type | Description |
| ----- | ---- | ----------- |
| order | [int32](/reference/proto#int32) | The order of the field; must be unique within the Template. Fields are sorted by order ascending when displaying a credential. Field orders must be contiguous from `0` to the number of fields minus 1. |
| section | [string](/reference/proto#string) | The human-readable name of the section this field appears in; used to group together fields when displaying a credential. Sections must be contiguous with respect to `order`. |






<a name="services-verifiablecredentials-templates-v1-GetCredentialTemplateRequest"></a>

### GetCredentialTemplateRequest
Request to fetch a template by ID


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of template to fetch |






<a name="services-verifiablecredentials-templates-v1-GetCredentialTemplateResponse"></a>

### GetCredentialTemplateResponse
Response to `GetCredentialTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| template | [TemplateData](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData) | Template fetched by ID |






<a name="services-verifiablecredentials-templates-v1-GetVerificationTemplateRequest"></a>

### GetVerificationTemplateRequest
Request to fetch a template by ID


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of template to fetch |






<a name="services-verifiablecredentials-templates-v1-GetVerificationTemplateResponse"></a>

### GetVerificationTemplateResponse
Response to `GetCredentialTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| template | [VerificationTemplateData](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateData) | Template fetched by ID |






<a name="services-verifiablecredentials-templates-v1-ListCredentialTemplatesRequest"></a>

### ListCredentialTemplatesRequest
Request to list templates using a SQL query


| Field | Type | Description |
| ----- | ---- | ----------- |
| query | [string](/reference/proto#string) | SQL query to execute. Example: `SELECT * FROM c WHERE c.name = 'Diploma'` |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `ListCredentialTemplatesResponse` if more data is available for query |






<a name="services-verifiablecredentials-templates-v1-ListCredentialTemplatesResponse"></a>

### ListCredentialTemplatesResponse
Response to `ListCredentialTemplatesRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| templates | [TemplateData](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData)[] | Templates found by query |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `ListCredentialTemplatesRequest` |






<a name="services-verifiablecredentials-templates-v1-ListVerificationTemplatesRequest"></a>

### ListVerificationTemplatesRequest
Request to list templates using a SQL query


| Field | Type | Description |
| ----- | ---- | ----------- |
| query | [string](/reference/proto#string) | SQL query to execute. Example: `SELECT * FROM c WHERE c.name = 'Diploma'` |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `ListCredentialTemplatesResponse` if more data is available for query |






<a name="services-verifiablecredentials-templates-v1-ListVerificationTemplatesResponse"></a>

### ListVerificationTemplatesResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| templates | [VerificationTemplateData](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateData)[] | Templates found by query |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `ListVerificationTemplatesRequest` |






<a name="services-verifiablecredentials-templates-v1-SearchCredentialTemplatesRequest"></a>

### SearchCredentialTemplatesRequest
Request to search templates using a SQL query


| Field | Type | Description |
| ----- | ---- | ----------- |
| query | [string](/reference/proto#string) | SQL query to execute. Example: `SELECT * FROM c WHERE c.name = 'Diploma'` |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `SearchCredentialTemplatesResponse` if more data is available for query |






<a name="services-verifiablecredentials-templates-v1-SearchCredentialTemplatesResponse"></a>

### SearchCredentialTemplatesResponse
Response to `SearchCredentialTemplatesRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| items_json | [string](/reference/proto#string) | Raw JSON data returned from query |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `SearchCredentialTemplatesRequest` |






<a name="services-verifiablecredentials-templates-v1-TemplateData"></a>

### TemplateData
Credential Template


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | Template ID |
| name | [string](/reference/proto#string) | Template name |
| version | [int32](/reference/proto#int32) | Template version number |
| fields | [TemplateData.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData-FieldsEntry)[] | Fields defined for the template |
| allow_additional_fields | [bool](/reference/proto#bool) | Whether credentials issued against this template may contain fields not defined by template |
| schema_uri | [string](/reference/proto#string) | URI pointing to template JSON schema document |
| ecosystem_id | [string](/reference/proto#string) | ID of ecosystem in which template resides |
| type | [string](/reference/proto#string) | Template type (`VerifiableCredential`) |
| created_by | [string](/reference/proto#string) | ID of template creator |
| date_created | [string](/reference/proto#string) | Date when template was created as ISO 8601 utc string |
| title | [string](/reference/proto#string) | Human-readable template title |
| description | [string](/reference/proto#string) | Human-readable template description |
| field_ordering | [TemplateData.FieldOrderingEntry](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData-FieldOrderingEntry)[] | Map describing how to order and categorize the fields within the template. The key of this map is the field `name`. |
| apple_wallet_options | [AppleWalletOptions](/reference/proto#services-verifiablecredentials-templates-v1-AppleWalletOptions) | Options for rendering the template in Apple Wallet |






<a name="services-verifiablecredentials-templates-v1-TemplateData-FieldOrderingEntry"></a>

### TemplateData.FieldOrderingEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [FieldOrdering](/reference/proto#services-verifiablecredentials-templates-v1-FieldOrdering) |  |






<a name="services-verifiablecredentials-templates-v1-TemplateData-FieldsEntry"></a>

### TemplateData.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [TemplateField](/reference/proto#services-verifiablecredentials-templates-v1-TemplateField) |  |






<a name="services-verifiablecredentials-templates-v1-TemplateField"></a>

### TemplateField
A field defined in a template


| Field | Type | Description |
| ----- | ---- | ----------- |
| title | [string](/reference/proto#string) | Human-readable name of the field |
| description | [string](/reference/proto#string) | Human-readable description of the field |
| optional | [bool](/reference/proto#bool) | Whether this field may be omitted when a credential is issued against the template |
| type | [FieldType](/reference/proto#services-verifiablecredentials-templates-v1-FieldType) | The type of the field |
| uri_data | [UriFieldData](/reference/proto#services-verifiablecredentials-templates-v1-UriFieldData) | How to deal with this URI field when rendering credential. Only use if `type` is `URI`. |






<a name="services-verifiablecredentials-templates-v1-TemplateFieldPatch"></a>

### TemplateFieldPatch
A patch to apply to an existing template field


| Field | Type | Description |
| ----- | ---- | ----------- |
| title | [string](/reference/proto#string) | Human-readable name of the field |
| description | [string](/reference/proto#string) | Human-readable description of the field |
| uri_data | [UriFieldData](/reference/proto#services-verifiablecredentials-templates-v1-UriFieldData) | How to deal with this URI field when rendering credential. Only use if `type` is `URI`. |






<a name="services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest"></a>

### UpdateCredentialTemplateRequest
Request to update display information for a template


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of Template to update |
| title | [string](/reference/proto#string) | New human-readable title of Template |
| description | [string](/reference/proto#string) | New human-readable description of Template |
| fields | [UpdateCredentialTemplateRequest.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest-FieldsEntry)[] | Fields to update within the Template |
| field_ordering | [UpdateCredentialTemplateRequest.FieldOrderingEntry](/reference/proto#services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest-FieldOrderingEntry)[] | New field ordering options. See documentation for template creation for usage information. |
| apple_wallet_options | [AppleWalletOptions](/reference/proto#services-verifiablecredentials-templates-v1-AppleWalletOptions) | New Apple Wallet configuration |






<a name="services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest-FieldOrderingEntry"></a>

### UpdateCredentialTemplateRequest.FieldOrderingEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [FieldOrdering](/reference/proto#services-verifiablecredentials-templates-v1-FieldOrdering) |  |






<a name="services-verifiablecredentials-templates-v1-UpdateCredentialTemplateRequest-FieldsEntry"></a>

### UpdateCredentialTemplateRequest.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [TemplateFieldPatch](/reference/proto#services-verifiablecredentials-templates-v1-TemplateFieldPatch) |  |






<a name="services-verifiablecredentials-templates-v1-UpdateCredentialTemplateResponse"></a>

### UpdateCredentialTemplateResponse
Response to `UpdateCredentialTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| updated_template | [TemplateData](/reference/proto#services-verifiablecredentials-templates-v1-TemplateData) | The Template after the update has been applied |






<a name="services-verifiablecredentials-templates-v1-UpdateVerificationTemplateRequest"></a>

### UpdateVerificationTemplateRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of Template to update |
| title | [string](/reference/proto#string) | New human-readable title of Template |
| description | [string](/reference/proto#string) | New human-readable description of Template |
| fields | [UpdateVerificationTemplateRequest.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-UpdateVerificationTemplateRequest-FieldsEntry)[] | Fields to update within the Template |






<a name="services-verifiablecredentials-templates-v1-UpdateVerificationTemplateRequest-FieldsEntry"></a>

### UpdateVerificationTemplateRequest.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [VerificationTemplateFieldPatch](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateFieldPatch) |  |






<a name="services-verifiablecredentials-templates-v1-UpdateVerificationTemplateResponse"></a>

### UpdateVerificationTemplateResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| template | [VerificationTemplateData](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateData) |  |






<a name="services-verifiablecredentials-templates-v1-UriFieldData"></a>

### UriFieldData
Data pertaining to a URI Field


| Field | Type | Description |
| ----- | ---- | ----------- |
| mime_type | [string](/reference/proto#string) | Expected MIME Type of content pointed to by URI. Can be generic (eg, "image/") or specific ("image/png"). Defaults to "application/octet-stream". |
| render_method | [UriRenderMethod](/reference/proto#services-verifiablecredentials-templates-v1-UriRenderMethod) | How to display the URI value when rendering a credential. |






<a name="services-verifiablecredentials-templates-v1-VerificationTemplateData"></a>

### VerificationTemplateData
Verification Template


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | Template ID |
| name | [string](/reference/proto#string) | Template name |
| version | [int32](/reference/proto#int32) | Template version number |
| fields | [VerificationTemplateData.FieldsEntry](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateData-FieldsEntry)[] | Fields defined for the template |
| credential_template_id | [string](/reference/proto#string) | Source credential template, used for verifying that the specified `fields` are present in the credential template |
| ecosystem_id | [string](/reference/proto#string) | ID of ecosystem in which template resides |
| type | [string](/reference/proto#string) | Template type (`VerificationTemplate`) |
| created_by | [string](/reference/proto#string) | ID of template creator |
| date_created | [string](/reference/proto#string) | Date when template was created as ISO 8601 utc string |
| title | [string](/reference/proto#string) | Human-readable template title |
| description | [string](/reference/proto#string) | Human-readable template description |






<a name="services-verifiablecredentials-templates-v1-VerificationTemplateData-FieldsEntry"></a>

### VerificationTemplateData.FieldsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [VerificationTemplateField](/reference/proto#services-verifiablecredentials-templates-v1-VerificationTemplateField) |  |






<a name="services-verifiablecredentials-templates-v1-VerificationTemplateField"></a>

### VerificationTemplateField
A field defined in a template


| Field | Type | Description |
| ----- | ---- | ----------- |
| field_share_type | [VerificationShareType](/reference/proto#services-verifiablecredentials-templates-v1-VerificationShareType) | Whether this field may be omitted on proof creation |
| usage_policy | [string](/reference/proto#string) | User-facing explanation of what is done with this data

TODO - Future work supporting proof conditionals/ranges/etc |






<a name="services-verifiablecredentials-templates-v1-VerificationTemplateFieldPatch"></a>

### VerificationTemplateFieldPatch
A patch to apply to an existing template field


| Field | Type | Description |
| ----- | ---- | ----------- |
| field_share_type | [VerificationShareType](/reference/proto#services-verifiablecredentials-templates-v1-VerificationShareType) | Human-readable name of the field |
| usage_policy | [string](/reference/proto#string) | User-facing explanation of what is done with this data |





 <!-- end messages -->


<a name="services-verifiablecredentials-templates-v1-FieldType"></a>

### FieldType
Valid types for credential fields

| Name | Number | Description |
| ---- | ------ | ----------- |
| STRING | 0 |  |
| NUMBER | 1 |  |
| BOOL | 2 |  |
| DATETIME | 4 |  |
| URI | 5 |  |



<a name="services-verifiablecredentials-templates-v1-UriRenderMethod"></a>

### UriRenderMethod
How to display a URI value when rendering a credential.

| Name | Number | Description |
| ---- | ------ | ----------- |
| TEXT | 0 | Display URI as text |
| LINK | 1 | Display URI as a clickable link |
| INLINE_IMAGE | 2 | Display URI as an inline image. Only takes effect if the template field's MIME Type is an image type. |



<a name="services-verifiablecredentials-templates-v1-VerificationShareType"></a>

### VerificationShareType


| Name | Number | Description |
| ---- | ------ | ----------- |
| OPTIONAL | 0 |  |
| REQUIRED | 1 |  |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_file-management_v1_file-management-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/file-management/v1/file-management.proto



<a name="services-filemanagement-v1-FileManagement"></a>

### Service - FileManagement


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| UploadFile | [UploadFileRequest](/reference/proto#services-filemanagement-v1-UploadFileRequest) | [UploadFileResponse](/reference/proto#services-filemanagement-v1-UploadFileResponse) | Upload a file to Trinsic's CDN |
| GetFile | [GetFileRequest](/reference/proto#services-filemanagement-v1-GetFileRequest) | [GetFileResponse](/reference/proto#services-filemanagement-v1-GetFileResponse) | Fetch information about a file by its ID |
| DeleteFile | [DeleteFileRequest](/reference/proto#services-filemanagement-v1-DeleteFileRequest) | [DeleteFileResponse](/reference/proto#services-filemanagement-v1-DeleteFileResponse) | Delete a file by its ID |
| ListFiles | [ListFilesRequest](/reference/proto#services-filemanagement-v1-ListFilesRequest) | [ListFilesResponse](/reference/proto#services-filemanagement-v1-ListFilesResponse) | List files the calling account has uploaded |
| GetStorageStats | [GetStorageStatsRequest](/reference/proto#services-filemanagement-v1-GetStorageStatsRequest) | [GetStorageStatsResponse](/reference/proto#services-filemanagement-v1-GetStorageStatsResponse) | Get statistics about files uploaded by the calling account |

 <!-- end services -->


<a name="services-filemanagement-v1-DeleteFileRequest"></a>

### DeleteFileRequest
Request to delete a file from Trinsic's CDN by ID


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of file to delete |






<a name="services-filemanagement-v1-DeleteFileResponse"></a>

### DeleteFileResponse
Response to `DeleteFileRequest`. Empty payload.






<a name="services-filemanagement-v1-File"></a>

### File
Contains information about a file stored in Trinsic's CDN


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of file, generated randomly by Trinsic on upload |
| uploader_id | [string](/reference/proto#string) | Wallet ID of uploader |
| size | [uint32](/reference/proto#uint32) | Size, in bytes, of file |
| mime_type | [string](/reference/proto#string) | Uploader-provided MIME type of file |
| uploaded | [string](/reference/proto#string) | ISO 8601 timestamp of when file was uploaded to Trinsic |
| url | [string](/reference/proto#string) | CDN URL of file |






<a name="services-filemanagement-v1-GetFileRequest"></a>

### GetFileRequest
Request to fetch information about a stored file


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | ID of file to fetch |






<a name="services-filemanagement-v1-GetFileResponse"></a>

### GetFileResponse
Response to `GetFileRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| file | [File](/reference/proto#services-filemanagement-v1-File) | File specified by `id` parameter of `GetFileRequest`. |






<a name="services-filemanagement-v1-GetStorageStatsRequest"></a>

### GetStorageStatsRequest
Request to get statistics about files uploaded by this account






<a name="services-filemanagement-v1-GetStorageStatsResponse"></a>

### GetStorageStatsResponse
Response to `GetStorageStatsRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| stats | [StorageStats](/reference/proto#services-filemanagement-v1-StorageStats) | Statistics about files uploaded by the calling account |






<a name="services-filemanagement-v1-ListFilesRequest"></a>

### ListFilesRequest
Request to list files


| Field | Type | Description |
| ----- | ---- | ----------- |
| query | [string](/reference/proto#string) | Query to search with. If not specified, will return the most recent 100 files. |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `ListFilesRequest` if more data is available for query |






<a name="services-filemanagement-v1-ListFilesResponse"></a>

### ListFilesResponse
Response to `ListFilesRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| files | [File](/reference/proto#services-filemanagement-v1-File)[] | Files found by query |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `ListFilesRequest` |






<a name="services-filemanagement-v1-StorageStats"></a>

### StorageStats
Represents aggregate statistics of all files uploaded by a single issuer


| Field | Type | Description |
| ----- | ---- | ----------- |
| num_files | [uint32](/reference/proto#uint32) | Number of files uploaded by this account |
| total_size | [uint64](/reference/proto#uint64) | Sum total size of all files, in bytes |






<a name="services-filemanagement-v1-UploadFileRequest"></a>

### UploadFileRequest
Request to upload a file to Trinsic's CDN


| Field | Type | Description |
| ----- | ---- | ----------- |
| contents | [bytes](/reference/proto#bytes) | Raw content of file |
| mime_type | [string](/reference/proto#string) | MIME type describing file contents |






<a name="services-filemanagement-v1-UploadFileResponse"></a>

### UploadFileResponse
Response to `UploadFileRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| uploaded_file | [File](/reference/proto#services-filemanagement-v1-File) | Information about newly-uploaded file |





 <!-- end messages -->

 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_universal-wallet_v1_universal-wallet-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/universal-wallet/v1/universal-wallet.proto



<a name="services-universalwallet-v1-UniversalWallet"></a>

### Service - UniversalWallet
Service for managing wallets

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetItem | [GetItemRequest](/reference/proto#services-universalwallet-v1-GetItemRequest) | [GetItemResponse](/reference/proto#services-universalwallet-v1-GetItemResponse) | Retrieve an item from the wallet with a given item identifier |
| Search | [SearchRequest](/reference/proto#services-universalwallet-v1-SearchRequest) | [SearchResponse](/reference/proto#services-universalwallet-v1-SearchResponse) | Search the wallet using a SQL syntax |
| InsertItem | [InsertItemRequest](/reference/proto#services-universalwallet-v1-InsertItemRequest) | [InsertItemResponse](/reference/proto#services-universalwallet-v1-InsertItemResponse) | Insert an item into the wallet |
| UpdateItem | [UpdateItemRequest](/reference/proto#services-universalwallet-v1-UpdateItemRequest) | [UpdateItemResponse](/reference/proto#services-universalwallet-v1-UpdateItemResponse) | Update an item in the wallet |
| DeleteItem | [DeleteItemRequest](/reference/proto#services-universalwallet-v1-DeleteItemRequest) | [DeleteItemResponse](/reference/proto#services-universalwallet-v1-DeleteItemResponse) | Delete an item from the wallet permanently |
| DeleteWallet | [DeleteWalletRequest](/reference/proto#services-universalwallet-v1-DeleteWalletRequest) | [DeleteWalletResponse](/reference/proto#services-universalwallet-v1-DeleteWalletResponse) | Delete a wallet and its credentials |
| CreateWallet | [CreateWalletRequest](/reference/proto#services-universalwallet-v1-CreateWalletRequest) | [CreateWalletResponse](/reference/proto#services-universalwallet-v1-CreateWalletResponse) | Create a new wallet and generate an auth token for access |
| GetWalletInfo | [GetWalletInfoRequest](/reference/proto#services-universalwallet-v1-GetWalletInfoRequest) | [GetWalletInfoResponse](/reference/proto#services-universalwallet-v1-GetWalletInfoResponse) | Retrieve wallet details and configuration |
| GetMyInfo | [GetMyInfoRequest](/reference/proto#services-universalwallet-v1-GetMyInfoRequest) | [GetMyInfoResponse](/reference/proto#services-universalwallet-v1-GetMyInfoResponse) | Retrieve wallet details and configuration about the currently authenticated wallet |
| GetWalletFromExternalIdentity | [GetWalletFromExternalIdentityRequest](/reference/proto#services-universalwallet-v1-GetWalletFromExternalIdentityRequest) | [GetWalletFromExternalIdentityResponse](/reference/proto#services-universalwallet-v1-GetWalletFromExternalIdentityResponse) | Retrieve information from an ecosystem wallet by searching for its external identity (email or phone) |
| GenerateAuthToken | [GenerateAuthTokenRequest](/reference/proto#services-universalwallet-v1-GenerateAuthTokenRequest) | [GenerateAuthTokenResponse](/reference/proto#services-universalwallet-v1-GenerateAuthTokenResponse) | Generate new token for a given wallet and add it to the collection of known auth tokens. This endpoint requires authentication and will return a new token ID and auth token. Use this endpoint if you want to authorize another device, without having to share your existing auth token. |
| RevokeAuthToken | [RevokeAuthTokenRequest](/reference/proto#services-universalwallet-v1-RevokeAuthTokenRequest) | [RevokeAuthTokenResponse](/reference/proto#services-universalwallet-v1-RevokeAuthTokenResponse) | Revokes a previously issued auth token and updates the collection of known auth tokens. This endpoint requires authentication. |
| AddExternalIdentityInit | [AddExternalIdentityInitRequest](/reference/proto#services-universalwallet-v1-AddExternalIdentityInitRequest) | [AddExternalIdentityInitResponse](/reference/proto#services-universalwallet-v1-AddExternalIdentityInitResponse) | Add new external identity to the current wallet, such as email, sms, ethereum address, etc. This identity ownership must be confirmed using `AddIdentityConfirm` via OTP, signature, etc. |
| AddExternalIdentityConfirm | [AddExternalIdentityConfirmRequest](/reference/proto#services-universalwallet-v1-AddExternalIdentityConfirmRequest) | [AddExternalIdentityConfirmResponse](/reference/proto#services-universalwallet-v1-AddExternalIdentityConfirmResponse) | Confirm identity added to the current wallet using `AddExternalIdentityInit` |
| RemoveExternalIdentity | [RemoveExternalIdentityRequest](/reference/proto#services-universalwallet-v1-RemoveExternalIdentityRequest) | [RemoveExternalIdentityResponse](/reference/proto#services-universalwallet-v1-RemoveExternalIdentityResponse) | Remove an external identity from the current wallet |
| AuthenticateInit | [AuthenticateInitRequest](/reference/proto#services-universalwallet-v1-AuthenticateInitRequest) | [AuthenticateInitResponse](/reference/proto#services-universalwallet-v1-AuthenticateInitResponse) | Sign-in to an already existing wallet, using an identity added that was previously registered This endpoint does not require authentication, and will return a challenge to be signed or verified |
| AuthenticateConfirm | [AuthenticateConfirmRequest](/reference/proto#services-universalwallet-v1-AuthenticateConfirmRequest) | [AuthenticateConfirmResponse](/reference/proto#services-universalwallet-v1-AuthenticateConfirmResponse) | Confirm sign-in to an already existing wallet and return authentication token |
| AuthenticateResendCode | [AuthenticateResendCodeRequest](/reference/proto#services-universalwallet-v1-AuthenticateResendCodeRequest) | [AuthenticateResendCodeResponse](/reference/proto#services-universalwallet-v1-AuthenticateResendCodeResponse) | Resend previous authentication code |
| ListWallets | [ListWalletsRequest](/reference/proto#services-universalwallet-v1-ListWalletsRequest) | [ListWalletsResponse](/reference/proto#services-universalwallet-v1-ListWalletsResponse) | List all wallets in the ecosystem |
| ListByVerificationTemplate | [ListByVerificationTemplateRequest](/reference/proto#services-universalwallet-v1-ListByVerificationTemplateRequest) | [ListByVerificationTemplateResponse](/reference/proto#services-universalwallet-v1-ListByVerificationTemplateResponse) | List credentials which match a given verification template |

 <!-- end services -->


<a name="services-universalwallet-v1-AddExternalIdentityConfirmRequest"></a>

### AddExternalIdentityConfirmRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| challenge | [string](/reference/proto#string) | The challenge received from the `AddExternalIdentityInit` endpoint |
| response | [string](/reference/proto#string) | The response to the challenge. If using Email or Phone, this is the OTP code sent to the user's email or phone |






<a name="services-universalwallet-v1-AddExternalIdentityConfirmResponse"></a>

### AddExternalIdentityConfirmResponse







<a name="services-universalwallet-v1-AddExternalIdentityInitRequest"></a>

### AddExternalIdentityInitRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [string](/reference/proto#string) | The user identity to add to the wallet This can be an email address or phone number (formatted as +[country code][phone number]) |
| provider | [services.provider.v1.IdentityProvider](/reference/proto#services-provider-v1-IdentityProvider) | The type of identity provider, like EMAIL or PHONE |






<a name="services-universalwallet-v1-AddExternalIdentityInitResponse"></a>

### AddExternalIdentityInitResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| challenge | [string](/reference/proto#string) | Challenge or reference to the challenge to be used in the `AddExternalIdentityConfirm` endpoint |






<a name="services-universalwallet-v1-AuthenticateConfirmRequest"></a>

### AuthenticateConfirmRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| challenge | [string](/reference/proto#string) | The challenge received from the `AcquireAuthTokenInit` endpoint |
| response | [string](/reference/proto#string) | The response to the challenge. If using Email or Phone, this is the OTP code sent to the user's email or phone |






<a name="services-universalwallet-v1-AuthenticateConfirmResponse"></a>

### AuthenticateConfirmResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| auth_token | [string](/reference/proto#string) | Auth token for the wallet |






<a name="services-universalwallet-v1-AuthenticateInitRequest"></a>

### AuthenticateInitRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [string](/reference/proto#string) | Identity to add to the wallet |
| provider | [services.provider.v1.IdentityProvider](/reference/proto#services-provider-v1-IdentityProvider) | Identity provider |
| ecosystem_id | [string](/reference/proto#string) | Ecosystem ID to which the wallet belongs |






<a name="services-universalwallet-v1-AuthenticateInitResponse"></a>

### AuthenticateInitResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| challenge | [string](/reference/proto#string) | The challenge received from the `AcquireAuthTokenInit` endpoint Pass this challenge back to the `AcquireAuthTokenConfirm` endpoint |






<a name="services-universalwallet-v1-AuthenticateResendCodeRequest"></a>

### AuthenticateResendCodeRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| challenge | [string](/reference/proto#string) | Challenge for the code you want resent. |






<a name="services-universalwallet-v1-AuthenticateResendCodeResponse"></a>

### AuthenticateResendCodeResponse







<a name="services-universalwallet-v1-CreateWalletRequest"></a>

### CreateWalletRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| ecosystem_id | [string](/reference/proto#string) | Ecosystem ID of the wallet to create |
| description | [string](/reference/proto#string) | Wallet name or description. Use this field to add vendor specific information about this wallet, such as email, phone, internal ID, or anything you'd like to associate with this wallet. This field is searchable. |
| identity | [CreateWalletRequest.ExternalIdentity](/reference/proto#services-universalwallet-v1-CreateWalletRequest-ExternalIdentity) | Optional identity to add to the wallet (email or sms). Use this field when inviting participants into an ecosystem. If this field is set, an auth token will not be sent in the response. |






<a name="services-universalwallet-v1-CreateWalletRequest-ExternalIdentity"></a>

### CreateWalletRequest.ExternalIdentity



| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [string](/reference/proto#string) | The user identity to add to the wallet This can be an email address or phone number (formatted as +[country code][phone number]) |
| provider | [services.provider.v1.IdentityProvider](/reference/proto#services-provider-v1-IdentityProvider) | The type of identity provider, like EMAIL or PHONE |






<a name="services-universalwallet-v1-CreateWalletResponse"></a>

### CreateWalletResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| auth_token | [string](/reference/proto#string) | Auth token for the newly created wallet |
| token_id | [string](/reference/proto#string) | Token ID of the newly generated token |
| wallet | [services.provider.v1.WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration) | Wallet configuration |






<a name="services-universalwallet-v1-DeleteItemRequest"></a>

### DeleteItemRequest
Request to delete an item in a wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | [string](/reference/proto#string) | ID of item to delete |






<a name="services-universalwallet-v1-DeleteItemResponse"></a>

### DeleteItemResponse
Response to `DeleteItemRequest`






<a name="services-universalwallet-v1-DeleteWalletRequest"></a>

### DeleteWalletRequest
Request to delete a wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| email | [string](/reference/proto#string) | Email address of account to delete. Mutually exclusive with `walletId` and `didUri`. |
| wallet_id | [string](/reference/proto#string) | Wallet ID of account to delete. Mutually exclusive with `email` and `didUri`. |
| did_uri | [string](/reference/proto#string) | DID URI of the account to delete. Mutually exclusive with `email` and `walletId`. |






<a name="services-universalwallet-v1-DeleteWalletResponse"></a>

### DeleteWalletResponse
Response to `DeleteWalletRequest`. Empty payload.






<a name="services-universalwallet-v1-GenerateAuthTokenRequest"></a>

### GenerateAuthTokenRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet_id | [string](/reference/proto#string) |  |
| token_description | [string](/reference/proto#string) |  |






<a name="services-universalwallet-v1-GenerateAuthTokenResponse"></a>

### GenerateAuthTokenResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| token_id | [string](/reference/proto#string) |  |
| auth_token | [string](/reference/proto#string) |  |






<a name="services-universalwallet-v1-GetItemRequest"></a>

### GetItemRequest
Request to fetch an item from wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | [string](/reference/proto#string) | ID of item in wallet |






<a name="services-universalwallet-v1-GetItemResponse"></a>

### GetItemResponse
Response to `GetItemRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_json | [string](/reference/proto#string) | Item data as a JSON string |
| item_type | [string](/reference/proto#string) | Type of item specified when item was inserted into wallet |






<a name="services-universalwallet-v1-GetMyInfoRequest"></a>

### GetMyInfoRequest
Request to retrieve wallet information about the currently authenticated wallet






<a name="services-universalwallet-v1-GetMyInfoResponse"></a>

### GetMyInfoResponse
Response to `GetMyInfoRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet | [services.provider.v1.WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration) | Wallet configuration |






<a name="services-universalwallet-v1-GetWalletFromExternalIdentityRequest"></a>

### GetWalletFromExternalIdentityRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [services.provider.v1.WalletExternalIdentity](/reference/proto#services-provider-v1-WalletExternalIdentity) |  |






<a name="services-universalwallet-v1-GetWalletFromExternalIdentityResponse"></a>

### GetWalletFromExternalIdentityResponse
Response to `GetWalletFromExternalIdentityRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet | [services.provider.v1.WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration) | Wallet configuration |






<a name="services-universalwallet-v1-GetWalletInfoRequest"></a>

### GetWalletInfoRequest
Request to retrieve wallet information about a given wallet identified by its wallet ID


| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet_id | [string](/reference/proto#string) | Wallet ID of the wallet to retrieve |






<a name="services-universalwallet-v1-GetWalletInfoResponse"></a>

### GetWalletInfoResponse
Response to `GetWalletInfoRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet | [services.provider.v1.WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration) | Wallet configuration |






<a name="services-universalwallet-v1-InsertItemRequest"></a>

### InsertItemRequest
Request to insert a JSON document into a wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_json | [string](/reference/proto#string) | Document to insert; must be stringified JSON |
| item_type | [string](/reference/proto#string) | Item type (ex. "VerifiableCredential") |






<a name="services-universalwallet-v1-InsertItemResponse"></a>

### InsertItemResponse
Response to `InsertItemRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | [string](/reference/proto#string) | ID of item inserted into wallet |






<a name="services-universalwallet-v1-ListByVerificationTemplateRequest"></a>

### ListByVerificationTemplateRequest
Request to list templates by


| Field | Type | Description |
| ----- | ---- | ----------- |
| verification_template_id | [string](/reference/proto#string) | ID of verification template to list matching credentials |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `ListCredentialTemplatesResponse` if more data is available for query |






<a name="services-universalwallet-v1-ListByVerificationTemplateResponse"></a>

### ListByVerificationTemplateResponse
Response to `ListByVerificationTemplateRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| items | [string](/reference/proto#string)[] | Array of query results, as JSON strings |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `ListByVerificationTemplateRequest` |






<a name="services-universalwallet-v1-ListWalletsRequest"></a>

### ListWalletsRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| filter | [string](/reference/proto#string) |  |






<a name="services-universalwallet-v1-ListWalletsResponse"></a>

### ListWalletsResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| wallets | [services.provider.v1.WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration)[] |  |






<a name="services-universalwallet-v1-RemoveExternalIdentityRequest"></a>

### RemoveExternalIdentityRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [string](/reference/proto#string) | The user identity to remove from the wallet This can be an email address or phone number (formatted as +[country code][phone number]) |






<a name="services-universalwallet-v1-RemoveExternalIdentityResponse"></a>

### RemoveExternalIdentityResponse







<a name="services-universalwallet-v1-RevokeAuthTokenRequest"></a>

### RevokeAuthTokenRequest
Request to revoke a previously issued auth token


| Field | Type | Description |
| ----- | ---- | ----------- |
| wallet_id | [string](/reference/proto#string) | Wallet ID of the wallet to from which to revoke the token |
| token_id | [string](/reference/proto#string) | Token ID of the token to revoke |






<a name="services-universalwallet-v1-RevokeAuthTokenResponse"></a>

### RevokeAuthTokenResponse







<a name="services-universalwallet-v1-SearchRequest"></a>

### SearchRequest
Request to search items in wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| query | [string](/reference/proto#string) | SQL Query to execute against items in wallet |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `SearchResponse` if more data is available for query |






<a name="services-universalwallet-v1-SearchResponse"></a>

### SearchResponse
Response to `SearchRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| items | [string](/reference/proto#string)[] | Array of query results, as JSON strings |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `SearchRequest` |






<a name="services-universalwallet-v1-UpdateItemRequest"></a>

### UpdateItemRequest
Request to update item in wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| item_id | [string](/reference/proto#string) | ID of item in wallet |
| item_type | [string](/reference/proto#string) | Item type (ex. "VerifiableCredential") |






<a name="services-universalwallet-v1-UpdateItemResponse"></a>

### UpdateItemResponse
Response to `UpdateItemRequest`





 <!-- end messages -->

 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_connect_v1_connect-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/connect/v1/connect.proto



<a name="services-connect-v1-Connect"></a>

### Service - Connect
The Connect service provides access to Trinsic Connect, a reusable identity verification service.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CreateSession | [CreateSessionRequest](/reference/proto#services-connect-v1-CreateSessionRequest) | [CreateSessionResponse](/reference/proto#services-connect-v1-CreateSessionResponse) | Create an IDVSession |
| CancelSession | [CancelSessionRequest](/reference/proto#services-connect-v1-CancelSessionRequest) | [CancelSessionResponse](/reference/proto#services-connect-v1-CancelSessionResponse) | Cancel an IDVSession |
| GetSession | [GetSessionRequest](/reference/proto#services-connect-v1-GetSessionRequest) | [GetSessionResponse](/reference/proto#services-connect-v1-GetSessionResponse) | Get an IDVSession |
| ListSessions | [ListSessionsRequest](/reference/proto#services-connect-v1-ListSessionsRequest) | [ListSessionsResponse](/reference/proto#services-connect-v1-ListSessionsResponse) | List IDVSessions created by the calling wallet |
| HasValidCredential | [HasValidCredentialRequest](/reference/proto#services-connect-v1-HasValidCredentialRequest) | [HasValidCredentialResponse](/reference/proto#services-connect-v1-HasValidCredentialResponse) | Checks if the identity provided in the request has a wallet containing a valid reusable credential |

 <!-- end services -->


<a name="services-connect-v1-CancelSessionRequest"></a>

### CancelSessionRequest
Request to cancel an Identity Verification Session


| Field | Type | Description |
| ----- | ---- | ----------- |
| idv_session_id | [string](/reference/proto#string) | The ID of the IDVSession to cancel |






<a name="services-connect-v1-CancelSessionResponse"></a>

### CancelSessionResponse
Response to `CancelIDVSessionRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| session | [IDVSession](/reference/proto#services-connect-v1-IDVSession) | The IDVSession in its current state after cancellation |






<a name="services-connect-v1-CreateSessionRequest"></a>

### CreateSessionRequest
Request to create an Identity Verification Session


| Field | Type | Description |
| ----- | ---- | ----------- |
| verifications | [RequestedVerification](/reference/proto#services-connect-v1-RequestedVerification)[] | Array of verifications to perform |
| debug_information | [CreateSessionRequest.DebugInformationEntry](/reference/proto#services-connect-v1-CreateSessionRequest-DebugInformationEntry)[] | Debugging information used to help diagnose issues |
| demo_rp | [DemoRelyingParty](/reference/proto#services-connect-v1-DemoRelyingParty) | Information about the Relying Party used for demo purposes. This is only to be used if the demo flag is set to true in the debug information. |






<a name="services-connect-v1-CreateSessionRequest-DebugInformationEntry"></a>

### CreateSessionRequest.DebugInformationEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [string](/reference/proto#string) |  |






<a name="services-connect-v1-CreateSessionResponse"></a>

### CreateSessionResponse
Response to `CreateIDVSessionRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| session | [IDVSession](/reference/proto#services-connect-v1-IDVSession) | The created IDVSession |






<a name="services-connect-v1-CredentialRequestData"></a>

### CredentialRequestData



| Field | Type | Description |
| ----- | ---- | ----------- |
| type | [VerificationType](/reference/proto#services-connect-v1-VerificationType) | The type of verification for which the credential can be used

Name of the IDV issuer |






<a name="services-connect-v1-DemoRelyingParty"></a>

### DemoRelyingParty
Information about a Relying Party used for demo purposes


| Field | Type | Description |
| ----- | ---- | ----------- |
| display_name | [string](/reference/proto#string) |  |
| logo_url | [string](/reference/proto#string) |  |
| primary_color | [string](/reference/proto#string) |  |






<a name="services-connect-v1-GetSessionRequest"></a>

### GetSessionRequest
Request to get an IDVSession


| Field | Type | Description |
| ----- | ---- | ----------- |
| idv_session_id | [string](/reference/proto#string) | The ID of the IDVSession to get |






<a name="services-connect-v1-GetSessionResponse"></a>

### GetSessionResponse
Response to `GetIDVSessionRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| session | [IDVSession](/reference/proto#services-connect-v1-IDVSession) | The IDVSession |






<a name="services-connect-v1-GovernmentIDFields"></a>

### GovernmentIDFields
Selection of fields to retrieve from a Government ID. All fields default to `false` unless explicitly set to `true`.


| Field | Type | Description |
| ----- | ---- | ----------- |
| id_number | [bool](/reference/proto#bool) | ID number of the underlying identity document |
| given_name | [bool](/reference/proto#bool) | Given ("first") name of the document holder |
| family_name | [bool](/reference/proto#bool) | Family ("last") name of the document holder |
| address | [bool](/reference/proto#bool) | Full address of the document holder |
| date_of_birth | [bool](/reference/proto#bool) | Date of birth of the document holder |
| country | [bool](/reference/proto#bool) | ISO3 country code of the document |
| issue_date | [bool](/reference/proto#bool) | Issuance date of the document |
| expiration_date | [bool](/reference/proto#bool) | Expiration date date of the document |






<a name="services-connect-v1-GovernmentIDOptions"></a>

### GovernmentIDOptions
Options for a Verification of type `GOVERNMENT_ID`


| Field | Type | Description |
| ----- | ---- | ----------- |
| fields | [GovernmentIDFields](/reference/proto#services-connect-v1-GovernmentIDFields) | The fields to retrieve from the Government ID. If this object is not set, all fields will be retrieved. |






<a name="services-connect-v1-HasValidCredentialRequest"></a>

### HasValidCredentialRequest
Request to preemptively check if an identity has a valid reusable credential


| Field | Type | Description |
| ----- | ---- | ----------- |
| identity | [services.universalwallet.v1.CreateWalletRequest.ExternalIdentity](/reference/proto#services-universalwallet-v1-CreateWalletRequest-ExternalIdentity) | The identity used to find a credential |
| credential_request_data | [CredentialRequestData](/reference/proto#services-connect-v1-CredentialRequestData) | The criteria used to find a valid credential |






<a name="services-connect-v1-HasValidCredentialResponse"></a>

### HasValidCredentialResponse
Response to `HasValidCredentialRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| has_valid_credential | [bool](/reference/proto#bool) | Whether the identity has a valid credential |






<a name="services-connect-v1-IDVSession"></a>

### IDVSession
An Identity Verification Session


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | The ID of the IDVSession. |
| client_token | [string](/reference/proto#string) | The Client Token for this IDVSession. This should be passed to your frontend to initiate the IDV flow using Trinsic's Web SDK. |
| state | [IDVSessionState](/reference/proto#services-connect-v1-IDVSessionState) | State of the IDVSession |
| verifications | [IDVSession.VerificationsEntry](/reference/proto#services-connect-v1-IDVSession-VerificationsEntry)[] | The actual Verifications to perform in this IDV flow |
| fail_code | [SessionFailCode](/reference/proto#services-connect-v1-SessionFailCode) | The reason for the IDVSession's failure. Only set if `state` is `IDV_FAILED`. |
| result_vp | [string](/reference/proto#string) | The resultant signed VP combining the results of all verifications |
| created | [fixed64](/reference/proto#fixed64) | The unix timestamp, in seconds, that this IDVSession was created |
| updated | [fixed64](/reference/proto#fixed64) | The unix timestamp, in seconds, that this IDVSession's `state` was last updated |






<a name="services-connect-v1-IDVSession-VerificationsEntry"></a>

### IDVSession.VerificationsEntry



| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) |  |
| value | [Verification](/reference/proto#services-connect-v1-Verification) |  |






<a name="services-connect-v1-ListSessionsRequest"></a>

### ListSessionsRequest
Request to list all IDVSessions you've created


| Field | Type | Description |
| ----- | ---- | ----------- |
| order_by | [SessionOrdering](/reference/proto#services-connect-v1-SessionOrdering) | The field by which sessions should be sorted. Defaults to `CREATED`. |
| order_direction | [services.common.v1.OrderDirection](/reference/proto#services-common-v1-OrderDirection) | The order in which sessions should be sorted. Defaults to `ASCENDING`. |
| page_size | [int32](/reference/proto#int32) | The number of results to return per page. Must be between `1` and `10`, inclusive. Defaults to `10`. |
| page | [int32](/reference/proto#int32) | The page index of results to return. Starts at `1`. Defaults to `1`. |






<a name="services-connect-v1-ListSessionsResponse"></a>

### ListSessionsResponse
Response to `ListIDVSessionsRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| sessions | [IDVSession](/reference/proto#services-connect-v1-IDVSession)[] | The sessions you've created |
| total | [int32](/reference/proto#int32) | The total number of sessions you've created |
| more | [bool](/reference/proto#bool) | If `true`, this is not the last page of results. If `false`, this is the last page of results. |






<a name="services-connect-v1-NormalizedGovernmentIdData"></a>

### NormalizedGovernmentIdData



| Field | Type | Description |
| ----- | ---- | ----------- |
| id_number | [string](/reference/proto#string) | The ID number of the underlying identity document |
| given_name | [string](/reference/proto#string) | Given ("first") name of the document holder |
| family_name | [string](/reference/proto#string) | Family ("last") name of the document holder |
| address | [string](/reference/proto#string) | Full address of the document holder |
| date_of_birth | [string](/reference/proto#string) | Date of birth of the document holder |
| country | [string](/reference/proto#string) | ISO3 country code of the document |
| issue_date | [string](/reference/proto#string) | Issuance date of the document |
| expiration_date | [string](/reference/proto#string) | Expiration date date of the document |






<a name="services-connect-v1-RequestedVerification"></a>

### RequestedVerification
A verification to perform in an IDV flow


| Field | Type | Description |
| ----- | ---- | ----------- |
| type | [VerificationType](/reference/proto#services-connect-v1-VerificationType) | The type of verification to perform |
| government_id_options | [GovernmentIDOptions](/reference/proto#services-connect-v1-GovernmentIDOptions) | Options for a Verification of type `GOVERNMENT_ID` |






<a name="services-connect-v1-Verification"></a>

### Verification
A Verification that is part of an IDVSession


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | The ID of the verification |
| type | [VerificationType](/reference/proto#services-connect-v1-VerificationType) | The type of verification (driver's license, passport, proof of address, etc) |
| state | [VerificationState](/reference/proto#services-connect-v1-VerificationState) | The state of the verification |
| fail_code | [VerificationFailCode](/reference/proto#services-connect-v1-VerificationFailCode) | The reason for the Verification's failure. Only set if `state` is `VERIFICATION_FAILED`. |
| reused | [bool](/reference/proto#bool) | Whether this was a reused (true) or fresh (false) verification. If `state` is not `VERIFICATION_SUCCESS`, this field is `false` and does not convey useful information. |
| updated | [fixed64](/reference/proto#fixed64) | The unix timestamp, in seconds, when this verification last changed state -- or `0` if it has not yet begun. |
| government_id_options | [GovernmentIDOptions](/reference/proto#services-connect-v1-GovernmentIDOptions) | The Government ID options for this Verification. Only set if this Verification is of type `GOVERNMENT_ID`. |
| normalized_government_id_data | [NormalizedGovernmentIdData](/reference/proto#services-connect-v1-NormalizedGovernmentIdData) | Normalized output for manual parsing and usage for this verification Only set if this Verification is of type `GOVERNMENT_ID` and has succeeded. |





 <!-- end messages -->


<a name="services-connect-v1-IDVSessionState"></a>

### IDVSessionState
The states a VerificationSession can be in

| Name | Number | Description |
| ---- | ------ | ----------- |
| IDV_CREATED | 0 | Session has been created, but not yet shown to user |
| IDV_INITIATED | 1 | Session has been shown to user (iframe / popup opened), but user has not yet logged in. |
| IDV_AUTHENTICATING | 2 | User has entered their phone number, but not yet authenticated with the code sent via SMS |
| IDV_IN_PROGRESS | 3 | User has been authenticated and is performing identity verification |
| IDV_SUCCESS | 4 | Session was completed successfully and IDV data is available to RP |
| IDV_FAILED | 5 | The session failed; reason is present in `fail_code`. |



<a name="services-connect-v1-SessionFailCode"></a>

### SessionFailCode
The specific reason an IDVSession is in the `Failed` state

| Name | Number | Description |
| ---- | ------ | ----------- |
| SESSION_FAIL_NONE | 0 | The Session is not in a failure state. |
| SESSION_FAIL_INTERNAL | 1 | An internal Trinsic error caused this session to fail |
| SESSION_FAIL_VERIFICATION_FAILED | 2 | The session failed because one or more of the verifications failed. The reason for the failure is present in the `fail_reason` field of the relevant `Verification` object(s). |
| SESSION_FAIL_AUTHENTICATION | 3 | The session failed because the user failed to authenticate with their phone number too many times. |
| SESSION_FAIL_EXPIRED | 4 | The session expired |
| SESSION_FAIL_USER_CANCELED | 5 | The user canceled / rejected the session |
| SESSION_FAIL_RP_CANCELED | 6 | The RP canceled the session |



<a name="services-connect-v1-SessionOrdering"></a>

### SessionOrdering
Controls how sessions are ordered in `ListSessions`

| Name | Number | Description |
| ---- | ------ | ----------- |
| CREATED | 0 | Order sessions according to when they were created |
| UPDATED | 1 | Order sessions according to when they last changed state |
| STATE | 2 | Order sessions according to their numerical state |



<a name="services-connect-v1-VerificationFailCode"></a>

### VerificationFailCode
The specific reason a Verification is in the `Failed` state

| Name | Number | Description |
| ---- | ------ | ----------- |
| VERIFICATION_FAIL_NONE | 0 | The verification is not in a failure state |
| VERIFICATION_FAIL_INTERNAL | 1 | An internal Trinsic error caused this verification to fail |
| VERIFICATION_FAIL_INVALID_IMAGE | 2 | The image(s) provided for this verification were either too low-quality, not of the correct type, or otherwise unable to be processed. This failure reason is non-terminal; the user is able to retry the verification. |
| VERIFICATION_FAIL_INAUTHENTIC | 3 | The identity data/images provided are suspected to be inauthentic, fraudulent, or forged. |
| VERIFICATION_FAIL_UNSUPPORTED_DOCUMENT | 4 | The document provided is either of an unsupported type, or from an unsupported country. |



<a name="services-connect-v1-VerificationState"></a>

### VerificationState
The states an individual Verification can be in

| Name | Number | Description |
| ---- | ------ | ----------- |
| VERIFICATION_PENDING | 0 | This verification has not yet been performed in the flow |
| VERIFICATION_SUCCESS | 3 | This verification has been successfully completed |
| VERIFICATION_FAILED | 4 | This verification has failed |



<a name="services-connect-v1-VerificationType"></a>

### VerificationType
The type of verification to perform

| Name | Number | Description |
| ---- | ------ | ----------- |
| GOVERNMENT_ID | 0 | Government-issued ID (driver's license, passport, etc) |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_google_api_http-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/google/api/http.proto


 <!-- end services -->


<a name="google-api-CustomHttpPattern"></a>

### CustomHttpPattern
A custom pattern is used for defining custom HTTP verb.


| Field | Type | Description |
| ----- | ---- | ----------- |
| kind | [string](/reference/proto#string) | The name of this custom HTTP verb. |
| path | [string](/reference/proto#string) | The path matched by this custom verb. |






<a name="google-api-Http"></a>

### Http
Defines the HTTP configuration for an API service. It contains a list of
[HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
to one or more HTTP REST API methods.


| Field | Type | Description |
| ----- | ---- | ----------- |
| rules | [HttpRule](/reference/proto#google-api-HttpRule)[] | A list of HTTP configuration rules that apply to individual API methods.

**NOTE:** All service configuration rules follow "last one wins" order. |
| fully_decode_reserved_expansion | [bool](/reference/proto#bool) | When set to true, URL path parameters will be fully URI-decoded except in cases of single segment matches in reserved expansion, where "%2F" will be left encoded.

The default behavior is to not decode RFC 6570 reserved characters in multi segment matches. |






<a name="google-api-HttpRule"></a>

### HttpRule
# gRPC Transcoding

gRPC Transcoding is a feature for mapping between a gRPC method and one or
more HTTP REST endpoints. It allows developers to build a single API service
that supports both gRPC APIs and REST APIs. Many systems, including [Google
APIs](https://github.com/googleapis/googleapis),
[Cloud Endpoints](https://cloud.google.com/endpoints), [gRPC
Gateway](https://github.com/grpc-ecosystem/grpc-gateway),
and [Envoy](https://github.com/envoyproxy/envoy) proxy support this feature
and use it for large scale production services.

`HttpRule` defines the schema of the gRPC/REST mapping. The mapping specifies
how different portions of the gRPC request message are mapped to the URL
path, URL query parameters, and HTTP request body. It also controls how the
gRPC response message is mapped to the HTTP response body. `HttpRule` is
typically specified as an `google.api.http` annotation on the gRPC method.

Each mapping specifies a URL path template and an HTTP method. The path
template may refer to one or more fields in the gRPC request message, as long
as each field is a non-repeated field with a primitive (non-message) type.
The path template controls how fields of the request message are mapped to
the URL path.

Example:

    service Messaging {
      rpc GetMessage(GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get: "/v1/{name=messages/*}"
        };
      }
    }
    message GetMessageRequest {
      string name = 1; // Mapped to URL path.
    }
    message Message {
      string text = 1; // The resource content.
    }

This enables an HTTP REST to gRPC mapping as below:

HTTP | gRPC
-----|-----
`GET /v1/messages/123456`  | `GetMessage(name: "messages/123456")`

Any fields in the request message which are not bound by the path template
automatically become HTTP query parameters if there is no HTTP request body.
For example:

    service Messaging {
      rpc GetMessage(GetMessageRequest) returns (Message) {
        option (google.api.http) = {
            get:"/v1/messages/{message_id}"
        };
      }
    }
    message GetMessageRequest {
      message SubMessage {
        string subfield = 1;
      }
      string message_id = 1; // Mapped to URL path.
      int64 revision = 2;    // Mapped to URL query parameter `revision`.
      SubMessage sub = 3;    // Mapped to URL query parameter `sub.subfield`.
    }

This enables a HTTP JSON to RPC mapping as below:

HTTP | gRPC
-----|-----
`GET /v1/messages/123456?revision=2&sub.subfield=foo` |
`GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield:
"foo"))`

Note that fields which are mapped to URL query parameters must have a
primitive type or a repeated primitive type or a non-repeated message type.
In the case of a repeated type, the parameter can be repeated in the URL
as `...?param=A&param=B`. In the case of a message type, each field of the
message is mapped to a separate parameter, such as
`...?foo.a=A&foo.b=B&foo.c=C`.

For HTTP methods that allow a request body, the `body` field
specifies the mapping. Consider a REST update method on the
message resource collection:

    service Messaging {
      rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
        option (google.api.http) = {
          patch: "/v1/messages/{message_id}"
          body: "message"
        };
      }
    }
    message UpdateMessageRequest {
      string message_id = 1; // mapped to the URL
      Message message = 2;   // mapped to the body
    }

The following HTTP JSON to RPC mapping is enabled, where the
representation of the JSON in the request body is determined by
protos JSON encoding:

HTTP | gRPC
-----|-----
`PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
"123456" message { text: "Hi!" })`

The special name `*` can be used in the body mapping to define that
every field not bound by the path template should be mapped to the
request body.  This enables the following alternative definition of
the update method:

    service Messaging {
      rpc UpdateMessage(Message) returns (Message) {
        option (google.api.http) = {
          patch: "/v1/messages/{message_id}"
          body: "*"
        };
      }
    }
    message Message {
      string message_id = 1;
      string text = 2;
    }


The following HTTP JSON to RPC mapping is enabled:

HTTP | gRPC
-----|-----
`PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
"123456" text: "Hi!")`

Note that when using `*` in the body mapping, it is not possible to
have HTTP parameters, as all fields not bound by the path end in
the body. This makes this option more rarely used in practice when
defining REST APIs. The common usage of `*` is in custom methods
which don't use the URL at all for transferring data.

It is possible to define multiple HTTP methods for one RPC by using
the `additional_bindings` option. Example:

    service Messaging {
      rpc GetMessage(GetMessageRequest) returns (Message) {
        option (google.api.http) = {
          get: "/v1/messages/{message_id}"
          additional_bindings {
            get: "/v1/users/{user_id}/messages/{message_id}"
          }
        };
      }
    }
    message GetMessageRequest {
      string message_id = 1;
      string user_id = 2;
    }

This enables the following two alternative HTTP JSON to RPC mappings:

HTTP | gRPC
-----|-----
`GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
`GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id:
"123456")`

## Rules for HTTP mapping

1. Leaf request fields (recursive expansion nested messages in the request
   message) are classified into three categories:
   - Fields referred by the path template. They are passed via the URL path.
   - Fields referred by the [HttpRule.body][google.api.HttpRule.body]. They are passed via the HTTP
     request body.
   - All other fields are passed via the URL query parameters, and the
     parameter name is the field path in the request message. A repeated
     field can be represented as multiple query parameters under the same
     name.
 2. If [HttpRule.body][google.api.HttpRule.body] is "*", there is no URL query parameter, all fields
    are passed via URL path and HTTP request body.
 3. If [HttpRule.body][google.api.HttpRule.body] is omitted, there is no HTTP request body, all
    fields are passed via URL path and URL query parameters.

### Path template syntax

    Template = "/" Segments [ Verb ] ;
    Segments = Segment { "/" Segment } ;
    Segment  = "*" | "**" | LITERAL | Variable ;
    Variable = "{" FieldPath [ "=" Segments ] "}" ;
    FieldPath = IDENT { "." IDENT } ;
    Verb     = ":" LITERAL ;

The syntax `*` matches a single URL path segment. The syntax `**` matches
zero or more URL path segments, which must be the last part of the URL path
except the `Verb`.

The syntax `Variable` matches part of the URL path as specified by its
template. A variable template must not contain other variables. If a variable
matches a single path segment, its template may be omitted, e.g. `{var}`
is equivalent to `{var=*}`.

The syntax `LITERAL` matches literal text in the URL path. If the `LITERAL`
contains any reserved character, such characters should be percent-encoded
before the matching.

If a variable contains exactly one path segment, such as `"{var}"` or
`"{var=*}"`, when such a variable is expanded into a URL path on the client
side, all characters except `[-_.~0-9a-zA-Z]` are percent-encoded. The
server side does the reverse decoding. Such variables show up in the
[Discovery
Document](https://developers.google.com/discovery/v1/reference/apis) as
`{var}`.

If a variable contains multiple path segments, such as `"{var=foo/*}"`
or `"{var=**}"`, when such a variable is expanded into a URL path on the
client side, all characters except `[-_.~/0-9a-zA-Z]` are percent-encoded.
The server side does the reverse decoding, except "%2F" and "%2f" are left
unchanged. Such variables show up in the
[Discovery
Document](https://developers.google.com/discovery/v1/reference/apis) as
`{+var}`.

## Using gRPC API Service Configuration

gRPC API Service Configuration (service config) is a configuration language
for configuring a gRPC service to become a user-facing product. The
service config is simply the YAML representation of the `google.api.Service`
proto message.

As an alternative to annotating your proto file, you can configure gRPC
transcoding in your service config YAML files. You do this by specifying a
`HttpRule` that maps the gRPC method to a REST endpoint, achieving the same
effect as the proto annotation. This can be particularly useful if you
have a proto that is reused in multiple services. Note that any transcoding
specified in the service config will override any matching transcoding
configuration in the proto.

Example:

    http:
      rules:
        # Selects a gRPC method and applies HttpRule to it.
        - selector: example.v1.Messaging.GetMessage
          get: /v1/messages/{message_id}/{sub.subfield}

## Special notes

When gRPC Transcoding is used to map a gRPC to JSON REST endpoints, the
proto to JSON conversion must follow the [proto3
specification](https://developers.google.com/protocol-buffers/docs/proto3#json).

While the single segment variable follows the semantics of
[RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
Expansion, the multi segment variable **does not** follow RFC 6570 Section
3.2.3 Reserved Expansion. The reason is that the Reserved Expansion
does not expand special characters like `?` and `#`, which would lead
to invalid URLs. As the result, gRPC Transcoding uses a custom encoding
for multi segment variables.

The path variables **must not** refer to any repeated or mapped field,
because client libraries are not capable of handling such variable expansion.

The path variables **must not** capture the leading "/" character. The reason
is that the most common use case "{var}" does not capture the leading "/"
character. For consistency, all path variables must share the same behavior.

Repeated message fields must not be mapped to URL query parameters, because
no client library can support such complicated mapping.

If an API needs to use a JSON array for request or response body, it can map
the request or response body to a repeated field. However, some gRPC
Transcoding implementations may not support this feature.


| Field | Type | Description |
| ----- | ---- | ----------- |
| selector | [string](/reference/proto#string) | Selects a method to which this rule applies.

Refer to [selector][google.api.DocumentationRule.selector] for syntax details. |
| get | [string](/reference/proto#string) | Maps to HTTP GET. Used for listing and getting information about resources. |
| put | [string](/reference/proto#string) | Maps to HTTP PUT. Used for replacing a resource. |
| post | [string](/reference/proto#string) | Maps to HTTP POST. Used for creating a resource or performing an action. |
| delete | [string](/reference/proto#string) | Maps to HTTP DELETE. Used for deleting a resource. |
| patch | [string](/reference/proto#string) | Maps to HTTP PATCH. Used for updating a resource. |
| custom | [CustomHttpPattern](/reference/proto#google-api-CustomHttpPattern) | The custom pattern is used for specifying an HTTP method that is not included in the `pattern` field, such as HEAD, or "*" to leave the HTTP method unspecified for this rule. The wild-card rule is useful for services that provide content to Web (HTML) clients. |
| body | [string](/reference/proto#string) | The name of the request field whose value is mapped to the HTTP request body, or `*` for mapping all request fields not captured by the path pattern to the HTTP body, or omitted for not having any HTTP request body.

NOTE: the referred field must be present at the top-level of the request message type. |
| response_body | [string](/reference/proto#string) | Optional. The name of the response field whose value is mapped to the HTTP response body. When omitted, the entire response message will be used as the HTTP response body.

NOTE: The referred field must be present at the top-level of the response message type. |
| additional_bindings | [HttpRule](/reference/proto#google-api-HttpRule)[] | Additional HTTP bindings for the selector. Nested bindings must not contain an `additional_bindings` field themselves (that is, the nesting may only be one level deep). |





 <!-- end messages -->

 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_google_api_annotations-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/google/api/annotations.proto


 <!-- end services -->

 <!-- end messages -->

 <!-- end enums -->


<a name="services_google_api_annotations-proto-extensions"></a>

### File-level Extensions
| Extension | Type | Base | Number | Description |
| --------- | ---- | ---- | ------ | ----------- |
| http | HttpRule | .google.protobuf.MethodOptions | 72295728 | See `HttpRule`. |

 <!-- end HasExtensions -->



<a name="services_trust-registry_v1_trust-registry-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/trust-registry/v1/trust-registry.proto



<a name="services-trustregistry-v1-TrustRegistry"></a>

### Service - TrustRegistry


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| RegisterMember | [RegisterMemberRequest](/reference/proto#services-trustregistry-v1-RegisterMemberRequest) | [RegisterMemberResponse](/reference/proto#services-trustregistry-v1-RegisterMemberResponse) | Register an authoritative issuer for a credential schema |
| UnregisterMember | [UnregisterMemberRequest](/reference/proto#services-trustregistry-v1-UnregisterMemberRequest) | [UnregisterMemberResponse](/reference/proto#services-trustregistry-v1-UnregisterMemberResponse) | Removes an authoritative issuer for a credential schema from the trust registry |
| GetMemberAuthorizationStatus | [GetMemberAuthorizationStatusRequest](/reference/proto#services-trustregistry-v1-GetMemberAuthorizationStatusRequest) | [GetMemberAuthorizationStatusResponse](/reference/proto#services-trustregistry-v1-GetMemberAuthorizationStatusResponse) | Fetch the status of a member for a given credential schema in a trust registry |
| ListAuthorizedMembers | [ListAuthorizedMembersRequest](/reference/proto#services-trustregistry-v1-ListAuthorizedMembersRequest) | [ListAuthorizedMembersResponse](/reference/proto#services-trustregistry-v1-ListAuthorizedMembersResponse) | Fetch the ecosystem's authorized issuers and the respective templates against which it can issue |
| GetMember | [GetMemberRequest](/reference/proto#services-trustregistry-v1-GetMemberRequest) | [GetMemberResponse](/reference/proto#services-trustregistry-v1-GetMemberResponse) | Get member for a given did in a trust registry |

 <!-- end services -->


<a name="services-trustregistry-v1-AuthorizedMember"></a>

### AuthorizedMember



| Field | Type | Description |
| ----- | ---- | ----------- |
| did | [string](/reference/proto#string) |  |
| authorized_member_schemas | [AuthorizedMemberSchema](/reference/proto#services-trustregistry-v1-AuthorizedMemberSchema)[] |  |






<a name="services-trustregistry-v1-AuthorizedMemberSchema"></a>

### AuthorizedMemberSchema



| Field | Type | Description |
| ----- | ---- | ----------- |
| schema_uri | [string](/reference/proto#string) |  |
| status | [string](/reference/proto#string) |  |
| status_details | [string](/reference/proto#string) |  |
| valid_from | [uint64](/reference/proto#uint64) |  |
| valid_until | [uint64](/reference/proto#uint64) |  |






<a name="services-trustregistry-v1-GetMemberAuthorizationStatusRequest"></a>

### GetMemberAuthorizationStatusRequest
Request to fetch member status in Trust Registry for a specific credential schema.


| Field | Type | Description |
| ----- | ---- | ----------- |
| did_uri | [string](/reference/proto#string) | DID URI of member |
| schema_uri | [string](/reference/proto#string) | URI of credential schema associated with member |






<a name="services-trustregistry-v1-GetMemberAuthorizationStatusResponse"></a>

### GetMemberAuthorizationStatusResponse
Response to `GetMemberAuthorizationStatusRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| status | [RegistrationStatus](/reference/proto#services-trustregistry-v1-RegistrationStatus) | Status of member for given credential schema |






<a name="services-trustregistry-v1-GetMemberRequest"></a>

### GetMemberRequest
Request to get a member of the Trust Registry


| Field | Type | Description |
| ----- | ---- | ----------- |
| did_uri | [string](/reference/proto#string) | DID URI of member to get |
| wallet_id | [string](/reference/proto#string) | Trinsic Wallet ID of member to get |
| email | [string](/reference/proto#string) | Email address of member to get. Must be associated with an existing Trinsic account. |






<a name="services-trustregistry-v1-GetMemberResponse"></a>

### GetMemberResponse
Response to `GetMemberAuthorizationStatusRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| authorized_member | [AuthorizedMember](/reference/proto#services-trustregistry-v1-AuthorizedMember) | Member for given did in given framework |






<a name="services-trustregistry-v1-ListAuthorizedMembersRequest"></a>

### ListAuthorizedMembersRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| schema_uri | [string](/reference/proto#string) | id of schema that needs to be checked |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results, from previous `ListAuthorizedMembersResponse` |






<a name="services-trustregistry-v1-ListAuthorizedMembersResponse"></a>

### ListAuthorizedMembersResponse
Response to `ListAuthorizedMembersRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| authorized_members | [AuthorizedMember](/reference/proto#services-trustregistry-v1-AuthorizedMember)[] | JSON string containing array of resultant objects |
| has_more_results | [bool](/reference/proto#bool) | Whether more data is available to fetch for query |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `ListAuthorizedMembersRequest` |






<a name="services-trustregistry-v1-RegisterMemberRequest"></a>

### RegisterMemberRequest
Request to register a member as a valid issuer of a specific credential schema.
Only one of `did_uri`, `wallet_id`, or `email` may be specified.


| Field | Type | Description |
| ----- | ---- | ----------- |
| did_uri | [string](/reference/proto#string) | DID URI of member to register |
| wallet_id | [string](/reference/proto#string) | Trinsic Wallet ID of member to register |
| email | [string](/reference/proto#string) | Email address of member to register. Must be associated with an existing Trinsic account. |
| schema_uri | [string](/reference/proto#string) | URI of credential schema to register member as authorized issuer of |
| valid_from_utc | [uint64](/reference/proto#uint64) | Unix Timestamp member is valid from. Member will not be considered valid before this timestamp. |
| valid_until_utc | [uint64](/reference/proto#uint64) | Unix Timestamp member is valid until. Member will not be considered valid after this timestamp. |






<a name="services-trustregistry-v1-RegisterMemberResponse"></a>

### RegisterMemberResponse
Response to `RegisterMemberRequest`






<a name="services-trustregistry-v1-UnregisterMemberRequest"></a>

### UnregisterMemberRequest
Request to unregister a member as a valid issuer of a specific credential schema.
Only one of `did_uri`, `wallet_id`, or `email` may be specified.
The URI of the credential schema must be specified.


| Field | Type | Description |
| ----- | ---- | ----------- |
| did_uri | [string](/reference/proto#string) | DID URI of member to unregister |
| wallet_id | [string](/reference/proto#string) | Trinsic Wallet ID of member to unregister |
| email | [string](/reference/proto#string) | Email address of member to unregister. Must be associated with an existing Trinsic account. |
| schema_uri | [string](/reference/proto#string) | URI of credential schema to unregister member as authorized issuer of |






<a name="services-trustregistry-v1-UnregisterMemberResponse"></a>

### UnregisterMemberResponse
Response to `UnregisterMemberRequest`





 <!-- end messages -->


<a name="services-trustregistry-v1-RegistrationStatus"></a>

### RegistrationStatus


| Name | Number | Description |
| ---- | ------ | ----------- |
| CURRENT | 0 | Member is currently authorized, as of the time of the query |
| EXPIRED | 1 | Member's authorization has expired |
| TERMINATED | 2 | Member has voluntarily ceased Issuer role under the specific EGF |
| REVOKED | 3 | Member authority under specific EGF was terminated by the governing authority |
| NOT_FOUND | 10 | Member is not associated with given credential schema in the EGF |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_common_v1_common-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/common/v1/common.proto


 <!-- end services -->


<a name="services-common-v1-Nonce"></a>

### Nonce
Nonce used to generate an oberon proof


| Field | Type | Description |
| ----- | ---- | ----------- |
| timestamp | [int64](/reference/proto#int64) | UTC unix millisecond timestamp the request was made |
| request_hash | [bytes](/reference/proto#bytes) | blake3256 hash of the request body |






<a name="services-common-v1-TrinsicClientOptions"></a>

### TrinsicClientOptions



| Field | Type | Description |
| ----- | ---- | ----------- |
| server_endpoint | [string](/reference/proto#string) | Trinsic API endpoint. Defaults to `prod.trinsic.cloud` |
| server_port | [int32](/reference/proto#int32) | Trinsic API port; defaults to `443` |
| server_use_tls | [bool](/reference/proto#bool) | Whether TLS is enabled between SDK and Trinsic API; defaults to `true` |
| auth_token | [string](/reference/proto#string) | Authentication token for SDK calls; defaults to empty string (unauthenticated) |





 <!-- end messages -->


<a name="services-common-v1-OrderDirection"></a>

### OrderDirection
The direction to order results

| Name | Number | Description |
| ---- | ------ | ----------- |
| ASCENDING | 0 |  |
| DESCENDING | 1 |  |



<a name="services-common-v1-ResponseStatus"></a>

### ResponseStatus


| Name | Number | Description |
| ---- | ------ | ----------- |
| SUCCESS | 0 |  |
| WALLET_ACCESS_DENIED | 10 |  |
| WALLET_EXISTS | 11 |  |
| ITEM_NOT_FOUND | 20 |  |
| SERIALIZATION_ERROR | 200 |  |
| UNKNOWN_ERROR | 100 |  |



<a name="services-common-v1-SupportedDidMethod"></a>

### SupportedDidMethod
Enum of all supported DID Methods
https://docs.godiddy.com/en/supported-methods

| Name | Number | Description |
| ---- | ------ | ----------- |
| KEY | 0 | The did:key method -- all wallets use this by default |
| ION | 1 | The did:ion method -- Sidetree implementation on top of Bitcoin by Microsoft |
| INDY | 2 | The did:sov method -- Hyperledger Indy based by Sovrin Foundation |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_provider_v1_provider-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/provider/v1/provider.proto



<a name="services-provider-v1-Provider"></a>

### Service - Provider


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CreateEcosystem | [CreateEcosystemRequest](/reference/proto#services-provider-v1-CreateEcosystemRequest) | [CreateEcosystemResponse](/reference/proto#services-provider-v1-CreateEcosystemResponse) | Create new ecosystem and assign the authenticated user as owner |
| GetOberonKey | [GetOberonKeyRequest](/reference/proto#services-provider-v1-GetOberonKeyRequest) | [GetOberonKeyResponse](/reference/proto#services-provider-v1-GetOberonKeyResponse) | Returns the public key being used to create/verify oberon tokens |
| UpgradeDID | [UpgradeDidRequest](/reference/proto#services-provider-v1-UpgradeDidRequest) | [UpgradeDidResponse](/reference/proto#services-provider-v1-UpgradeDidResponse) | Upgrade a wallet's DID from `did:key` to another method |
| SearchWalletConfigurations | [SearchWalletConfigurationsRequest](/reference/proto#services-provider-v1-SearchWalletConfigurationsRequest) | [SearchWalletConfigurationResponse](/reference/proto#services-provider-v1-SearchWalletConfigurationResponse) | Search for issuers/providers/verifiers in the current ecosystem |

 <!-- end services -->


<a name="services-provider-v1-CreateEcosystemRequest"></a>

### CreateEcosystemRequest
Request to create an ecosystem


| Field | Type | Description |
| ----- | ---- | ----------- |
| name | [string](/reference/proto#string) | Globally unique name for the Ecosystem. This name will be part of the ecosystem-specific URLs and namespaces. Allowed characters are lowercase letters, numbers, underscore and hyphen. If not passed, ecosystem name will be auto-generated. |
| description | [string](/reference/proto#string) | Ecosystem description |
| details | [services.account.v1.AccountDetails](/reference/proto#services-account-v1-AccountDetails) | The account details of the owner of the ecosystem |
| domain | [string](/reference/proto#string) | New domain URL |






<a name="services-provider-v1-CreateEcosystemResponse"></a>

### CreateEcosystemResponse
Response to `CreateEcosystemRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| ecosystem | [Ecosystem](/reference/proto#services-provider-v1-Ecosystem) | Details of the created ecosystem |
| profile | [services.account.v1.AccountProfile](/reference/proto#services-account-v1-AccountProfile) | Account profile for auth of the owner of the ecosystem |
| confirmation_method | [services.account.v1.ConfirmationMethod](/reference/proto#services-account-v1-ConfirmationMethod) | Indicates if confirmation of account is required. |






<a name="services-provider-v1-Ecosystem"></a>

### Ecosystem
Details of an ecosystem


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | URN of the ecosystem |
| name | [string](/reference/proto#string) | Globally unique name for the ecosystem |
| description | [string](/reference/proto#string) | Ecosystem description |






<a name="services-provider-v1-EcosystemInfoRequest"></a>

### EcosystemInfoRequest
Request to fetch information about an ecosystem






<a name="services-provider-v1-EcosystemInfoResponse"></a>

### EcosystemInfoResponse
Response to `InfoRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| ecosystem | [Ecosystem](/reference/proto#services-provider-v1-Ecosystem) | Ecosystem corresponding to current ecosystem in the account token |






<a name="services-provider-v1-GetOberonKeyRequest"></a>

### GetOberonKeyRequest
Request to fetch the Trinsic public key used
to verify authentication token validity






<a name="services-provider-v1-GetOberonKeyResponse"></a>

### GetOberonKeyResponse
Response to `GetOberonKeyRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| key | [string](/reference/proto#string) | Oberon Public Key as RAW base64-url encoded string |






<a name="services-provider-v1-IndyOptions"></a>

### IndyOptions
Options for creation of DID on the SOV network


| Field | Type | Description |
| ----- | ---- | ----------- |
| network | [IndyOptions.IndyNetwork](/reference/proto#services-provider-v1-IndyOptions-IndyNetwork) | SOV network on which DID should be published |






<a name="services-provider-v1-IonOptions"></a>

### IonOptions
Options for creation of DID on the ION network


| Field | Type | Description |
| ----- | ---- | ----------- |
| network | [IonOptions.IonNetwork](/reference/proto#services-provider-v1-IonOptions-IonNetwork) | ION network on which DID should be published |






<a name="services-provider-v1-SearchWalletConfigurationResponse"></a>

### SearchWalletConfigurationResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| results | [WalletConfiguration](/reference/proto#services-provider-v1-WalletConfiguration)[] | Results matching the search query |
| has_more_results | [bool](/reference/proto#bool) | Whether more results are available for this query via `continuation_token` |
| continuation_token | [string](/reference/proto#string) | Token to fetch next set of results via `SearchRequest` |






<a name="services-provider-v1-SearchWalletConfigurationsRequest"></a>

### SearchWalletConfigurationsRequest
Search for issuers/holders/verifiers


| Field | Type | Description |
| ----- | ---- | ----------- |
| query_filter | [string](/reference/proto#string) | SQL filter to execute. `SELECT * FROM c WHERE [**queryFilter**]` |
| continuation_token | [string](/reference/proto#string) | Token provided by previous `SearchResponse` if more data is available for query |






<a name="services-provider-v1-UpgradeDidRequest"></a>

### UpgradeDidRequest
Request to upgrade a wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| email | [string](/reference/proto#string) | Email address of account to upgrade. Mutually exclusive with `walletId` and `didUri`. |
| wallet_id | [string](/reference/proto#string) | Wallet ID of account to upgrade. Mutually exclusive with `email` and `didUri`. |
| did_uri | [string](/reference/proto#string) | DID URI of the account to upgrade. Mutually exclusive with `email` and `walletId`. |
| method | [services.common.v1.SupportedDidMethod](/reference/proto#services-common-v1-SupportedDidMethod) | DID Method to which wallet should be upgraded |
| ion_options | [IonOptions](/reference/proto#services-provider-v1-IonOptions) | Configuration for creation of DID on ION network |
| indy_options | [IndyOptions](/reference/proto#services-provider-v1-IndyOptions) | Configuration for creation of DID on INDY network |






<a name="services-provider-v1-UpgradeDidResponse"></a>

### UpgradeDidResponse
Response to `UpgradeDIDRequest`


| Field | Type | Description |
| ----- | ---- | ----------- |
| did | [string](/reference/proto#string) | New DID of wallet |






<a name="services-provider-v1-WalletConfiguration"></a>

### WalletConfiguration
Strongly typed information about wallet configurations


| Field | Type | Description |
| ----- | ---- | ----------- |
| name | [string](/reference/proto#string) | Name/description of the wallet |
| email | [string](/reference/proto#string) | **Deprecated.** Deprecated and will be removed on August 1, 2023 -- use external_identities. This field is set to the first email address present in `external_identities`, if any. |
| sms | [string](/reference/proto#string) | **Deprecated.** Deprecated -- use external_identities |
| wallet_id | [string](/reference/proto#string) |  |
| public_did | [string](/reference/proto#string) | The DID of the wallet |
| config_type | [string](/reference/proto#string) |  |
| auth_tokens | [services.account.v1.WalletAuthToken](/reference/proto#services-account-v1-WalletAuthToken)[] | List of active authentication tokens for this wallet. This list does not contain the issued token, only metadata such as ID, description, and creation date. |
| external_identity_ids | [string](/reference/proto#string)[] | **Deprecated.** List of external identity IDs (email addresses, phone numbers, etc.) associated with this wallet. This is deprecated; use `external_identities` instead. |
| ecosystem_id | [string](/reference/proto#string) | Ecosystem in which this wallet is contained. |
| description | [string](/reference/proto#string) |  |
| external_identities | [WalletExternalIdentity](/reference/proto#services-provider-v1-WalletExternalIdentity)[] | List of external identities associated with this wallet. |






<a name="services-provider-v1-WalletExternalIdentity"></a>

### WalletExternalIdentity
An external identity (email address, phone number, etc.) associated with a wallet for authentication purposes.


| Field | Type | Description |
| ----- | ---- | ----------- |
| provider | [IdentityProvider](/reference/proto#services-provider-v1-IdentityProvider) | The type of this identity (whether this identity is an email address, phone number, etc.) |
| id | [string](/reference/proto#string) | The actual email address/phone number/etc. for this identity |





 <!-- end messages -->


<a name="services-provider-v1-IdentityProvider"></a>

### IdentityProvider


| Name | Number | Description |
| ---- | ------ | ----------- |
| Unknown | 0 | Identity provider is unknown |
| Email | 1 | Identity provider is email |
| Phone | 2 | Identity provider is phone |
| Passkey | 3 | Identity provider is passkey (WebAuthn) -- for Trinsic internal use only |
| TrinsicAuthenticator | 4 | Identity provider is passkey using Trinsic Authenticator for mobile phones |



<a name="services-provider-v1-IndyOptions-IndyNetwork"></a>

### IndyOptions.IndyNetwork


| Name | Number | Description |
| ---- | ------ | ----------- |
| Danube | 0 |  |
| SovrinBuilder | 1 |  |
| SovrinStaging | 2 |  |
| Sovrin | 3 |  |
| IdUnionTest | 4 |  |
| IdUnion | 5 |  |
| IndicioTest | 6 |  |
| IndicioDemo | 7 |  |
| Indicio | 8 |  |



<a name="services-provider-v1-IonOptions-IonNetwork"></a>

### IonOptions.IonNetwork


| Name | Number | Description |
| ---- | ------ | ----------- |
| TestNet | 0 |  |
| MainNet | 1 |  |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_provider_v1_access-management-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/provider/v1/access-management.proto



<a name="services-provider-v1-AccessManagement"></a>

### Service - AccessManagement
Access Management service provides methods to manage access to ecosystem resources
such by assigning roles and permissions to wallet accounts

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| AddRoleAssignment | [AddRoleAssignmentRequest](/reference/proto#services-provider-v1-AddRoleAssignmentRequest) | [AddRoleAssignmentResponse](/reference/proto#services-provider-v1-AddRoleAssignmentResponse) | Adds a role assignment to an account |
| RemoveRoleAssignment | [RemoveRoleAssignmentRequest](/reference/proto#services-provider-v1-RemoveRoleAssignmentRequest) | [RemoveRoleAssignmentResponse](/reference/proto#services-provider-v1-RemoveRoleAssignmentResponse) | Removes a role assignment from the account |
| ListRoleAssignments | [ListRoleAssignmentsRequest](/reference/proto#services-provider-v1-ListRoleAssignmentsRequest) | [ListRoleAssignmentsResponse](/reference/proto#services-provider-v1-ListRoleAssignmentsResponse) | List the role assignments for the given account |
| ListAvailableRoles | [ListAvailableRolesRequest](/reference/proto#services-provider-v1-ListAvailableRolesRequest) | [ListAvailableRolesResponse](/reference/proto#services-provider-v1-ListAvailableRolesResponse) | List the roles available in the ecosystem |

 <!-- end services -->


<a name="services-provider-v1-AddRoleAssignmentRequest"></a>

### AddRoleAssignmentRequest
Role management


| Field | Type | Description |
| ----- | ---- | ----------- |
| role | [string](/reference/proto#string) | Role to assign |
| email | [string](/reference/proto#string) | Email address of account to assign role. Mutually exclusive with `walletId` and `didUri`. |
| wallet_id | [string](/reference/proto#string) | Wallet ID of account to assign role to. Mutually exclusive with `email` and `didUri`. |
| did_uri | [string](/reference/proto#string) | DID URI of the account to assign role. Mutually exclusive with `email` and `walletId`. |






<a name="services-provider-v1-AddRoleAssignmentResponse"></a>

### AddRoleAssignmentResponse







<a name="services-provider-v1-ListAvailableRolesRequest"></a>

### ListAvailableRolesRequest
Request to fetch the available roles in the current ecosystem






<a name="services-provider-v1-ListAvailableRolesResponse"></a>

### ListAvailableRolesResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| roles | [string](/reference/proto#string)[] | List of roles |






<a name="services-provider-v1-ListRoleAssignmentsRequest"></a>

### ListRoleAssignmentsRequest
Request to fetch the list of roles assigned to the current account


| Field | Type | Description |
| ----- | ---- | ----------- |
| email | [string](/reference/proto#string) | Email address of account to list roles. Mutually exclusive with `walletId` and `didUri`. |
| wallet_id | [string](/reference/proto#string) | Wallet ID of account to list roles. Mutually exclusive with `email` and `didUri`. |
| did_uri | [string](/reference/proto#string) | DID URI of the account to list roles. Mutually exclusive with `email` and `walletId`. |






<a name="services-provider-v1-ListRoleAssignmentsResponse"></a>

### ListRoleAssignmentsResponse



| Field | Type | Description |
| ----- | ---- | ----------- |
| roles | [string](/reference/proto#string)[] | List of roles |






<a name="services-provider-v1-RemoveRoleAssignmentRequest"></a>

### RemoveRoleAssignmentRequest



| Field | Type | Description |
| ----- | ---- | ----------- |
| role | [string](/reference/proto#string) | Role to unassign |
| email | [string](/reference/proto#string) | Email address of account to unassign role. Mutually exclusive with `walletId` and `didUri`. |
| wallet_id | [string](/reference/proto#string) | Wallet ID of account to unassign role. Mutually exclusive with `email` and `didUri`. |
| did_uri | [string](/reference/proto#string) | DID URI of the account to unassign role. Mutually exclusive with `email` and `walletId`. |






<a name="services-provider-v1-RemoveRoleAssignmentResponse"></a>

### RemoveRoleAssignmentResponse






 <!-- end messages -->

 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="services_account_v1_account-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## services/account/v1/account.proto


 <!-- end services -->


<a name="services-account-v1-AccountDetails"></a>

### AccountDetails
Account registration details


| Field | Type | Description |
| ----- | ---- | ----------- |
| name | [string](/reference/proto#string) | Account name |
| email | [string](/reference/proto#string) | **Deprecated.** Email address of account. |
| sms | [string](/reference/proto#string) | **Deprecated.** SMS number including country code |






<a name="services-account-v1-AccountProfile"></a>

### AccountProfile
Device profile containing sensitive authentication data.
This information should be stored securely


| Field | Type | Description |
| ----- | ---- | ----------- |
| profile_type | [string](/reference/proto#string) | The type of profile, used to differentiate between protocol schemes or versions |
| auth_data | [bytes](/reference/proto#bytes) | Auth data containg information about the current device access |
| auth_token | [bytes](/reference/proto#bytes) | Secure token issued by server used to generate zero-knowledge proofs |
| protection | [TokenProtection](/reference/proto#services-account-v1-TokenProtection) | Token security information about the token. If token protection is enabled, implementations must supply protection secret before using the token for authentication. |






<a name="services-account-v1-TokenProtection"></a>

### TokenProtection
Token protection info


| Field | Type | Description |
| ----- | ---- | ----------- |
| enabled | [bool](/reference/proto#bool) | Indicates if token is protected using a PIN, security code, HSM secret, etc. |
| method | [ConfirmationMethod](/reference/proto#services-account-v1-ConfirmationMethod) | The method used to protect the token |






<a name="services-account-v1-WalletAuthToken"></a>

### WalletAuthToken
Information about authentication tokens for a wallet


| Field | Type | Description |
| ----- | ---- | ----------- |
| id | [string](/reference/proto#string) | Unique identifier for the token. This field will match the `DeviceId` in the WalletAuthData |
| description | [string](/reference/proto#string) | Device name/description |
| date_created | [string](/reference/proto#string) | Date when the token was created in ISO 8601 format |





 <!-- end messages -->


<a name="services-account-v1-ConfirmationMethod"></a>

### ConfirmationMethod
Confirmation method type for two-factor workflows

| Name | Number | Description |
| ---- | ------ | ----------- |
| None | 0 | No confirmation required |
| Email | 1 | Email confirmation required |
| Sms | 2 | SMS confirmation required |
| ConnectedDevice | 3 | Confirmation from a connected device is required |
| Other | 10 | Third-party method of confirmation is required |


 <!-- end enums -->

 <!-- end HasExtensions -->



<a name="sdk_options_v1_options-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## sdk/options/v1/options.proto


 <!-- end services -->


<a name="sdk-options-v1-TrinsicOptions"></a>

### TrinsicOptions
Configuration for Trinsic SDK Services


| Field | Type | Description |
| ----- | ---- | ----------- |
| server_endpoint | [string](/reference/proto#string) | Trinsic API endpoint. Defaults to `prod.trinsic.cloud` |
| server_port | [int32](/reference/proto#int32) | Trinsic API port; defaults to `443` |
| server_use_tls | [bool](/reference/proto#bool) | Whether TLS is enabled between SDK and Trinsic API; defaults to `true` |
| auth_token | [string](/reference/proto#string) | Authentication token for SDK calls; defaults to empty string (unauthenticated)

Default ecosystem ID to use for various SDK calls; defaults to `default` string default_ecosystem = 5; |





 <!-- end messages -->

 <!-- end enums -->

 <!-- end HasExtensions -->



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- |
| <a name="double" /> double |  | double | double | float | float64 | double | float |
| <a name="float" /> float |  | float | float | float | float32 | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string |
