package trinsic.services;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.protobuf.InvalidProtocolBufferException;
import trinsic.sdk.options.v1.Options;
import trinsic.services.verifiablecredentials.templates.v1.*;

public class TemplateService extends ServiceBase {
  private final CredentialTemplatesGrpc.CredentialTemplatesFutureStub stub;

  public TemplateService() {
    this(null);
  }

  public TemplateService(Options.TrinsicOptions.Builder options) {
    super(options);

    this.stub = CredentialTemplatesGrpc.newFutureStub(this.getChannel());
  }

  // BEGIN Code generated by protoc-gen-trinsic. DO NOT EDIT.
  // target: /home/runner/work/sdk/sdk/java/src/main/java/trinsic/services/TemplateService.java

  /** Create a credential template in the current ecosystem */
  public ListenableFuture<CreateCredentialTemplateResponse> create(
      CreateCredentialTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).create(request);
  }
  /** Fetch a credential template by ID */
  public ListenableFuture<GetCredentialTemplateResponse> get(GetCredentialTemplateRequest request)
      throws InvalidProtocolBufferException {

    return withMetadata(stub, request).get(request);
  }
  /** Update metadata of a template */
  public ListenableFuture<UpdateCredentialTemplateResponse> update(
      UpdateCredentialTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).update(request);
  }
  /** Search credential templates using SQL, returning strongly-typed template data */
  public ListenableFuture<ListCredentialTemplatesResponse> list(
      ListCredentialTemplatesRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).list(request);
  }
  /** Search credential templates using SQL, returning raw JSON data */
  public ListenableFuture<SearchCredentialTemplatesResponse> search(
      SearchCredentialTemplatesRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).search(request);
  }
  /** Delete a credential template from the current ecosystem by ID */
  public ListenableFuture<DeleteCredentialTemplateResponse> delete(
      DeleteCredentialTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).delete(request);
  }
  /** This method is experimental Create/update verification templates */
  @Deprecated(since = "This method is experimental")
  public ListenableFuture<CreateVerificationTemplateResponse> createVerificationTemplate(
      CreateVerificationTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).createVerificationTemplate(request);
  }
  /** This method is experimental */
  @Deprecated(since = "This method is experimental")
  public ListenableFuture<ListVerificationTemplatesResponse> listVerificationTemplates(
      ListVerificationTemplatesRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).listVerificationTemplates(request);
  }
  /** This method is experimental */
  @Deprecated(since = "This method is experimental")
  public ListenableFuture<GetVerificationTemplateResponse> getVerificationTemplate(
      GetVerificationTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).getVerificationTemplate(request);
  }
  /** This method is experimental */
  @Deprecated(since = "This method is experimental")
  public ListenableFuture<UpdateVerificationTemplateResponse> updateVerificationTemplate(
      UpdateVerificationTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).updateVerificationTemplate(request);
  }
  /** This method is experimental */
  @Deprecated(since = "This method is experimental")
  public ListenableFuture<DeleteVerificationTemplateResponse> deleteVerificationTemplate(
      DeleteVerificationTemplateRequest request) throws InvalidProtocolBufferException {

    return withMetadata(stub, request).deleteVerificationTemplate(request);
  }
  // END Code generated by protoc-gen-trinsic. DO NOT EDIT.
}
