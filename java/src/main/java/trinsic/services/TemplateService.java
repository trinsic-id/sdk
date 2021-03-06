package trinsic.services;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.protobuf.InvalidProtocolBufferException;
import trinsic.okapi.DidException;
import trinsic.sdk.options.v1.Options;
import trinsic.services.verifiablecredentials.templates.v1.*;
import trinsic.services.verifiablecredentials.templates.v1.CredentialTemplatesGrpc;

public class TemplateService extends ServiceBase {
  private final CredentialTemplatesGrpc.CredentialTemplatesFutureStub stub;

  public TemplateService() {
    this(null);
  }

  public TemplateService(Options.ServiceOptions.Builder options) {
    super(options);

    this.stub = CredentialTemplatesGrpc.newFutureStub(this.getChannel());
  }

  // BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
  // target: ..\sdk\java\src\main\java\trinsic\services\templateService.java

  public ListenableFuture<CreateCredentialTemplateResponse> create(
      CreateCredentialTemplateRequest request) throws InvalidProtocolBufferException, DidException {
    // TODO - Handle metadata
    return withMetadata(stub, request).create(request);
  }

  public ListenableFuture<GetCredentialTemplateResponse> get(GetCredentialTemplateRequest request)
      throws InvalidProtocolBufferException, DidException {
    // TODO - Handle metadata
    return withMetadata(stub, request).get(request);
  }

  public ListenableFuture<ListCredentialTemplatesResponse> list(
      ListCredentialTemplatesRequest request) throws InvalidProtocolBufferException, DidException {
    // TODO - Handle metadata
    return withMetadata(stub, request).list(request);
  }

  public ListenableFuture<SearchCredentialTemplatesResponse> search(
      SearchCredentialTemplatesRequest request)
      throws InvalidProtocolBufferException, DidException {
    // TODO - Handle metadata
    return withMetadata(stub, request).search(request);
  }

  public ListenableFuture<DeleteCredentialTemplateResponse> delete(
      DeleteCredentialTemplateRequest request) throws InvalidProtocolBufferException, DidException {
    // TODO - Handle metadata
    return withMetadata(stub, request).delete(request);
  }
  // END Code generated by protoc-gen-trinsic. DO NOT EDIT.
}
