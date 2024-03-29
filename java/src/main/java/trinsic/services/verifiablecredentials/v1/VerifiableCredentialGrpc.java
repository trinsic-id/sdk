package trinsic.services.verifiablecredentials.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/** */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.49.2)",
    comments = "Source: services/verifiable-credentials/v1/verifiable-credentials.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class VerifiableCredentialGrpc {

  private VerifiableCredentialGrpc() {}

  public static final String SERVICE_NAME =
      "services.verifiablecredentials.v1.VerifiableCredential";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest,
          trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
      getIssueFromTemplateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "IssueFromTemplate",
      requestType = trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest,
          trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
      getIssueFromTemplateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest,
            trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
        getIssueFromTemplateMethod;
    if ((getIssueFromTemplateMethod = VerifiableCredentialGrpc.getIssueFromTemplateMethod)
        == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getIssueFromTemplateMethod = VerifiableCredentialGrpc.getIssueFromTemplateMethod)
            == null) {
          VerifiableCredentialGrpc.getIssueFromTemplateMethod =
              getIssueFromTemplateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest,
                          trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "IssueFromTemplate"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("IssueFromTemplate"))
                      .build();
        }
      }
    }
    return getIssueFromTemplateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CheckStatusRequest,
          trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
      getCheckStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CheckStatus",
      requestType = trinsic.services.verifiablecredentials.v1.CheckStatusRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.CheckStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CheckStatusRequest,
          trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
      getCheckStatusMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.CheckStatusRequest,
            trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
        getCheckStatusMethod;
    if ((getCheckStatusMethod = VerifiableCredentialGrpc.getCheckStatusMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getCheckStatusMethod = VerifiableCredentialGrpc.getCheckStatusMethod) == null) {
          VerifiableCredentialGrpc.getCheckStatusMethod =
              getCheckStatusMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.CheckStatusRequest,
                          trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CheckStatus"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.CheckStatusRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.CheckStatusResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("CheckStatus"))
                      .build();
        }
      }
    }
    return getCheckStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.UpdateStatusRequest,
          trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
      getUpdateStatusMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateStatus",
      requestType = trinsic.services.verifiablecredentials.v1.UpdateStatusRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.UpdateStatusResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.UpdateStatusRequest,
          trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
      getUpdateStatusMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.UpdateStatusRequest,
            trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
        getUpdateStatusMethod;
    if ((getUpdateStatusMethod = VerifiableCredentialGrpc.getUpdateStatusMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getUpdateStatusMethod = VerifiableCredentialGrpc.getUpdateStatusMethod) == null) {
          VerifiableCredentialGrpc.getUpdateStatusMethod =
              getUpdateStatusMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.UpdateStatusRequest,
                          trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpdateStatus"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.UpdateStatusRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.UpdateStatusResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("UpdateStatus"))
                      .build();
        }
      }
    }
    return getUpdateStatusMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CreateProofRequest,
          trinsic.services.verifiablecredentials.v1.CreateProofResponse>
      getCreateProofMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateProof",
      requestType = trinsic.services.verifiablecredentials.v1.CreateProofRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.CreateProofResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CreateProofRequest,
          trinsic.services.verifiablecredentials.v1.CreateProofResponse>
      getCreateProofMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.CreateProofRequest,
            trinsic.services.verifiablecredentials.v1.CreateProofResponse>
        getCreateProofMethod;
    if ((getCreateProofMethod = VerifiableCredentialGrpc.getCreateProofMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getCreateProofMethod = VerifiableCredentialGrpc.getCreateProofMethod) == null) {
          VerifiableCredentialGrpc.getCreateProofMethod =
              getCreateProofMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.CreateProofRequest,
                          trinsic.services.verifiablecredentials.v1.CreateProofResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateProof"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.CreateProofRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.CreateProofResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("CreateProof"))
                      .build();
        }
      }
    }
    return getCreateProofMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.VerifyProofRequest,
          trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
      getVerifyProofMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "VerifyProof",
      requestType = trinsic.services.verifiablecredentials.v1.VerifyProofRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.VerifyProofResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.VerifyProofRequest,
          trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
      getVerifyProofMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.VerifyProofRequest,
            trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
        getVerifyProofMethod;
    if ((getVerifyProofMethod = VerifiableCredentialGrpc.getVerifyProofMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getVerifyProofMethod = VerifiableCredentialGrpc.getVerifyProofMethod) == null) {
          VerifiableCredentialGrpc.getVerifyProofMethod =
              getVerifyProofMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.VerifyProofRequest,
                          trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "VerifyProof"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.VerifyProofRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.VerifyProofResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("VerifyProof"))
                      .build();
        }
      }
    }
    return getVerifyProofMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.SendRequest,
          trinsic.services.verifiablecredentials.v1.SendResponse>
      getSendMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Send",
      requestType = trinsic.services.verifiablecredentials.v1.SendRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.SendResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.SendRequest,
          trinsic.services.verifiablecredentials.v1.SendResponse>
      getSendMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.SendRequest,
            trinsic.services.verifiablecredentials.v1.SendResponse>
        getSendMethod;
    if ((getSendMethod = VerifiableCredentialGrpc.getSendMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getSendMethod = VerifiableCredentialGrpc.getSendMethod) == null) {
          VerifiableCredentialGrpc.getSendMethod =
              getSendMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.SendRequest,
                          trinsic.services.verifiablecredentials.v1.SendResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Send"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.SendRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.SendResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new VerifiableCredentialMethodDescriptorSupplier("Send"))
                      .build();
        }
      }
    }
    return getSendMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest,
          trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
      getCreateCredentialOfferMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateCredentialOffer",
      requestType = trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest,
          trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
      getCreateCredentialOfferMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest,
            trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
        getCreateCredentialOfferMethod;
    if ((getCreateCredentialOfferMethod = VerifiableCredentialGrpc.getCreateCredentialOfferMethod)
        == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getCreateCredentialOfferMethod =
                VerifiableCredentialGrpc.getCreateCredentialOfferMethod)
            == null) {
          VerifiableCredentialGrpc.getCreateCredentialOfferMethod =
              getCreateCredentialOfferMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest,
                          trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "CreateCredentialOffer"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1
                                  .CreateCredentialOfferResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("CreateCredentialOffer"))
                      .build();
        }
      }
    }
    return getCreateCredentialOfferMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest,
          trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
      getAcceptCredentialMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "AcceptCredential",
      requestType = trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest,
          trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
      getAcceptCredentialMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest,
            trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
        getAcceptCredentialMethod;
    if ((getAcceptCredentialMethod = VerifiableCredentialGrpc.getAcceptCredentialMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getAcceptCredentialMethod = VerifiableCredentialGrpc.getAcceptCredentialMethod)
            == null) {
          VerifiableCredentialGrpc.getAcceptCredentialMethod =
              getAcceptCredentialMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest,
                          trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "AcceptCredential"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("AcceptCredential"))
                      .build();
        }
      }
    }
    return getAcceptCredentialMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.RejectCredentialRequest,
          trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
      getRejectCredentialMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "RejectCredential",
      requestType = trinsic.services.verifiablecredentials.v1.RejectCredentialRequest.class,
      responseType = trinsic.services.verifiablecredentials.v1.RejectCredentialResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.v1.RejectCredentialRequest,
          trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
      getRejectCredentialMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.v1.RejectCredentialRequest,
            trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
        getRejectCredentialMethod;
    if ((getRejectCredentialMethod = VerifiableCredentialGrpc.getRejectCredentialMethod) == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        if ((getRejectCredentialMethod = VerifiableCredentialGrpc.getRejectCredentialMethod)
            == null) {
          VerifiableCredentialGrpc.getRejectCredentialMethod =
              getRejectCredentialMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.v1.RejectCredentialRequest,
                          trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "RejectCredential"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.RejectCredentialRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.v1.RejectCredentialResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new VerifiableCredentialMethodDescriptorSupplier("RejectCredential"))
                      .build();
        }
      }
    }
    return getRejectCredentialMethod;
  }

  /** Creates a new async stub that supports all call types for the service */
  public static VerifiableCredentialStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialStub>() {
          @java.lang.Override
          public VerifiableCredentialStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new VerifiableCredentialStub(channel, callOptions);
          }
        };
    return VerifiableCredentialStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static VerifiableCredentialBlockingStub newBlockingStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialBlockingStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialBlockingStub>() {
          @java.lang.Override
          public VerifiableCredentialBlockingStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new VerifiableCredentialBlockingStub(channel, callOptions);
          }
        };
    return VerifiableCredentialBlockingStub.newStub(factory, channel);
  }

  /** Creates a new ListenableFuture-style stub that supports unary calls on the service */
  public static VerifiableCredentialFutureStub newFutureStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialFutureStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<VerifiableCredentialFutureStub>() {
          @java.lang.Override
          public VerifiableCredentialFutureStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new VerifiableCredentialFutureStub(channel, callOptions);
          }
        };
    return VerifiableCredentialFutureStub.newStub(factory, channel);
  }

  /** */
  public abstract static class VerifiableCredentialImplBase implements io.grpc.BindableService {

    /**
     *
     *
     * <pre>
     * Sign and issue a verifiable credential from a pre-defined template.
     * This process will also add schema validation and
     * revocation registry values to the credential.
     * </pre>
     */
    public void issueFromTemplate(
        trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getIssueFromTemplateMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Check credential status in the revocation registry
     * </pre>
     */
    public void checkStatus(
        trinsic.services.verifiablecredentials.v1.CheckStatusRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCheckStatusMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Update credential status by setting the revocation value
     * </pre>
     */
    public void updateStatus(
        trinsic.services.verifiablecredentials.v1.UpdateStatusRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getUpdateStatusMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create a proof from a signed document that is a valid
     * verifiable credential and contains a signature from which a proof can be derived.
     * </pre>
     */
    public void createProof(
        trinsic.services.verifiablecredentials.v1.CreateProofRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.CreateProofResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCreateProofMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Verifies a proof by checking the signature value, and if possible schema validation,
     * revocation status, and issuer status against a trust registry
     * </pre>
     */
    public void verifyProof(
        trinsic.services.verifiablecredentials.v1.VerifyProofRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getVerifyProofMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Sends a document directly to a user's email within the given ecosystem
     * </pre>
     */
    public void send(
        trinsic.services.verifiablecredentials.v1.SendRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.SendResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSendMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create credential offer
     * </pre>
     */
    public void createCredentialOffer(
        trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCreateCredentialOfferMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Accept an offer to exchange a credential
     * </pre>
     */
    public void acceptCredential(
        trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getAcceptCredentialMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Reject an offer to exchange a credential
     * </pre>
     */
    public void rejectCredential(
        trinsic.services.verifiablecredentials.v1.RejectCredentialRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getRejectCredentialMethod(), responseObserver);
    }

    @java.lang.Override
    public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
              getIssueFromTemplateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest,
                      trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>(
                      this, METHODID_ISSUE_FROM_TEMPLATE)))
          .addMethod(
              getCheckStatusMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.CheckStatusRequest,
                      trinsic.services.verifiablecredentials.v1.CheckStatusResponse>(
                      this, METHODID_CHECK_STATUS)))
          .addMethod(
              getUpdateStatusMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.UpdateStatusRequest,
                      trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>(
                      this, METHODID_UPDATE_STATUS)))
          .addMethod(
              getCreateProofMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.CreateProofRequest,
                      trinsic.services.verifiablecredentials.v1.CreateProofResponse>(
                      this, METHODID_CREATE_PROOF)))
          .addMethod(
              getVerifyProofMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.VerifyProofRequest,
                      trinsic.services.verifiablecredentials.v1.VerifyProofResponse>(
                      this, METHODID_VERIFY_PROOF)))
          .addMethod(
              getSendMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.SendRequest,
                      trinsic.services.verifiablecredentials.v1.SendResponse>(this, METHODID_SEND)))
          .addMethod(
              getCreateCredentialOfferMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest,
                      trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>(
                      this, METHODID_CREATE_CREDENTIAL_OFFER)))
          .addMethod(
              getAcceptCredentialMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest,
                      trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>(
                      this, METHODID_ACCEPT_CREDENTIAL)))
          .addMethod(
              getRejectCredentialMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.v1.RejectCredentialRequest,
                      trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>(
                      this, METHODID_REJECT_CREDENTIAL)))
          .build();
    }
  }

  /** */
  public static final class VerifiableCredentialStub
      extends io.grpc.stub.AbstractAsyncStub<VerifiableCredentialStub> {
    private VerifiableCredentialStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected VerifiableCredentialStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new VerifiableCredentialStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Sign and issue a verifiable credential from a pre-defined template.
     * This process will also add schema validation and
     * revocation registry values to the credential.
     * </pre>
     */
    public void issueFromTemplate(
        trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getIssueFromTemplateMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Check credential status in the revocation registry
     * </pre>
     */
    public void checkStatus(
        trinsic.services.verifiablecredentials.v1.CheckStatusRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCheckStatusMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Update credential status by setting the revocation value
     * </pre>
     */
    public void updateStatus(
        trinsic.services.verifiablecredentials.v1.UpdateStatusRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateStatusMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create a proof from a signed document that is a valid
     * verifiable credential and contains a signature from which a proof can be derived.
     * </pre>
     */
    public void createProof(
        trinsic.services.verifiablecredentials.v1.CreateProofRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.CreateProofResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateProofMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Verifies a proof by checking the signature value, and if possible schema validation,
     * revocation status, and issuer status against a trust registry
     * </pre>
     */
    public void verifyProof(
        trinsic.services.verifiablecredentials.v1.VerifyProofRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getVerifyProofMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Sends a document directly to a user's email within the given ecosystem
     * </pre>
     */
    public void send(
        trinsic.services.verifiablecredentials.v1.SendRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.SendResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSendMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create credential offer
     * </pre>
     */
    public void createCredentialOffer(
        trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateCredentialOfferMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Accept an offer to exchange a credential
     * </pre>
     */
    public void acceptCredential(
        trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getAcceptCredentialMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Reject an offer to exchange a credential
     * </pre>
     */
    public void rejectCredential(
        trinsic.services.verifiablecredentials.v1.RejectCredentialRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getRejectCredentialMethod(), getCallOptions()),
          request,
          responseObserver);
    }
  }

  /** */
  public static final class VerifiableCredentialBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<VerifiableCredentialBlockingStub> {
    private VerifiableCredentialBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected VerifiableCredentialBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new VerifiableCredentialBlockingStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Sign and issue a verifiable credential from a pre-defined template.
     * This process will also add schema validation and
     * revocation registry values to the credential.
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse issueFromTemplate(
        trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getIssueFromTemplateMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Check credential status in the revocation registry
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.CheckStatusResponse checkStatus(
        trinsic.services.verifiablecredentials.v1.CheckStatusRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCheckStatusMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Update credential status by setting the revocation value
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.UpdateStatusResponse updateStatus(
        trinsic.services.verifiablecredentials.v1.UpdateStatusRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateStatusMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Create a proof from a signed document that is a valid
     * verifiable credential and contains a signature from which a proof can be derived.
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.CreateProofResponse createProof(
        trinsic.services.verifiablecredentials.v1.CreateProofRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateProofMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Verifies a proof by checking the signature value, and if possible schema validation,
     * revocation status, and issuer status against a trust registry
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.VerifyProofResponse verifyProof(
        trinsic.services.verifiablecredentials.v1.VerifyProofRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getVerifyProofMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Sends a document directly to a user's email within the given ecosystem
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.SendResponse send(
        trinsic.services.verifiablecredentials.v1.SendRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSendMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Create credential offer
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse
        createCredentialOffer(
            trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateCredentialOfferMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Accept an offer to exchange a credential
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse acceptCredential(
        trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getAcceptCredentialMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Reject an offer to exchange a credential
     * </pre>
     */
    public trinsic.services.verifiablecredentials.v1.RejectCredentialResponse rejectCredential(
        trinsic.services.verifiablecredentials.v1.RejectCredentialRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getRejectCredentialMethod(), getCallOptions(), request);
    }
  }

  /** */
  public static final class VerifiableCredentialFutureStub
      extends io.grpc.stub.AbstractFutureStub<VerifiableCredentialFutureStub> {
    private VerifiableCredentialFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected VerifiableCredentialFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new VerifiableCredentialFutureStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Sign and issue a verifiable credential from a pre-defined template.
     * This process will also add schema validation and
     * revocation registry values to the credential.
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>
        issueFromTemplate(
            trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getIssueFromTemplateMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Check credential status in the revocation registry
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.CheckStatusResponse>
        checkStatus(trinsic.services.verifiablecredentials.v1.CheckStatusRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCheckStatusMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Update credential status by setting the revocation value
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>
        updateStatus(trinsic.services.verifiablecredentials.v1.UpdateStatusRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateStatusMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Create a proof from a signed document that is a valid
     * verifiable credential and contains a signature from which a proof can be derived.
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.CreateProofResponse>
        createProof(trinsic.services.verifiablecredentials.v1.CreateProofRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateProofMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Verifies a proof by checking the signature value, and if possible schema validation,
     * revocation status, and issuer status against a trust registry
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.VerifyProofResponse>
        verifyProof(trinsic.services.verifiablecredentials.v1.VerifyProofRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getVerifyProofMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Sends a document directly to a user's email within the given ecosystem
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.SendResponse>
        send(trinsic.services.verifiablecredentials.v1.SendRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSendMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Create credential offer
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>
        createCredentialOffer(
            trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateCredentialOfferMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Accept an offer to exchange a credential
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>
        acceptCredential(
            trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getAcceptCredentialMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Reject an offer to exchange a credential
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>
        rejectCredential(
            trinsic.services.verifiablecredentials.v1.RejectCredentialRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getRejectCredentialMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_ISSUE_FROM_TEMPLATE = 0;
  private static final int METHODID_CHECK_STATUS = 1;
  private static final int METHODID_UPDATE_STATUS = 2;
  private static final int METHODID_CREATE_PROOF = 3;
  private static final int METHODID_VERIFY_PROOF = 4;
  private static final int METHODID_SEND = 5;
  private static final int METHODID_CREATE_CREDENTIAL_OFFER = 6;
  private static final int METHODID_ACCEPT_CREDENTIAL = 7;
  private static final int METHODID_REJECT_CREDENTIAL = 8;

  private static final class MethodHandlers<Req, Resp>
      implements io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final VerifiableCredentialImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(VerifiableCredentialImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_ISSUE_FROM_TEMPLATE:
          serviceImpl.issueFromTemplate(
              (trinsic.services.verifiablecredentials.v1.IssueFromTemplateRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.IssueFromTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_CHECK_STATUS:
          serviceImpl.checkStatus(
              (trinsic.services.verifiablecredentials.v1.CheckStatusRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.CheckStatusResponse>)
                  responseObserver);
          break;
        case METHODID_UPDATE_STATUS:
          serviceImpl.updateStatus(
              (trinsic.services.verifiablecredentials.v1.UpdateStatusRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.UpdateStatusResponse>)
                  responseObserver);
          break;
        case METHODID_CREATE_PROOF:
          serviceImpl.createProof(
              (trinsic.services.verifiablecredentials.v1.CreateProofRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.CreateProofResponse>)
                  responseObserver);
          break;
        case METHODID_VERIFY_PROOF:
          serviceImpl.verifyProof(
              (trinsic.services.verifiablecredentials.v1.VerifyProofRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.VerifyProofResponse>)
                  responseObserver);
          break;
        case METHODID_SEND:
          serviceImpl.send(
              (trinsic.services.verifiablecredentials.v1.SendRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.verifiablecredentials.v1.SendResponse>)
                  responseObserver);
          break;
        case METHODID_CREATE_CREDENTIAL_OFFER:
          serviceImpl.createCredentialOffer(
              (trinsic.services.verifiablecredentials.v1.CreateCredentialOfferRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.CreateCredentialOfferResponse>)
                  responseObserver);
          break;
        case METHODID_ACCEPT_CREDENTIAL:
          serviceImpl.acceptCredential(
              (trinsic.services.verifiablecredentials.v1.AcceptCredentialRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.AcceptCredentialResponse>)
                  responseObserver);
          break;
        case METHODID_REJECT_CREDENTIAL:
          serviceImpl.rejectCredential(
              (trinsic.services.verifiablecredentials.v1.RejectCredentialRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.v1.RejectCredentialResponse>)
                  responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private abstract static class VerifiableCredentialBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier,
          io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    VerifiableCredentialBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return trinsic.services.verifiablecredentials.v1.VerifiableCredentials.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("VerifiableCredential");
    }
  }

  private static final class VerifiableCredentialFileDescriptorSupplier
      extends VerifiableCredentialBaseDescriptorSupplier {
    VerifiableCredentialFileDescriptorSupplier() {}
  }

  private static final class VerifiableCredentialMethodDescriptorSupplier
      extends VerifiableCredentialBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    VerifiableCredentialMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (VerifiableCredentialGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor =
              result =
                  io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
                      .setSchemaDescriptor(new VerifiableCredentialFileDescriptorSupplier())
                      .addMethod(getIssueFromTemplateMethod())
                      .addMethod(getCheckStatusMethod())
                      .addMethod(getUpdateStatusMethod())
                      .addMethod(getCreateProofMethod())
                      .addMethod(getVerifyProofMethod())
                      .addMethod(getSendMethod())
                      .addMethod(getCreateCredentialOfferMethod())
                      .addMethod(getAcceptCredentialMethod())
                      .addMethod(getRejectCredentialMethod())
                      .build();
        }
      }
    }
    return result;
  }
}
