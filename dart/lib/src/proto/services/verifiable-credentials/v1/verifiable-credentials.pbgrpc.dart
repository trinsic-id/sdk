//
//  Generated code. Do not modify.
//  source: services/verifiable-credentials/v1/verifiable-credentials.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:async' as $async;
import 'dart:core' as $core;

import 'package:grpc/service_api.dart' as $grpc;
import 'package:protobuf/protobuf.dart' as $pb;

import 'verifiable-credentials.pb.dart' as $6;

export 'verifiable-credentials.pb.dart';

@$pb.GrpcServiceName('services.verifiablecredentials.v1.VerifiableCredential')
class VerifiableCredentialClient extends $grpc.Client {
  static final _$issueFromTemplate = $grpc.ClientMethod<
          $6.IssueFromTemplateRequest, $6.IssueFromTemplateResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/IssueFromTemplate',
      ($6.IssueFromTemplateRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) =>
          $6.IssueFromTemplateResponse.fromBuffer(value));
  static final _$checkStatus =
      $grpc.ClientMethod<$6.CheckStatusRequest, $6.CheckStatusResponse>(
          '/services.verifiablecredentials.v1.VerifiableCredential/CheckStatus',
          ($6.CheckStatusRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $6.CheckStatusResponse.fromBuffer(value));
  static final _$updateStatus = $grpc.ClientMethod<$6.UpdateStatusRequest,
          $6.UpdateStatusResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/UpdateStatus',
      ($6.UpdateStatusRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) =>
          $6.UpdateStatusResponse.fromBuffer(value));
  static final _$createProof =
      $grpc.ClientMethod<$6.CreateProofRequest, $6.CreateProofResponse>(
          '/services.verifiablecredentials.v1.VerifiableCredential/CreateProof',
          ($6.CreateProofRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $6.CreateProofResponse.fromBuffer(value));
  static final _$verifyProof =
      $grpc.ClientMethod<$6.VerifyProofRequest, $6.VerifyProofResponse>(
          '/services.verifiablecredentials.v1.VerifiableCredential/VerifyProof',
          ($6.VerifyProofRequest value) => value.writeToBuffer(),
          ($core.List<$core.int> value) =>
              $6.VerifyProofResponse.fromBuffer(value));
  static final _$send = $grpc.ClientMethod<$6.SendRequest, $6.SendResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/Send',
      ($6.SendRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $6.SendResponse.fromBuffer(value));
  static final _$createCredentialOffer = $grpc.ClientMethod<
          $6.CreateCredentialOfferRequest, $6.CreateCredentialOfferResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/CreateCredentialOffer',
      ($6.CreateCredentialOfferRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) =>
          $6.CreateCredentialOfferResponse.fromBuffer(value));
  static final _$acceptCredential = $grpc.ClientMethod<
          $6.AcceptCredentialRequest, $6.AcceptCredentialResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/AcceptCredential',
      ($6.AcceptCredentialRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) =>
          $6.AcceptCredentialResponse.fromBuffer(value));
  static final _$rejectCredential = $grpc.ClientMethod<
          $6.RejectCredentialRequest, $6.RejectCredentialResponse>(
      '/services.verifiablecredentials.v1.VerifiableCredential/RejectCredential',
      ($6.RejectCredentialRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) =>
          $6.RejectCredentialResponse.fromBuffer(value));

  VerifiableCredentialClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options, interceptors: interceptors);

  $grpc.ResponseFuture<$6.IssueFromTemplateResponse> issueFromTemplate(
      $6.IssueFromTemplateRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$issueFromTemplate, request, options: options);
  }

  $grpc.ResponseFuture<$6.CheckStatusResponse> checkStatus(
      $6.CheckStatusRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$checkStatus, request, options: options);
  }

  $grpc.ResponseFuture<$6.UpdateStatusResponse> updateStatus(
      $6.UpdateStatusRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$updateStatus, request, options: options);
  }

  $grpc.ResponseFuture<$6.CreateProofResponse> createProof(
      $6.CreateProofRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$createProof, request, options: options);
  }

  $grpc.ResponseFuture<$6.VerifyProofResponse> verifyProof(
      $6.VerifyProofRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$verifyProof, request, options: options);
  }

  $grpc.ResponseFuture<$6.SendResponse> send($6.SendRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$send, request, options: options);
  }

  $grpc.ResponseFuture<$6.CreateCredentialOfferResponse> createCredentialOffer(
      $6.CreateCredentialOfferRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$createCredentialOffer, request, options: options);
  }

  $grpc.ResponseFuture<$6.AcceptCredentialResponse> acceptCredential(
      $6.AcceptCredentialRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$acceptCredential, request, options: options);
  }

  $grpc.ResponseFuture<$6.RejectCredentialResponse> rejectCredential(
      $6.RejectCredentialRequest request,
      {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$rejectCredential, request, options: options);
  }
}

@$pb.GrpcServiceName('services.verifiablecredentials.v1.VerifiableCredential')
abstract class VerifiableCredentialServiceBase extends $grpc.Service {
  $core.String get $name =>
      'services.verifiablecredentials.v1.VerifiableCredential';

