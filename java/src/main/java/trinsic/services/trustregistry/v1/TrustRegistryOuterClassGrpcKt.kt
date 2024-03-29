package trinsic.services.trustregistry.v1

import io.grpc.CallOptions
import io.grpc.CallOptions.DEFAULT
import io.grpc.Channel
import io.grpc.Metadata
import io.grpc.MethodDescriptor
import io.grpc.ServerServiceDefinition
import io.grpc.ServerServiceDefinition.builder
import io.grpc.ServiceDescriptor
import io.grpc.Status
import io.grpc.Status.UNIMPLEMENTED
import io.grpc.StatusException
import io.grpc.kotlin.AbstractCoroutineServerImpl
import io.grpc.kotlin.AbstractCoroutineStub
import io.grpc.kotlin.ClientCalls.unaryRpc
import io.grpc.kotlin.ServerCalls.unaryServerMethodDefinition
import io.grpc.kotlin.StubFor
import kotlin.String
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.jvm.JvmOverloads
import kotlin.jvm.JvmStatic
import trinsic.services.trustregistry.v1.TrustRegistryGrpc.getServiceDescriptor

/**
 * Holder for Kotlin coroutine-based client and server APIs for
 * services.trustregistry.v1.TrustRegistry.
 */
object TrustRegistryGrpcKt {
  const val SERVICE_NAME: String = TrustRegistryGrpc.SERVICE_NAME

  @JvmStatic
  val serviceDescriptor: ServiceDescriptor
    get() = TrustRegistryGrpc.getServiceDescriptor()

  val registerMemberMethod: MethodDescriptor<RegisterMemberRequest, RegisterMemberResponse>
    @JvmStatic get() = TrustRegistryGrpc.getRegisterMemberMethod()

  val unregisterMemberMethod: MethodDescriptor<UnregisterMemberRequest, UnregisterMemberResponse>
    @JvmStatic get() = TrustRegistryGrpc.getUnregisterMemberMethod()

  val getMemberAuthorizationStatusMethod:
      MethodDescriptor<GetMemberAuthorizationStatusRequest, GetMemberAuthorizationStatusResponse>
    @JvmStatic get() = TrustRegistryGrpc.getGetMemberAuthorizationStatusMethod()

  val listAuthorizedMembersMethod:
      MethodDescriptor<ListAuthorizedMembersRequest, ListAuthorizedMembersResponse>
    @JvmStatic get() = TrustRegistryGrpc.getListAuthorizedMembersMethod()

  val getMemberMethod: MethodDescriptor<GetMemberRequest, GetMemberResponse>
    @JvmStatic get() = TrustRegistryGrpc.getGetMemberMethod()

  /**
   * A stub for issuing RPCs to a(n) services.trustregistry.v1.TrustRegistry service as suspending
   * coroutines.
   */
  @StubFor(TrustRegistryGrpc::class)
  class TrustRegistryCoroutineStub
  @JvmOverloads
  constructor(channel: Channel, callOptions: CallOptions = DEFAULT) :
      AbstractCoroutineStub<TrustRegistryCoroutineStub>(channel, callOptions) {
    override fun build(channel: Channel, callOptions: CallOptions): TrustRegistryCoroutineStub =
        TrustRegistryCoroutineStub(channel, callOptions)

    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes with
     * [`Status.OK`][Status]. If the RPC completes with another status, a corresponding
     * [StatusException] is thrown. If this coroutine is cancelled, the RPC is also cancelled with
     * the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request. Most users will not need this.
     *
     * @return The single response from the server.
     */
    suspend fun registerMember(
        request: RegisterMemberRequest,
        headers: Metadata = Metadata()
    ): RegisterMemberResponse =
        unaryRpc(
            channel, TrustRegistryGrpc.getRegisterMemberMethod(), request, callOptions, headers)
    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes with
     * [`Status.OK`][Status]. If the RPC completes with another status, a corresponding
     * [StatusException] is thrown. If this coroutine is cancelled, the RPC is also cancelled with
     * the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request. Most users will not need this.
     *
     * @return The single response from the server.
     */
    suspend fun unregisterMember(
        request: UnregisterMemberRequest,
        headers: Metadata = Metadata()
    ): UnregisterMemberResponse =
        unaryRpc(
            channel, TrustRegistryGrpc.getUnregisterMemberMethod(), request, callOptions, headers)
    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes with
     * [`Status.OK`][Status]. If the RPC completes with another status, a corresponding
     * [StatusException] is thrown. If this coroutine is cancelled, the RPC is also cancelled with
     * the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request. Most users will not need this.
     *
     * @return The single response from the server.
     */
    suspend fun getMemberAuthorizationStatus(
        request: GetMemberAuthorizationStatusRequest,
        headers: Metadata = Metadata()
    ): GetMemberAuthorizationStatusResponse =
        unaryRpc(
            channel,
            TrustRegistryGrpc.getGetMemberAuthorizationStatusMethod(),
            request,
            callOptions,
            headers)
    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes with
     * [`Status.OK`][Status]. If the RPC completes with another status, a corresponding
     * [StatusException] is thrown. If this coroutine is cancelled, the RPC is also cancelled with
     * the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request. Most users will not need this.
     *
     * @return The single response from the server.
     */
    suspend fun listAuthorizedMembers(
        request: ListAuthorizedMembersRequest,
        headers: Metadata = Metadata()
    ): ListAuthorizedMembersResponse =
        unaryRpc(
            channel,
            TrustRegistryGrpc.getListAuthorizedMembersMethod(),
            request,
            callOptions,
            headers)
    /**
     * Executes this RPC and returns the response message, suspending until the RPC completes with
     * [`Status.OK`][Status]. If the RPC completes with another status, a corresponding
     * [StatusException] is thrown. If this coroutine is cancelled, the RPC is also cancelled with
     * the corresponding exception as a cause.
     *
     * @param request The request message to send to the server.
     *
     * @param headers Metadata to attach to the request. Most users will not need this.
     *
     * @return The single response from the server.
     */
    suspend fun getMember(
        request: GetMemberRequest,
        headers: Metadata = Metadata()
    ): GetMemberResponse =
        unaryRpc(channel, TrustRegistryGrpc.getGetMemberMethod(), request, callOptions, headers)
  }

