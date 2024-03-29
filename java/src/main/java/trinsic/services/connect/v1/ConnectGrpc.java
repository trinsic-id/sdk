package trinsic.services.connect.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 *
 *
 * <pre>
 * The Connect service provides access to Trinsic Connect, a reusable identity verification service.
 * </pre>
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.49.2)",
    comments = "Source: services/connect/v1/connect.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class ConnectGrpc {

  private ConnectGrpc() {}

  public static final String SERVICE_NAME = "services.connect.v1.Connect";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.CreateSessionRequest,
          trinsic.services.connect.v1.CreateSessionResponse>
      getCreateSessionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateSession",
      requestType = trinsic.services.connect.v1.CreateSessionRequest.class,
      responseType = trinsic.services.connect.v1.CreateSessionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.CreateSessionRequest,
          trinsic.services.connect.v1.CreateSessionResponse>
      getCreateSessionMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.connect.v1.CreateSessionRequest,
            trinsic.services.connect.v1.CreateSessionResponse>
        getCreateSessionMethod;
    if ((getCreateSessionMethod = ConnectGrpc.getCreateSessionMethod) == null) {
      synchronized (ConnectGrpc.class) {
        if ((getCreateSessionMethod = ConnectGrpc.getCreateSessionMethod) == null) {
          ConnectGrpc.getCreateSessionMethod =
              getCreateSessionMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.connect.v1.CreateSessionRequest,
                          trinsic.services.connect.v1.CreateSessionResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CreateSession"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.CreateSessionRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.CreateSessionResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new ConnectMethodDescriptorSupplier("CreateSession"))
                      .build();
        }
      }
    }
    return getCreateSessionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.CancelSessionRequest,
          trinsic.services.connect.v1.CancelSessionResponse>
      getCancelSessionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CancelSession",
      requestType = trinsic.services.connect.v1.CancelSessionRequest.class,
      responseType = trinsic.services.connect.v1.CancelSessionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.CancelSessionRequest,
          trinsic.services.connect.v1.CancelSessionResponse>
      getCancelSessionMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.connect.v1.CancelSessionRequest,
            trinsic.services.connect.v1.CancelSessionResponse>
        getCancelSessionMethod;
    if ((getCancelSessionMethod = ConnectGrpc.getCancelSessionMethod) == null) {
      synchronized (ConnectGrpc.class) {
        if ((getCancelSessionMethod = ConnectGrpc.getCancelSessionMethod) == null) {
          ConnectGrpc.getCancelSessionMethod =
              getCancelSessionMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.connect.v1.CancelSessionRequest,
                          trinsic.services.connect.v1.CancelSessionResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "CancelSession"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.CancelSessionRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.CancelSessionResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new ConnectMethodDescriptorSupplier("CancelSession"))
                      .build();
        }
      }
    }
    return getCancelSessionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.GetSessionRequest,
          trinsic.services.connect.v1.GetSessionResponse>
      getGetSessionMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetSession",
      requestType = trinsic.services.connect.v1.GetSessionRequest.class,
      responseType = trinsic.services.connect.v1.GetSessionResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.GetSessionRequest,
          trinsic.services.connect.v1.GetSessionResponse>
      getGetSessionMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.connect.v1.GetSessionRequest,
            trinsic.services.connect.v1.GetSessionResponse>
        getGetSessionMethod;
    if ((getGetSessionMethod = ConnectGrpc.getGetSessionMethod) == null) {
      synchronized (ConnectGrpc.class) {
        if ((getGetSessionMethod = ConnectGrpc.getGetSessionMethod) == null) {
          ConnectGrpc.getGetSessionMethod =
              getGetSessionMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.connect.v1.GetSessionRequest,
                          trinsic.services.connect.v1.GetSessionResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetSession"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.GetSessionRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.GetSessionResponse.getDefaultInstance()))
                      .setSchemaDescriptor(new ConnectMethodDescriptorSupplier("GetSession"))
                      .build();
        }
      }
    }
    return getGetSessionMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.ListSessionsRequest,
          trinsic.services.connect.v1.ListSessionsResponse>
      getListSessionsMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListSessions",
      requestType = trinsic.services.connect.v1.ListSessionsRequest.class,
      responseType = trinsic.services.connect.v1.ListSessionsResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.ListSessionsRequest,
          trinsic.services.connect.v1.ListSessionsResponse>
      getListSessionsMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.connect.v1.ListSessionsRequest,
            trinsic.services.connect.v1.ListSessionsResponse>
        getListSessionsMethod;
    if ((getListSessionsMethod = ConnectGrpc.getListSessionsMethod) == null) {
      synchronized (ConnectGrpc.class) {
        if ((getListSessionsMethod = ConnectGrpc.getListSessionsMethod) == null) {
          ConnectGrpc.getListSessionsMethod =
              getListSessionsMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.connect.v1.ListSessionsRequest,
                          trinsic.services.connect.v1.ListSessionsResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "ListSessions"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.ListSessionsRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.ListSessionsResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(new ConnectMethodDescriptorSupplier("ListSessions"))
                      .build();
        }
      }
    }
    return getListSessionsMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.HasValidCredentialRequest,
          trinsic.services.connect.v1.HasValidCredentialResponse>
      getHasValidCredentialMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "HasValidCredential",
      requestType = trinsic.services.connect.v1.HasValidCredentialRequest.class,
      responseType = trinsic.services.connect.v1.HasValidCredentialResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.connect.v1.HasValidCredentialRequest,
          trinsic.services.connect.v1.HasValidCredentialResponse>
      getHasValidCredentialMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.connect.v1.HasValidCredentialRequest,
            trinsic.services.connect.v1.HasValidCredentialResponse>
        getHasValidCredentialMethod;
    if ((getHasValidCredentialMethod = ConnectGrpc.getHasValidCredentialMethod) == null) {
      synchronized (ConnectGrpc.class) {
        if ((getHasValidCredentialMethod = ConnectGrpc.getHasValidCredentialMethod) == null) {
          ConnectGrpc.getHasValidCredentialMethod =
              getHasValidCredentialMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.connect.v1.HasValidCredentialRequest,
                          trinsic.services.connect.v1.HasValidCredentialResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "HasValidCredential"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.HasValidCredentialRequest
                                  .getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.connect.v1.HasValidCredentialResponse
                                  .getDefaultInstance()))
                      .setSchemaDescriptor(
                          new ConnectMethodDescriptorSupplier("HasValidCredential"))
                      .build();
        }
      }
    }
    return getHasValidCredentialMethod;
  }

  /** Creates a new async stub that supports all call types for the service */
  public static ConnectStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ConnectStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ConnectStub>() {
          @java.lang.Override
          public ConnectStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ConnectStub(channel, callOptions);
          }
        };
    return ConnectStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static ConnectBlockingStub newBlockingStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ConnectBlockingStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ConnectBlockingStub>() {
          @java.lang.Override
          public ConnectBlockingStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ConnectBlockingStub(channel, callOptions);
          }
        };
    return ConnectBlockingStub.newStub(factory, channel);
  }

  /** Creates a new ListenableFuture-style stub that supports unary calls on the service */
  public static ConnectFutureStub newFutureStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<ConnectFutureStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<ConnectFutureStub>() {
          @java.lang.Override
          public ConnectFutureStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new ConnectFutureStub(channel, callOptions);
          }
        };
    return ConnectFutureStub.newStub(factory, channel);
  }

  /**
   *
   *
   * <pre>
   * The Connect service provides access to Trinsic Connect, a reusable identity verification service.
   * </pre>
   */
  public abstract static class ConnectImplBase implements io.grpc.BindableService {

    /**
     *
     *
     * <pre>
     * Create an IDVSession
     * </pre>
     */
    public void createSession(
        trinsic.services.connect.v1.CreateSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CreateSessionResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCreateSessionMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Cancel an IDVSession
     * </pre>
     */
    public void cancelSession(
        trinsic.services.connect.v1.CancelSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CancelSessionResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCancelSessionMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Get an IDVSession
     * </pre>
     */
    public void getSession(
        trinsic.services.connect.v1.GetSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.GetSessionResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetSessionMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * List IDVSessions created by the calling wallet
     * </pre>
     */
    public void listSessions(
        trinsic.services.connect.v1.ListSessionsRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.ListSessionsResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getListSessionsMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Checks if the identity provided in the request has a wallet containing a valid reusable credential
     * </pre>
     */
    public void hasValidCredential(
        trinsic.services.connect.v1.HasValidCredentialRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.HasValidCredentialResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getHasValidCredentialMethod(), responseObserver);
    }

    @java.lang.Override
    public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
              getCreateSessionMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.connect.v1.CreateSessionRequest,
                      trinsic.services.connect.v1.CreateSessionResponse>(
                      this, METHODID_CREATE_SESSION)))
          .addMethod(
              getCancelSessionMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.connect.v1.CancelSessionRequest,
                      trinsic.services.connect.v1.CancelSessionResponse>(
                      this, METHODID_CANCEL_SESSION)))
          .addMethod(
              getGetSessionMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.connect.v1.GetSessionRequest,
                      trinsic.services.connect.v1.GetSessionResponse>(this, METHODID_GET_SESSION)))
          .addMethod(
              getListSessionsMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.connect.v1.ListSessionsRequest,
                      trinsic.services.connect.v1.ListSessionsResponse>(
                      this, METHODID_LIST_SESSIONS)))
          .addMethod(
              getHasValidCredentialMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.connect.v1.HasValidCredentialRequest,
                      trinsic.services.connect.v1.HasValidCredentialResponse>(
                      this, METHODID_HAS_VALID_CREDENTIAL)))
          .build();
    }
  }

  /**
   *
   *
   * <pre>
   * The Connect service provides access to Trinsic Connect, a reusable identity verification service.
   * </pre>
   */
  public static final class ConnectStub extends io.grpc.stub.AbstractAsyncStub<ConnectStub> {
    private ConnectStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ConnectStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ConnectStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create an IDVSession
     * </pre>
     */
    public void createSession(
        trinsic.services.connect.v1.CreateSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CreateSessionResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateSessionMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Cancel an IDVSession
     * </pre>
     */
    public void cancelSession(
        trinsic.services.connect.v1.CancelSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CancelSessionResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCancelSessionMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Get an IDVSession
     * </pre>
     */
    public void getSession(
        trinsic.services.connect.v1.GetSessionRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.GetSessionResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetSessionMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * List IDVSessions created by the calling wallet
     * </pre>
     */
    public void listSessions(
        trinsic.services.connect.v1.ListSessionsRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.ListSessionsResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListSessionsMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Checks if the identity provided in the request has a wallet containing a valid reusable credential
     * </pre>
     */
    public void hasValidCredential(
        trinsic.services.connect.v1.HasValidCredentialRequest request,
        io.grpc.stub.StreamObserver<trinsic.services.connect.v1.HasValidCredentialResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getHasValidCredentialMethod(), getCallOptions()),
          request,
          responseObserver);
    }
  }

  /**
   *
   *
   * <pre>
   * The Connect service provides access to Trinsic Connect, a reusable identity verification service.
   * </pre>
   */
  public static final class ConnectBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<ConnectBlockingStub> {
    private ConnectBlockingStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ConnectBlockingStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ConnectBlockingStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create an IDVSession
     * </pre>
     */
    public trinsic.services.connect.v1.CreateSessionResponse createSession(
        trinsic.services.connect.v1.CreateSessionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateSessionMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Cancel an IDVSession
     * </pre>
     */
    public trinsic.services.connect.v1.CancelSessionResponse cancelSession(
        trinsic.services.connect.v1.CancelSessionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCancelSessionMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Get an IDVSession
     * </pre>
     */
    public trinsic.services.connect.v1.GetSessionResponse getSession(
        trinsic.services.connect.v1.GetSessionRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetSessionMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * List IDVSessions created by the calling wallet
     * </pre>
     */
    public trinsic.services.connect.v1.ListSessionsResponse listSessions(
        trinsic.services.connect.v1.ListSessionsRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListSessionsMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Checks if the identity provided in the request has a wallet containing a valid reusable credential
     * </pre>
     */
    public trinsic.services.connect.v1.HasValidCredentialResponse hasValidCredential(
        trinsic.services.connect.v1.HasValidCredentialRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getHasValidCredentialMethod(), getCallOptions(), request);
    }
  }

  /**
   *
   *
   * <pre>
   * The Connect service provides access to Trinsic Connect, a reusable identity verification service.
   * </pre>
   */
  public static final class ConnectFutureStub
      extends io.grpc.stub.AbstractFutureStub<ConnectFutureStub> {
    private ConnectFutureStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected ConnectFutureStub build(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new ConnectFutureStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create an IDVSession
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.connect.v1.CreateSessionResponse>
        createSession(trinsic.services.connect.v1.CreateSessionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateSessionMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Cancel an IDVSession
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.connect.v1.CancelSessionResponse>
        cancelSession(trinsic.services.connect.v1.CancelSessionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCancelSessionMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Get an IDVSession
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.connect.v1.GetSessionResponse>
        getSession(trinsic.services.connect.v1.GetSessionRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetSessionMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * List IDVSessions created by the calling wallet
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.connect.v1.ListSessionsResponse>
        listSessions(trinsic.services.connect.v1.ListSessionsRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListSessionsMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Checks if the identity provided in the request has a wallet containing a valid reusable credential
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.connect.v1.HasValidCredentialResponse>
        hasValidCredential(trinsic.services.connect.v1.HasValidCredentialRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getHasValidCredentialMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE_SESSION = 0;
  private static final int METHODID_CANCEL_SESSION = 1;
  private static final int METHODID_GET_SESSION = 2;
  private static final int METHODID_LIST_SESSIONS = 3;
  private static final int METHODID_HAS_VALID_CREDENTIAL = 4;

  private static final class MethodHandlers<Req, Resp>
      implements io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final ConnectImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(ConnectImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE_SESSION:
          serviceImpl.createSession(
              (trinsic.services.connect.v1.CreateSessionRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CreateSessionResponse>)
                  responseObserver);
          break;
        case METHODID_CANCEL_SESSION:
          serviceImpl.cancelSession(
              (trinsic.services.connect.v1.CancelSessionRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.connect.v1.CancelSessionResponse>)
                  responseObserver);
          break;
        case METHODID_GET_SESSION:
          serviceImpl.getSession(
              (trinsic.services.connect.v1.GetSessionRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.connect.v1.GetSessionResponse>)
                  responseObserver);
          break;
        case METHODID_LIST_SESSIONS:
          serviceImpl.listSessions(
              (trinsic.services.connect.v1.ListSessionsRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.connect.v1.ListSessionsResponse>)
                  responseObserver);
          break;
        case METHODID_HAS_VALID_CREDENTIAL:
          serviceImpl.hasValidCredential(
              (trinsic.services.connect.v1.HasValidCredentialRequest) request,
              (io.grpc.stub.StreamObserver<trinsic.services.connect.v1.HasValidCredentialResponse>)
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

  private abstract static class ConnectBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier,
          io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    ConnectBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return trinsic.services.connect.v1.ConnectOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("Connect");
    }
  }

  private static final class ConnectFileDescriptorSupplier extends ConnectBaseDescriptorSupplier {
    ConnectFileDescriptorSupplier() {}
  }

  private static final class ConnectMethodDescriptorSupplier extends ConnectBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    ConnectMethodDescriptorSupplier(String methodName) {
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
      synchronized (ConnectGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor =
              result =
                  io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
                      .setSchemaDescriptor(new ConnectFileDescriptorSupplier())
                      .addMethod(getCreateSessionMethod())
                      .addMethod(getCancelSessionMethod())
                      .addMethod(getGetSessionMethod())
                      .addMethod(getListSessionsMethod())
                      .addMethod(getHasValidCredentialMethod())
                      .build();
        }
      }
    }
    return result;
  }
}
