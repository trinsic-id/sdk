import 'dart:convert';

import 'package:trinsic_dart/src/proto/sdk/options/v1/options.pb.dart';
import 'package:trinsic_dart/src/proto/services/provider/v1/provider.pbgrpc.dart';
import 'package:trinsic_dart/src/service_base.dart';

class ProviderService extends ServiceBase {
  late ProviderClient client;

  ProviderService(ServiceOptions? serverOptions) : super(serverOptions) {
    client = ProviderClient(super.channel);
  }

  Future<CreateEcosystemResponse> createEcosystem(
      {CreateEcosystemRequest? request}) async {
    request = request ?? CreateEcosystemRequest();
    var authenticate =
        (request.name.isNotEmpty || request.details.email.isNotEmpty);
    var metadata =
        authenticate ? buildMetadata(request: request) : buildMetadata();
    var response = await client.createEcosystem(request, options: metadata);
    serviceOptions.authToken =
        Base64Encoder.urlSafe().convert(response.profile.writeToBuffer());
    return response;
  }

// BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
// target: ..\sdk\dart\lib\src\provider_service.dart

  Future<UpdateEcosystemResponse> updateEcosystem(
      UpdateEcosystemRequest request) async {
    ///  Update an existing ecosystem
    return await client.updateEcosystem(request,
        options: buildMetadata(request: request));
  }

  Future<GrantAuthorizationResponse> grantAuthorization(
      GrantAuthorizationRequest request) async {
    ///  Grant user authorization to ecosystem resources
    return await client.grantAuthorization(request,
        options: buildMetadata(request: request));
  }

  Future<RevokeAuthorizationResponse> revokeAuthorization(
      RevokeAuthorizationRequest request) async {
    ///  Revoke user authorization to ecosystem resources
    return await client.revokeAuthorization(request,
        options: buildMetadata(request: request));
  }

  Future<GetAuthorizationsResponse> getAuthorizations(
      GetAuthorizationsRequest request) async {
    ///  Retreive the list of permissions for this particular account/ecosystem
    return await client.getAuthorizations(request,
        options: buildMetadata(request: request));
  }

  Future<AddWebhookResponse> addWebhook(AddWebhookRequest request) async {
    ///  Add a webhook endpoint to the ecosystem
    return await client.addWebhook(request,
        options: buildMetadata(request: request));
  }

  Future<DeleteWebhookResponse> deleteWebhook(
      DeleteWebhookRequest request) async {
    ///  Delete a webhook endpoint from the ecosystem
    return await client.deleteWebhook(request,
        options: buildMetadata(request: request));
  }

  Future<EcosystemInfoResponse> ecosystemInfo(
      EcosystemInfoRequest request) async {
    ///  Get ecosystem information
    return await client.ecosystemInfo(request,
        options: buildMetadata(request: request));
  }

  Future<GenerateTokenResponse> generateToken(
      GenerateTokenRequest request) async {
    ///  Generates an unprotected authentication token that can be used to
    /// configure server side applications
    return await client.generateToken(request,
        options: buildMetadata(request: request));
  }

  Future<InviteResponse> invite(InviteRequest request) async {
    ///  Invite a user to the ecosystem
    return await client.invite(request,
        options: buildMetadata(request: request));
  }

  Future<InvitationStatusResponse> invitationStatus(
      InvitationStatusRequest request) async {
    ///  Check the status of an invitation
    return await client.invitationStatus(request,
        options: buildMetadata(request: request));
  }

  Future<GetOberonKeyResponse> getOberonKey(GetOberonKeyRequest request) async {
    ///  Returns the public key being used to create/verify oberon tokens
    return await client.getOberonKey(request, options: buildMetadata());
  }

  Future<GetEventTokenResponse> getEventToken(
      GetEventTokenRequest request) async {
    ///  Generate a signed token (JWT) that can be used to connect to the message bus
    return await client.getEventToken(request,
        options: buildMetadata(request: request));
  }
// END Code generated by protoc-gen-trinsic. DO NOT EDIT.
}
