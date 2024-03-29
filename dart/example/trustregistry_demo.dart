import 'package:trinsic_dart/src/trinsic_util.dart';
import 'package:trinsic_dart/trinsic.dart';
import 'package:uuid/uuid.dart';

Future runTrustRegistryDemo() async {
  var trinsic = TrinsicService(trinsicConfig());
  var ecosystem = await trinsic.provider().createEcosystem();

  var uuid = Uuid();

  var httpsSchemaOrg = "https://schema.org/Card";
  var httpsExampleCom = "https://example.com/${uuid.v4()}";
  var didExampleTest = "did:example:test";

  // registerIssuerSample() {
  var registerMemberResponse = await trinsic.trustRegistry().registerMember(
      RegisterMemberRequest(didUri: didExampleTest, schemaUri: httpsSchemaOrg));
  // }

  print("Member registered: $registerMemberResponse");

  // checkIssuerStatus() {
  var checkResponse = await trinsic
      .trustRegistry()
      .getMemberAuthorizationStatus(GetMemberAuthorizationStatusRequest(
          didUri: didExampleTest, schemaUri: httpsSchemaOrg));
  // }

  print("Member Status: $checkResponse");

  assert(checkResponse.status == RegistrationStatus.CURRENT);

  // getMember() {
  var getMemberResponse = await trinsic
      .trustRegistry()
      .getMember(GetMemberRequest(didUri: didExampleTest));
  // }

  // listMembers() {
  //}

  // unregisterIssuer() {
  var unregisterIssuerResponse = await trinsic.trustRegistry().unregisterMember(
      UnregisterMemberRequest(
          schemaUri: httpsSchemaOrg, didUri: didExampleTest));
  // }
}

void main() async {
  await runTrustRegistryDemo();
}