  VerifiableCredentialServiceBase() {
    $addMethod($grpc.ServiceMethod<$6.IssueFromTemplateRequest,
            $6.IssueFromTemplateResponse>(
        'IssueFromTemplate',
        issueFromTemplate_Pre,
        false,
        false,
        ($core.List<$core.int> value) =>
            $6.IssueFromTemplateRequest.fromBuffer(value),
        ($6.IssueFromTemplateResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$6.CheckStatusRequest, $6.CheckStatusResponse>(
            'CheckStatus',
            checkStatus_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $6.CheckStatusRequest.fromBuffer(value),
            ($6.CheckStatusResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$6.UpdateStatusRequest, $6.UpdateStatusResponse>(
            'UpdateStatus',
            updateStatus_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $6.UpdateStatusRequest.fromBuffer(value),
            ($6.UpdateStatusResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$6.CreateProofRequest, $6.CreateProofResponse>(
            'CreateProof',
            createProof_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $6.CreateProofRequest.fromBuffer(value),
            ($6.CreateProofResponse value) => value.writeToBuffer()));
    $addMethod(
        $grpc.ServiceMethod<$6.VerifyProofRequest, $6.VerifyProofResponse>(
            'VerifyProof',
            verifyProof_Pre,
            false,
            false,
            ($core.List<$core.int> value) =>
                $6.VerifyProofRequest.fromBuffer(value),
            ($6.VerifyProofResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$6.SendRequest, $6.SendResponse>(
        'Send',
        send_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $6.SendRequest.fromBuffer(value),
        ($6.SendResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$6.CreateCredentialOfferRequest,
            $6.CreateCredentialOfferResponse>(
        'CreateCredentialOffer',
        createCredentialOffer_Pre,
        false,
        false,
        ($core.List<$core.int> value) =>
            $6.CreateCredentialOfferRequest.fromBuffer(value),
        ($6.CreateCredentialOfferResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$6.AcceptCredentialRequest,
            $6.AcceptCredentialResponse>(
        'AcceptCredential',
        acceptCredential_Pre,
        false,
        false,
        ($core.List<$core.int> value) =>
            $6.AcceptCredentialRequest.fromBuffer(value),
        ($6.AcceptCredentialResponse value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$6.RejectCredentialRequest,
            $6.RejectCredentialResponse>(
        'RejectCredential',
        rejectCredential_Pre,
        false,
        false,
        ($core.List<$core.int> value) =>
            $6.RejectCredentialRequest.fromBuffer(value),
        ($6.RejectCredentialResponse value) => value.writeToBuffer()));
  }

  $async.Future<$6.IssueFromTemplateResponse> issueFromTemplate_Pre(
      $grpc.ServiceCall call,
      $async.Future<$6.IssueFromTemplateRequest> request) async {
    return issueFromTemplate(call, await request);
  }

  $async.Future<$6.CheckStatusResponse> checkStatus_Pre($grpc.ServiceCall call,
      $async.Future<$6.CheckStatusRequest> request) async {
    return checkStatus(call, await request);
  }

  $async.Future<$6.UpdateStatusResponse> updateStatus_Pre(
      $grpc.ServiceCall call,
      $async.Future<$6.UpdateStatusRequest> request) async {
    return updateStatus(call, await request);
  }

  $async.Future<$6.CreateProofResponse> createProof_Pre($grpc.ServiceCall call,
      $async.Future<$6.CreateProofRequest> request) async {
    return createProof(call, await request);
  }

  $async.Future<$6.VerifyProofResponse> verifyProof_Pre($grpc.ServiceCall call,
      $async.Future<$6.VerifyProofRequest> request) async {
    return verifyProof(call, await request);
  }

  $async.Future<$6.SendResponse> send_Pre(
      $grpc.ServiceCall call, $async.Future<$6.SendRequest> request) async {
    return send(call, await request);
  }

  $async.Future<$6.CreateCredentialOfferResponse> createCredentialOffer_Pre(
      $grpc.ServiceCall call,
      $async.Future<$6.CreateCredentialOfferRequest> request) async {
    return createCredentialOffer(call, await request);
  }

  $async.Future<$6.AcceptCredentialResponse> acceptCredential_Pre(
      $grpc.ServiceCall call,
      $async.Future<$6.AcceptCredentialRequest> request) async {
    return acceptCredential(call, await request);
  }

  $async.Future<$6.RejectCredentialResponse> rejectCredential_Pre(
      $grpc.ServiceCall call,
      $async.Future<$6.RejectCredentialRequest> request) async {
    return rejectCredential(call, await request);
  }

  $async.Future<$6.IssueFromTemplateResponse> issueFromTemplate(
      $grpc.ServiceCall call, $6.IssueFromTemplateRequest request);
  $async.Future<$6.CheckStatusResponse> checkStatus(
      $grpc.ServiceCall call, $6.CheckStatusRequest request);
  $async.Future<$6.UpdateStatusResponse> updateStatus(
      $grpc.ServiceCall call, $6.UpdateStatusRequest request);
  $async.Future<$6.CreateProofResponse> createProof(
      $grpc.ServiceCall call, $6.CreateProofRequest request);
  $async.Future<$6.VerifyProofResponse> verifyProof(
      $grpc.ServiceCall call, $6.VerifyProofRequest request);
  $async.Future<$6.SendResponse> send(
      $grpc.ServiceCall call, $6.SendRequest request);
  $async.Future<$6.CreateCredentialOfferResponse> createCredentialOffer(
      $grpc.ServiceCall call, $6.CreateCredentialOfferRequest request);
  $async.Future<$6.AcceptCredentialResponse> acceptCredential(
      $grpc.ServiceCall call, $6.AcceptCredentialRequest request);
  $async.Future<$6.RejectCredentialResponse> rejectCredential(
      $grpc.ServiceCall call, $6.RejectCredentialRequest request);
}