  /**
   * Skeletal implementation of the services.trustregistry.v1.TrustRegistry service based on Kotlin
   * coroutines.
   */
  abstract class TrustRegistryCoroutineImplBase(
      coroutineContext: CoroutineContext = EmptyCoroutineContext
  ) : AbstractCoroutineServerImpl(coroutineContext) {
    /**
     * Returns the response to an RPC for services.trustregistry.v1.TrustRegistry.RegisterMember.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [Status]. If this method fails with a [java.util.concurrent.CancellationException], the RPC
     * will fail with status `Status.CANCELLED`. If this method fails for any other reason, the RPC
     * will fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    open suspend fun registerMember(request: RegisterMemberRequest): RegisterMemberResponse =
        throw StatusException(
            UNIMPLEMENTED.withDescription(
                "Method services.trustregistry.v1.TrustRegistry.RegisterMember is unimplemented"))

    /**
     * Returns the response to an RPC for services.trustregistry.v1.TrustRegistry.UnregisterMember.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [Status]. If this method fails with a [java.util.concurrent.CancellationException], the RPC
     * will fail with status `Status.CANCELLED`. If this method fails for any other reason, the RPC
     * will fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    open suspend fun unregisterMember(request: UnregisterMemberRequest): UnregisterMemberResponse =
        throw StatusException(
            UNIMPLEMENTED.withDescription(
                "Method services.trustregistry.v1.TrustRegistry.UnregisterMember is unimplemented"))

    /**
     * Returns the response to an RPC for
     * services.trustregistry.v1.TrustRegistry.GetMemberAuthorizationStatus.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [Status]. If this method fails with a [java.util.concurrent.CancellationException], the RPC
     * will fail with status `Status.CANCELLED`. If this method fails for any other reason, the RPC
     * will fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    open suspend fun getMemberAuthorizationStatus(
        request: GetMemberAuthorizationStatusRequest
    ): GetMemberAuthorizationStatusResponse =
        throw StatusException(
            UNIMPLEMENTED.withDescription(
                "Method services.trustregistry.v1.TrustRegistry.GetMemberAuthorizationStatus is unimplemented"))

    /**
     * Returns the response to an RPC for
     * services.trustregistry.v1.TrustRegistry.ListAuthorizedMembers.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [Status]. If this method fails with a [java.util.concurrent.CancellationException], the RPC
     * will fail with status `Status.CANCELLED`. If this method fails for any other reason, the RPC
     * will fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    open suspend fun listAuthorizedMembers(
        request: ListAuthorizedMembersRequest
    ): ListAuthorizedMembersResponse =
        throw StatusException(
            UNIMPLEMENTED.withDescription(
                "Method services.trustregistry.v1.TrustRegistry.ListAuthorizedMembers is unimplemented"))

    /**
     * Returns the response to an RPC for services.trustregistry.v1.TrustRegistry.GetMember.
     *
     * If this method fails with a [StatusException], the RPC will fail with the corresponding
     * [Status]. If this method fails with a [java.util.concurrent.CancellationException], the RPC
     * will fail with status `Status.CANCELLED`. If this method fails for any other reason, the RPC
     * will fail with `Status.UNKNOWN` with the exception as a cause.
     *
     * @param request The request from the client.
     */
    open suspend fun getMember(request: GetMemberRequest): GetMemberResponse =
        throw StatusException(
            UNIMPLEMENTED.withDescription(
                "Method services.trustregistry.v1.TrustRegistry.GetMember is unimplemented"))

    final override fun bindService(): ServerServiceDefinition =
        builder(getServiceDescriptor())
            .addMethod(
                unaryServerMethodDefinition(
                    context = this.context,
                    descriptor = TrustRegistryGrpc.getRegisterMemberMethod(),
                    implementation = ::registerMember))
            .addMethod(
                unaryServerMethodDefinition(
                    context = this.context,
                    descriptor = TrustRegistryGrpc.getUnregisterMemberMethod(),
                    implementation = ::unregisterMember))
            .addMethod(
                unaryServerMethodDefinition(
                    context = this.context,
                    descriptor = TrustRegistryGrpc.getGetMemberAuthorizationStatusMethod(),
                    implementation = ::getMemberAuthorizationStatus))
            .addMethod(
                unaryServerMethodDefinition(
                    context = this.context,
                    descriptor = TrustRegistryGrpc.getListAuthorizedMembersMethod(),
                    implementation = ::listAuthorizedMembers))
            .addMethod(
                unaryServerMethodDefinition(
                    context = this.context,
                    descriptor = TrustRegistryGrpc.getGetMemberMethod(),
                    implementation = ::getMember))
            .build()
  }
}
