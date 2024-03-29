package trinsic.services.provider.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/** */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.49.2)",
    comments = "Source: services/provider/v1/provider.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class ProviderGrpc {

  private ProviderGrpc() {}

  public static final String SERVICE_NAME = "services.provider.v1.Provider";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.CreateEcosystemRequest,
          trinsic.services.provider.v1.CreateEcosystemResponse>
      getCreateEcosystemMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateEcosystem",
      requestType = trinsic.services.provider.v1.CreateEcosystemRequest.class,
      responseType = trinsic.services.provider.v1.CreateEcosystemResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.CreateEcosystemRequest,
          trinsic.services.provider.v1.CreateEcosystemResponse>
      getCreateEcosystemMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.provider.v1.CreateEcosystemRequest,
            trinsic.services.provider.v1.CreateEcosystemResponse>
        getCreateEcosystemMethod;
    if ((getCreateEcosystemMethod = ProviderGrpc.getCreateEcosystemMethod) == null) {
      synchronized (ProviderGrpc.class) {
        if ((getCreateEcosystemMethod = ProviderGrpc.getCreateEcosystemMethod) == null) {
          ProviderGrpc.getCreateEcosystemMethod =
              getCreateEcosystemMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.provider.v1.CreateEcosystemRequest,
                          trinsic.services.provider.v1.CreateEcosystemResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateEcosystem"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.CreateEcosystemRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.CreateEcosystemResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new ProviderMethodDescriptorSupplier("CreateEcosystem"))
                      .build();
        }
      }
    }
    return getCreateEcosystemMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.GetOberonKeyRequest,
          trinsic.services.provider.v1.GetOberonKeyResponse>
      getGetOberonKeyMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetOberonKey",
      requestType = trinsic.services.provider.v1.GetOberonKeyRequest.class,
      responseType = trinsic.services.provider.v1.GetOberonKeyResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.GetOberonKeyRequest,
          trinsic.services.provider.v1.GetOberonKeyResponse>
      getGetOberonKeyMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.provider.v1.GetOberonKeyRequest,
            trinsic.services.provider.v1.GetOberonKeyResponse>
        getGetOberonKeyMethod;
    if ((getGetOberonKeyMethod = ProviderGrpc.getGetOberonKeyMethod) == null) {
      synchronized (ProviderGrpc.class) {
        if ((getGetOberonKeyMethod = ProviderGrpc.getGetOberonKeyMethod) == null) {
          ProviderGrpc.getGetOberonKeyMethod =
              getGetOberonKeyMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.provider.v1.GetOberonKeyRequest,
                          trinsic.services.provider.v1.GetOberonKeyResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetOberonKey"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.GetOberonKeyRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.GetOberonKeyResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new ProviderMethodDescriptorSupplier("GetOberonKey"))
                      .build();
        }
      }
    }
    return getGetOberonKeyMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.UpgradeDidRequest,
          trinsic.services.provider.v1.UpgradeDidResponse>
      getUpgradeDIDMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpgradeDID",
      requestType = trinsic.services.provider.v1.UpgradeDidRequest.class,
      responseType = trinsic.services.provider.v1.UpgradeDidResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.UpgradeDidRequest,
          trinsic.services.provider.v1.UpgradeDidResponse>
      getUpgradeDIDMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.provider.v1.UpgradeDidRequest,
            trinsic.services.provider.v1.UpgradeDidResponse>
        getUpgradeDIDMethod;
    if ((getUpgradeDIDMethod = ProviderGrpc.getUpgradeDIDMethod) == null) {
      synchronized (ProviderGrpc.class) {
        if ((getUpgradeDIDMethod = ProviderGrpc.getUpgradeDIDMethod) == null) {
          ProviderGrpc.getUpgradeDIDMethod =
              getUpgradeDIDMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.provider.v1.UpgradeDidRequest,
                          trinsic.services.provider.v1.UpgradeDidResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "UpgradeDID"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.UpgradeDidRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.UpgradeDidResponse.getDefaultInstance()))
                      .setSchemaDescriptor(new ProviderMethodDescriptorSupplier("UpgradeDID"))
                      .build();
        }
      }
    }
    return getUpgradeDIDMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.SearchWalletConfigurationsRequest,
          trinsic.services.provider.v1.SearchWalletConfigurationResponse>
      getSearchWalletConfigurationsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "SearchWalletConfigurations",
      requestType = trinsic.services.provider.v1.SearchWalletConfigurationsRequest.class,
      responseType = trinsic.services.provider.v1.SearchWalletConfigurationResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.provider.v1.SearchWalletConfigurationsRequest,
          trinsic.services.provider.v1.SearchWalletConfigurationResponse>
      getSearchWalletConfigurationsMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.provider.v1.SearchWalletConfigurationsRequest,
            trinsic.services.provider.v1.SearchWalletConfigurationResponse>
        getSearchWalletConfigurationsMethod;
    if ((getSearchWalletConfigurationsMethod = ProviderGrpc.getSearchWalletConfigurationsMethod)
        == null) {
      synchronized (ProviderGrpc.class) {
        if ((getSearchWalletConfigurationsMethod = ProviderGrpc.getSearchWalletConfigurationsMethod)
            == null) {
          ProviderGrpc.getSearchWalletConfigurationsMethod =
              getSearchWalletConfigurationsMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.provider.v1.SearchWalletConfigurationsRequest,
                          trinsic.services.provider.v1.SearchWalletConfigurationResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "SearchWalletConfigurations"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.SearchWalletConfigurationsRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.provider.v1.SearchWalletConfigurationResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new ProviderMethodDescriptorSupplier("SearchWalletConfigurations"))
                      .build();
        }
      }
    }
    return getSearchWalletConfigurationsMethod;
  }

  /** Creates a new async stub that supports all call types for the service */
  public static ProviderStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ProviderStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ProviderStub>() {
          @java.lang.Override
          public ProviderStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ProviderStub(channel, callOptions);
          }
        };
    return ProviderStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static ProviderBlockingStub newBlockingStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ProviderBlockingStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ProviderBlockingStub>() {
          @java.lang.Override
          public ProviderBlockingStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ProviderBlockingStub(channel, callOptions);
          }
        };
    return ProviderBlockingStub.newStub(factory, channel);
  }

  /** Creates a new ListenableFuture-style stub that supports unary calls on the service */
  public static ProviderFutureStub newFutureStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ProviderFutureStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ProviderFutureStub>() {
          @java.lang.Override
          public ProviderFutureStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ProviderFutureStub(channel, callOptions);
          }
        };
    return ProviderFutureStub.newStub(factory, channel);
  }

  /** */
  public abstract static class ProviderImplBase implements io.grpc.BindableService {

    /**
     *
     *
     * <pre>
     * Create new ecosystem and assign the authenticated user as owner
     * </pre>
     */
    public void createEcosystem(
        trinsic.services.provider.v1.CreateEcosystemRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.CreateEcosystemResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCreateEcosystemMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Returns the public key being used to create/verify oberon tokens
     * </pre>
     */
    public void getOberonKey(
        trinsic.services.provider.v1.GetOberonKeyRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.GetOberonKeyResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getGetOberonKeyMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Upgrade a wallet's DID from `did:key` to another method
     * </pre>
     */
    public void upgradeDID(
        trinsic.services.provider.v1.UpgradeDidRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.UpgradeDidResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpgradeDIDMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search for issuers/providers/verifiers in the current ecosystem
     * </pre>
     */
    public void searchWalletConfigurations(
        trinsic.services.provider.v1.SearchWalletConfigurationsRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.SearchWalletConfigurationResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getSearchWalletConfigurationsMethod(), responseObserver);
    }

    @java.lang.Override
    public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
              getCreateEcosystemMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.provider.v1.CreateEcosystemRequest,
                      trinsic.services.provider.v1.CreateEcosystemResponse>(
                      this, METHODID_CREATE_ECOSYSTEM)))
          .addMethod(
              getGetOberonKeyMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.provider.v1.GetOberonKeyRequest,
                      trinsic.services.provider.v1.GetOberonKeyResponse>(
                      this, METHODID_GET_OBERON_KEY)))
          .addMethod(
              getUpgradeDIDMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.provider.v1.UpgradeDidRequest,
                      trinsic.services.provider.v1.UpgradeDidResponse>(this, METHODID_UPGRADE_DID)))
          .addMethod(
              getSearchWalletConfigurationsMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.provider.v1.SearchWalletConfigurationsRequest,
                      trinsic.services.provider.v1.SearchWalletConfigurationResponse>(
                      this, METHODID_SEARCH_WALLET_CONFIGURATIONS)))
          .build();
    }
  }

  /** */
  public static final class ProviderStub extends io.grpc.stub.AbstractAsyncStub<ProviderStub> {
    private ProviderStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ProviderStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ProviderStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create new ecosystem and assign the authenticated user as owner
     * </pre>
     */
    public void createEcosystem(
        trinsic.services.provider.v1.CreateEcosystemRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.CreateEcosystemResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateEcosystemMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Returns the public key being used to create/verify oberon tokens
     * </pre>
     */
    public void getOberonKey(
        trinsic.services.provider.v1.GetOberonKeyRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.GetOberonKeyResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetOberonKeyMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Upgrade a wallet's DID from `did:key` to another method
     * </pre>
     */
    public void upgradeDID(
        trinsic.services.provider.v1.UpgradeDidRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.UpgradeDidResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpgradeDIDMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search for issuers/providers/verifiers in the current ecosystem
     * </pre>
     */
    public void searchWalletConfigurations(
        trinsic.services.provider.v1.SearchWalletConfigurationsRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.provider.v1.SearchWalletConfigurationResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSearchWalletConfigurationsMethod(), getCallOptions()),
          request,
          responseObserver);
    }
  }

  /** */
  public static final class ProviderBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<ProviderBlockingStub> {
    private ProviderBlockingStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ProviderBlockingStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ProviderBlockingStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create new ecosystem and assign the authenticated user as owner
     * </pre>
     */
    public trinsic.services.provider.v1.CreateEcosystemResponse createEcosystem(
        trinsic.services.provider.v1.CreateEcosystemRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateEcosystemMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Returns the public key being used to create/verify oberon tokens
     * </pre>
     */
    public trinsic.services.provider.v1.GetOberonKeyResponse getOberonKey(
        trinsic.services.provider.v1.GetOberonKeyRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetOberonKeyMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Upgrade a wallet's DID from `did:key` to another method
     * </pre>
     */
    public trinsic.services.provider.v1.UpgradeDidResponse upgradeDID(
        trinsic.services.provider.v1.UpgradeDidRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpgradeDIDMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Search for issuers/providers/verifiers in the current ecosystem
     * </pre>
     */
    public trinsic.services.provider.v1.SearchWalletConfigurationResponse
        searchWalletConfigurations(
            trinsic.services.provider.v1.SearchWalletConfigurationsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSearchWalletConfigurationsMethod(), getCallOptions(), request);
    }
  }

  /** */
  public static final class ProviderFutureStub
      extends io.grpc.stub.AbstractFutureStub<ProviderFutureStub> {
    private ProviderFutureStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ProviderFutureStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ProviderFutureStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create new ecosystem and assign the authenticated user as owner
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.provider.v1.CreateEcosystemResponse>
        createEcosystem(trinsic.services.provider.v1.CreateEcosystemRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateEcosystemMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Returns the public key being used to create/verify oberon tokens
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.provider.v1.GetOberonKeyResponse>
        getOberonKey(trinsic.services.provider.v1.GetOberonKeyRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetOberonKeyMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Upgrade a wallet's DID from `did:key` to another method
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.provider.v1.UpgradeDidResponse>
        upgradeDID(trinsic.services.provider.v1.UpgradeDidRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpgradeDIDMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Search for issuers/providers/verifiers in the current ecosystem
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.provider.v1.SearchWalletConfigurationResponse>
        searchWalletConfigurations(
            trinsic.services.provider.v1.SearchWalletConfigurationsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSearchWalletConfigurationsMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_ECOSYSTEM = 0;
  private static final int METHODID_GET_OBERON_KEY = 1;
  private static final int METHODID_UPGRADE_DID = 2;
  private static final int METHODID_SEARCH_WALLET_CONFIGURATIONS = 3;

  private static final class MethodHandlers<Req, Resp>
      implements io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final ProviderImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(ProviderImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_ECOSYSTEM:
          serviceImpl.createEcosystem(
              (trinsic.services.provider.v1.CreateEcosystemRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.provider.v1.CreateEcosystemResponse>)
                  responseObserver);
          break;
        case METHODID_GET_OBERON_KEY:
          serviceImpl.getOberonKey(
              (trinsic.services.provider.v1.GetOberonKeyRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.provider.v1.GetOberonKeyResponse>)
                  responseObserver);
          break;
        case METHODID_UPGRADE_DID:
          serviceImpl.upgradeDID(
              (trinsic.services.provider.v1.UpgradeDidRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.provider.v1.UpgradeDidResponse>)
                  responseObserver);
          break;
        case METHODID_SEARCH_WALLET_CONFIGURATIONS:
          serviceImpl.searchWalletConfigurations(
              (trinsic.services.provider.v1.SearchWalletConfigurationsRequest) request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.provider.v1.SearchWalletConfigurationResponse>)
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

  private abstract static class ProviderBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier,
          io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    ProviderBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return trinsic.services.provider.v1.ProviderOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("Provider");
    }
  }

  private static final class ProviderFileDescriptorSupplier extends ProviderBaseDescriptorSupplier {
    ProviderFileDescriptorSupplier() {}
  }

  private static final class ProviderMethodDescriptorSupplier extends ProviderBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    ProviderMethodDescriptorSupplier(String methodName) {
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
      synchronized (ProviderGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor =
              result =
                  io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
                      .setSchemaDescriptor(new ProviderFileDescriptorSupplier())
                      .addMethod(getCreateEcosystemMethod())
                      .addMethod(getGetOberonKeyMethod())
                      .addMethod(getUpgradeDIDMethod())
                      .addMethod(getSearchWalletConfigurationsMethod())
                      .build();
        }
      }
    }
    return result;
  }
}
