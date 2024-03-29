package trinsic.services.verifiablecredentials.templates.v1;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/** */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.49.2)",
    comments = "Source: services/verifiable-credentials/templates/v1/templates.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class CredentialTemplatesGrpc {

  private CredentialTemplatesGrpc() {}

  public static final String SERVICE_NAME =
      "services.verifiablecredentials.templates.v1.CredentialTemplates";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse>
      getCreateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Create",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse>
      getCreateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse>
        getCreateMethod;
    if ((getCreateMethod = CredentialTemplatesGrpc.getCreateMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getCreateMethod = CredentialTemplatesGrpc.getCreateMethod) == null) {
          CredentialTemplatesGrpc.getCreateMethod =
              getCreateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .CreateCredentialTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .CreateCredentialTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Create"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .CreateCredentialTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .CreateCredentialTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier("Create"))
                      .build();
        }
      }
    }
    return getCreateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
      getGetMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Get",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
      getGetMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
        getGetMethod;
    if ((getGetMethod = CredentialTemplatesGrpc.getGetMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getGetMethod = CredentialTemplatesGrpc.getGetMethod) == null) {
          CredentialTemplatesGrpc.getGetMethod =
              getGetMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .GetCredentialTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .GetCredentialTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Get"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .GetCredentialTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .GetCredentialTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(new CredentialTemplatesMethodDescriptorSupplier("Get"))
                      .build();
        }
      }
    }
    return getGetMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse>
      getUpdateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Update",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse>
      getUpdateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse>
        getUpdateMethod;
    if ((getUpdateMethod = CredentialTemplatesGrpc.getUpdateMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getUpdateMethod = CredentialTemplatesGrpc.getUpdateMethod) == null) {
          CredentialTemplatesGrpc.getUpdateMethod =
              getUpdateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .UpdateCredentialTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .UpdateCredentialTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Update"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .UpdateCredentialTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .UpdateCredentialTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier("Update"))
                      .build();
        }
      }
    }
    return getUpdateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
      getListMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "List",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
      getListMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest,
            trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
        getListMethod;
    if ((getListMethod = CredentialTemplatesGrpc.getListMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getListMethod = CredentialTemplatesGrpc.getListMethod) == null) {
          CredentialTemplatesGrpc.getListMethod =
              getListMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .ListCredentialTemplatesRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .ListCredentialTemplatesResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "List"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .ListCredentialTemplatesRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .ListCredentialTemplatesResponse.getDefaultInstance()))
                      .setSchemaDescriptor(new CredentialTemplatesMethodDescriptorSupplier("List"))
                      .build();
        }
      }
    }
    return getListMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse>
      getSearchMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Search",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest
              .class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse>
      getSearchMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest,
            trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse>
        getSearchMethod;
    if ((getSearchMethod = CredentialTemplatesGrpc.getSearchMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getSearchMethod = CredentialTemplatesGrpc.getSearchMethod) == null) {
          CredentialTemplatesGrpc.getSearchMethod =
              getSearchMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .SearchCredentialTemplatesRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .SearchCredentialTemplatesResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Search"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .SearchCredentialTemplatesRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .SearchCredentialTemplatesResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier("Search"))
                      .build();
        }
      }
    }
    return getSearchMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse>
      getDeleteMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "Delete",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse>
      getDeleteMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse>
        getDeleteMethod;
    if ((getDeleteMethod = CredentialTemplatesGrpc.getDeleteMethod) == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getDeleteMethod = CredentialTemplatesGrpc.getDeleteMethod) == null) {
          CredentialTemplatesGrpc.getDeleteMethod =
              getDeleteMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .DeleteCredentialTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .DeleteCredentialTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(generateFullMethodName(SERVICE_NAME, "Delete"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .DeleteCredentialTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .DeleteCredentialTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier("Delete"))
                      .build();
        }
      }
    }
    return getDeleteMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse>
      getCreateVerificationTemplateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "CreateVerificationTemplate",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest
              .class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse>
      getCreateVerificationTemplateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse>
        getCreateVerificationTemplateMethod;
    if ((getCreateVerificationTemplateMethod =
            CredentialTemplatesGrpc.getCreateVerificationTemplateMethod)
        == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getCreateVerificationTemplateMethod =
                CredentialTemplatesGrpc.getCreateVerificationTemplateMethod)
            == null) {
          CredentialTemplatesGrpc.getCreateVerificationTemplateMethod =
              getCreateVerificationTemplateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .CreateVerificationTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .CreateVerificationTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "CreateVerificationTemplate"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .CreateVerificationTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .CreateVerificationTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier(
                              "CreateVerificationTemplate"))
                      .build();
        }
      }
    }
    return getCreateVerificationTemplateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse>
      getListVerificationTemplatesMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "ListVerificationTemplates",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest
              .class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest,
          trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse>
      getListVerificationTemplatesMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest,
            trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse>
        getListVerificationTemplatesMethod;
    if ((getListVerificationTemplatesMethod =
            CredentialTemplatesGrpc.getListVerificationTemplatesMethod)
        == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getListVerificationTemplatesMethod =
                CredentialTemplatesGrpc.getListVerificationTemplatesMethod)
            == null) {
          CredentialTemplatesGrpc.getListVerificationTemplatesMethod =
              getListVerificationTemplatesMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .ListVerificationTemplatesRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .ListVerificationTemplatesResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "ListVerificationTemplates"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .ListVerificationTemplatesRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .ListVerificationTemplatesResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier(
                              "ListVerificationTemplates"))
                      .build();
        }
      }
    }
    return getListVerificationTemplatesMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
      getGetVerificationTemplateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetVerificationTemplate",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest.class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
      getGetVerificationTemplateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
        getGetVerificationTemplateMethod;
    if ((getGetVerificationTemplateMethod =
            CredentialTemplatesGrpc.getGetVerificationTemplateMethod)
        == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getGetVerificationTemplateMethod =
                CredentialTemplatesGrpc.getGetVerificationTemplateMethod)
            == null) {
          CredentialTemplatesGrpc.getGetVerificationTemplateMethod =
              getGetVerificationTemplateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .GetVerificationTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .GetVerificationTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "GetVerificationTemplate"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .GetVerificationTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .GetVerificationTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier(
                              "GetVerificationTemplate"))
                      .build();
        }
      }
    }
    return getGetVerificationTemplateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse>
      getUpdateVerificationTemplateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "UpdateVerificationTemplate",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest
              .class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse>
      getUpdateVerificationTemplateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse>
        getUpdateVerificationTemplateMethod;
    if ((getUpdateVerificationTemplateMethod =
            CredentialTemplatesGrpc.getUpdateVerificationTemplateMethod)
        == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getUpdateVerificationTemplateMethod =
                CredentialTemplatesGrpc.getUpdateVerificationTemplateMethod)
            == null) {
          CredentialTemplatesGrpc.getUpdateVerificationTemplateMethod =
              getUpdateVerificationTemplateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .UpdateVerificationTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .UpdateVerificationTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "UpdateVerificationTemplate"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .UpdateVerificationTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .UpdateVerificationTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier(
                              "UpdateVerificationTemplate"))
                      .build();
        }
      }
    }
    return getUpdateVerificationTemplateMethod;
  }

  private static volatile io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse>
      getDeleteVerificationTemplateMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "DeleteVerificationTemplate",
      requestType =
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest
              .class,
      responseType =
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse
              .class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest,
          trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse>
      getDeleteVerificationTemplateMethod() {
    io.grpc.MethodDescriptor<
            trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest,
            trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse>
        getDeleteVerificationTemplateMethod;
    if ((getDeleteVerificationTemplateMethod =
            CredentialTemplatesGrpc.getDeleteVerificationTemplateMethod)
        == null) {
      synchronized (CredentialTemplatesGrpc.class) {
        if ((getDeleteVerificationTemplateMethod =
                CredentialTemplatesGrpc.getDeleteVerificationTemplateMethod)
            == null) {
          CredentialTemplatesGrpc.getDeleteVerificationTemplateMethod =
              getDeleteVerificationTemplateMethod =
                  io.grpc.MethodDescriptor
                      .<trinsic.services.verifiablecredentials.templates.v1
                              .DeleteVerificationTemplateRequest,
                          trinsic.services.verifiablecredentials.templates.v1
                              .DeleteVerificationTemplateResponse>
                          newBuilder()
                      .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
                      .setFullMethodName(
                          generateFullMethodName(SERVICE_NAME, "DeleteVerificationTemplate"))
                      .setSampledToLocalTracing(true)
                      .setRequestMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .DeleteVerificationTemplateRequest.getDefaultInstance()))
                      .setResponseMarshaller(
                          io.grpc.protobuf.ProtoUtils.marshaller(
                              trinsic.services.verifiablecredentials.templates.v1
                                  .DeleteVerificationTemplateResponse.getDefaultInstance()))
                      .setSchemaDescriptor(
                          new CredentialTemplatesMethodDescriptorSupplier(
                              "DeleteVerificationTemplate"))
                      .build();
        }
      }
    }
    return getDeleteVerificationTemplateMethod;
  }

  /** Creates a new async stub that supports all call types for the service */
  public static CredentialTemplatesStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesStub>() {
          @java.lang.Override
          public CredentialTemplatesStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new CredentialTemplatesStub(channel, callOptions);
          }
        };
    return CredentialTemplatesStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static CredentialTemplatesBlockingStub newBlockingStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesBlockingStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesBlockingStub>() {
          @java.lang.Override
          public CredentialTemplatesBlockingStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new CredentialTemplatesBlockingStub(channel, callOptions);
          }
        };
    return CredentialTemplatesBlockingStub.newStub(factory, channel);
  }

  /** Creates a new ListenableFuture-style stub that supports unary calls on the service */
  public static CredentialTemplatesFutureStub newFutureStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesFutureStub> factory =
        new io.grpc.stub.AbstractStub.StubFactory<CredentialTemplatesFutureStub>() {
          @java.lang.Override
          public CredentialTemplatesFutureStub newStub(
              io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
            return new CredentialTemplatesFutureStub(channel, callOptions);
          }
        };
    return CredentialTemplatesFutureStub.newStub(factory, channel);
  }

  /** */
  public abstract static class CredentialTemplatesImplBase implements io.grpc.BindableService {

    /**
     *
     *
     * <pre>
     * Create a credential template in the current ecosystem
     * </pre>
     */
    public void create(
        trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .CreateCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getCreateMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Fetch a credential template by ID
     * </pre>
     */
    public void get(
        trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Update metadata of a template
     * </pre>
     */
    public void update(
        trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .UpdateCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getUpdateMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning strongly-typed template data
     * </pre>
     */
    public void list(
        trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getListMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning raw JSON data
     * </pre>
     */
    public void search(
        trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .SearchCredentialTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getSearchMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Delete a credential template from the current ecosystem by ID
     * </pre>
     */
    public void delete(
        trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .DeleteCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getDeleteMethod(), responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create/update verification templates
     * </pre>
     */
    public void createVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .CreateVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getCreateVerificationTemplateMethod(), responseObserver);
    }

    /** */
    public void listVerificationTemplates(
        trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .ListVerificationTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getListVerificationTemplatesMethod(), responseObserver);
    }

    /** */
    public void getVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getGetVerificationTemplateMethod(), responseObserver);
    }

    /** */
    public void updateVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .UpdateVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getUpdateVerificationTemplateMethod(), responseObserver);
    }

    /** */
    public void deleteVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .DeleteVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(
          getDeleteVerificationTemplateMethod(), responseObserver);
    }

    @java.lang.Override
    public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
              getCreateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateCredentialTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateCredentialTemplateResponse>(this, METHODID_CREATE)))
          .addMethod(
              getGetMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetCredentialTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetCredentialTemplateResponse>(this, METHODID_GET)))
          .addMethod(
              getUpdateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateCredentialTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateCredentialTemplateResponse>(this, METHODID_UPDATE)))
          .addMethod(
              getListMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListCredentialTemplatesRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListCredentialTemplatesResponse>(this, METHODID_LIST)))
          .addMethod(
              getSearchMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .SearchCredentialTemplatesRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .SearchCredentialTemplatesResponse>(this, METHODID_SEARCH)))
          .addMethod(
              getDeleteMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteCredentialTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteCredentialTemplateResponse>(this, METHODID_DELETE)))
          .addMethod(
              getCreateVerificationTemplateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateVerificationTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateVerificationTemplateResponse>(
                      this, METHODID_CREATE_VERIFICATION_TEMPLATE)))
          .addMethod(
              getListVerificationTemplatesMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListVerificationTemplatesRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListVerificationTemplatesResponse>(
                      this, METHODID_LIST_VERIFICATION_TEMPLATES)))
          .addMethod(
              getGetVerificationTemplateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetVerificationTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetVerificationTemplateResponse>(
                      this, METHODID_GET_VERIFICATION_TEMPLATE)))
          .addMethod(
              getUpdateVerificationTemplateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateVerificationTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateVerificationTemplateResponse>(
                      this, METHODID_UPDATE_VERIFICATION_TEMPLATE)))
          .addMethod(
              getDeleteVerificationTemplateMethod(),
              io.grpc.stub.ServerCalls.asyncUnaryCall(
                  new MethodHandlers<
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteVerificationTemplateRequest,
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteVerificationTemplateResponse>(
                      this, METHODID_DELETE_VERIFICATION_TEMPLATE)))
          .build();
    }
  }

  /** */
  public static final class CredentialTemplatesStub
      extends io.grpc.stub.AbstractAsyncStub<CredentialTemplatesStub> {
    private CredentialTemplatesStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CredentialTemplatesStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new CredentialTemplatesStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create a credential template in the current ecosystem
     * </pre>
     */
    public void create(
        trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .CreateCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Fetch a credential template by ID
     * </pre>
     */
    public void get(
        trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Update metadata of a template
     * </pre>
     */
    public void update(
        trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .UpdateCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning strongly-typed template data
     * </pre>
     */
    public void list(
        trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning raw JSON data
     * </pre>
     */
    public void search(
        trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .SearchCredentialTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getSearchMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Delete a credential template from the current ecosystem by ID
     * </pre>
     */
    public void delete(
        trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .DeleteCredentialTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     *
     *
     * <pre>
     * Create/update verification templates
     * </pre>
     */
    public void createVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .CreateVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getCreateVerificationTemplateMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /** */
    public void listVerificationTemplates(
        trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .ListVerificationTemplatesResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getListVerificationTemplatesMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /** */
    public void getVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetVerificationTemplateMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /** */
    public void updateVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .UpdateVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getUpdateVerificationTemplateMethod(), getCallOptions()),
          request,
          responseObserver);
    }

    /** */
    public void deleteVerificationTemplate(
        trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest
            request,
        io.grpc.stub.StreamObserver<
                trinsic.services.verifiablecredentials.templates.v1
                    .DeleteVerificationTemplateResponse>
            responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getDeleteVerificationTemplateMethod(), getCallOptions()),
          request,
          responseObserver);
    }
  }

  /** */
  public static final class CredentialTemplatesBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<CredentialTemplatesBlockingStub> {
    private CredentialTemplatesBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CredentialTemplatesBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new CredentialTemplatesBlockingStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create a credential template in the current ecosystem
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse
        create(
            trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Fetch a credential template by ID
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse get(
        trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Update metadata of a template
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse
        update(
            trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning strongly-typed template data
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse list(
        trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest
            request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning raw JSON data
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse
        search(
            trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getSearchMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Delete a credential template from the current ecosystem by ID
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse
        delete(
            trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteMethod(), getCallOptions(), request);
    }

    /**
     *
     *
     * <pre>
     * Create/update verification templates
     * </pre>
     */
    public trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse
        createVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getCreateVerificationTemplateMethod(), getCallOptions(), request);
    }

    /** */
    public trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse
        listVerificationTemplates(
            trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getListVerificationTemplatesMethod(), getCallOptions(), request);
    }

    /** */
    public trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse
        getVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetVerificationTemplateMethod(), getCallOptions(), request);
    }

    /** */
    public trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse
        updateVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getUpdateVerificationTemplateMethod(), getCallOptions(), request);
    }

    /** */
    public trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse
        deleteVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getDeleteVerificationTemplateMethod(), getCallOptions(), request);
    }
  }

  /** */
  public static final class CredentialTemplatesFutureStub
      extends io.grpc.stub.AbstractFutureStub<CredentialTemplatesFutureStub> {
    private CredentialTemplatesFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CredentialTemplatesFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new CredentialTemplatesFutureStub(channel, callOptions);
    }

    /**
     *
     *
     * <pre>
     * Create a credential template in the current ecosystem
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateResponse>
        create(
            trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Fetch a credential template by ID
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateResponse>
        get(
            trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Update metadata of a template
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateResponse>
        update(
            trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning strongly-typed template data
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesResponse>
        list(
            trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Search credential templates using SQL, returning raw JSON data
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesResponse>
        search(
            trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getSearchMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Delete a credential template from the current ecosystem by ID
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateResponse>
        delete(
            trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteMethod(), getCallOptions()), request);
    }

    /**
     *
     *
     * <pre>
     * Create/update verification templates
     * </pre>
     */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateResponse>
        createVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.CreateVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getCreateVerificationTemplateMethod(), getCallOptions()), request);
    }

    /** */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesResponse>
        listVerificationTemplates(
            trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getListVerificationTemplatesMethod(), getCallOptions()), request);
    }

    /** */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateResponse>
        getVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetVerificationTemplateMethod(), getCallOptions()), request);
    }

    /** */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateResponse>
        updateVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.UpdateVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getUpdateVerificationTemplateMethod(), getCallOptions()), request);
    }

    /** */
    public com.google.common.util.concurrent.ListenableFuture<
            trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateResponse>
        deleteVerificationTemplate(
            trinsic.services.verifiablecredentials.templates.v1.DeleteVerificationTemplateRequest
                request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getDeleteVerificationTemplateMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_CREATE = 0;
  private static final int METHODID_GET = 1;
  private static final int METHODID_UPDATE = 2;
  private static final int METHODID_LIST = 3;
  private static final int METHODID_SEARCH = 4;
  private static final int METHODID_DELETE = 5;
  private static final int METHODID_CREATE_VERIFICATION_TEMPLATE = 6;
  private static final int METHODID_LIST_VERIFICATION_TEMPLATES = 7;
  private static final int METHODID_GET_VERIFICATION_TEMPLATE = 8;
  private static final int METHODID_UPDATE_VERIFICATION_TEMPLATE = 9;
  private static final int METHODID_DELETE_VERIFICATION_TEMPLATE = 10;

  private static final class MethodHandlers<Req, Resp>
      implements io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
          io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final CredentialTemplatesImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(CredentialTemplatesImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_CREATE:
          serviceImpl.create(
              (trinsic.services.verifiablecredentials.templates.v1.CreateCredentialTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateCredentialTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_GET:
          serviceImpl.get(
              (trinsic.services.verifiablecredentials.templates.v1.GetCredentialTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetCredentialTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_UPDATE:
          serviceImpl.update(
              (trinsic.services.verifiablecredentials.templates.v1.UpdateCredentialTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateCredentialTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_LIST:
          serviceImpl.list(
              (trinsic.services.verifiablecredentials.templates.v1.ListCredentialTemplatesRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListCredentialTemplatesResponse>)
                  responseObserver);
          break;
        case METHODID_SEARCH:
          serviceImpl.search(
              (trinsic.services.verifiablecredentials.templates.v1.SearchCredentialTemplatesRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .SearchCredentialTemplatesResponse>)
                  responseObserver);
          break;
        case METHODID_DELETE:
          serviceImpl.delete(
              (trinsic.services.verifiablecredentials.templates.v1.DeleteCredentialTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteCredentialTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_CREATE_VERIFICATION_TEMPLATE:
          serviceImpl.createVerificationTemplate(
              (trinsic.services.verifiablecredentials.templates.v1
                      .CreateVerificationTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .CreateVerificationTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_LIST_VERIFICATION_TEMPLATES:
          serviceImpl.listVerificationTemplates(
              (trinsic.services.verifiablecredentials.templates.v1.ListVerificationTemplatesRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .ListVerificationTemplatesResponse>)
                  responseObserver);
          break;
        case METHODID_GET_VERIFICATION_TEMPLATE:
          serviceImpl.getVerificationTemplate(
              (trinsic.services.verifiablecredentials.templates.v1.GetVerificationTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .GetVerificationTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_UPDATE_VERIFICATION_TEMPLATE:
          serviceImpl.updateVerificationTemplate(
              (trinsic.services.verifiablecredentials.templates.v1
                      .UpdateVerificationTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .UpdateVerificationTemplateResponse>)
                  responseObserver);
          break;
        case METHODID_DELETE_VERIFICATION_TEMPLATE:
          serviceImpl.deleteVerificationTemplate(
              (trinsic.services.verifiablecredentials.templates.v1
                      .DeleteVerificationTemplateRequest)
                  request,
              (io.grpc.stub.StreamObserver<
                      trinsic.services.verifiablecredentials.templates.v1
                          .DeleteVerificationTemplateResponse>)
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

  private abstract static class CredentialTemplatesBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier,
          io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    CredentialTemplatesBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return trinsic.services.verifiablecredentials.templates.v1.Templates.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("CredentialTemplates");
    }
  }

  private static final class CredentialTemplatesFileDescriptorSupplier
      extends CredentialTemplatesBaseDescriptorSupplier {
    CredentialTemplatesFileDescriptorSupplier() {}
  }

  private static final class CredentialTemplatesMethodDescriptorSupplier
      extends CredentialTemplatesBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    CredentialTemplatesMethodDescriptorSupplier(String methodName) {
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
      synchronized (CredentialTemplatesGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor =
              result =
                  io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
                      .setSchemaDescriptor(new CredentialTemplatesFileDescriptorSupplier())
                      .addMethod(getCreateMethod())
                      .addMethod(getGetMethod())
                      .addMethod(getUpdateMethod())
                      .addMethod(getListMethod())
                      .addMethod(getSearchMethod())
                      .addMethod(getDeleteMethod())
                      .addMethod(getCreateVerificationTemplateMethod())
                      .addMethod(getListVerificationTemplatesMethod())
                      .addMethod(getGetVerificationTemplateMethod())
                      .addMethod(getUpdateVerificationTemplateMethod())
                      .addMethod(getDeleteVerificationTemplateMethod())
                      .build();
        }
      }
    }
    return result;
  }
}
