// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v3.20.3
// source: services/trust-registry/v1/trust-registry.proto

package trustregistry

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	TrustRegistry_RegisterMember_FullMethodName               = "/services.trustregistry.v1.TrustRegistry/RegisterMember"
	TrustRegistry_UnregisterMember_FullMethodName             = "/services.trustregistry.v1.TrustRegistry/UnregisterMember"
	TrustRegistry_GetMemberAuthorizationStatus_FullMethodName = "/services.trustregistry.v1.TrustRegistry/GetMemberAuthorizationStatus"
	TrustRegistry_ListAuthorizedMembers_FullMethodName        = "/services.trustregistry.v1.TrustRegistry/ListAuthorizedMembers"
	TrustRegistry_GetMember_FullMethodName                    = "/services.trustregistry.v1.TrustRegistry/GetMember"
)

// TrustRegistryClient is the client API for TrustRegistry service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type TrustRegistryClient interface {
	// Register an authoritative issuer for a credential schema
	RegisterMember(ctx context.Context, in *RegisterMemberRequest, opts ...grpc.CallOption) (*RegisterMemberResponse, error)
	// Removes an authoritative issuer for a credential schema from the trust registry
	UnregisterMember(ctx context.Context, in *UnregisterMemberRequest, opts ...grpc.CallOption) (*UnregisterMemberResponse, error)
	// Fetch the status of a member for a given credential schema in a trust registry
	GetMemberAuthorizationStatus(ctx context.Context, in *GetMemberAuthorizationStatusRequest, opts ...grpc.CallOption) (*GetMemberAuthorizationStatusResponse, error)
	// Fetch the ecosystem's authorized issuers and the respective templates against which it can issue
	ListAuthorizedMembers(ctx context.Context, in *ListAuthorizedMembersRequest, opts ...grpc.CallOption) (*ListAuthorizedMembersResponse, error)
	// Get member for a given did in a trust registry
	GetMember(ctx context.Context, in *GetMemberRequest, opts ...grpc.CallOption) (*GetMemberResponse, error)
}

type trustRegistryClient struct {
	cc grpc.ClientConnInterface
}

func NewTrustRegistryClient(cc grpc.ClientConnInterface) TrustRegistryClient {
	return &trustRegistryClient{cc}
}

func (c *trustRegistryClient) RegisterMember(ctx context.Context, in *RegisterMemberRequest, opts ...grpc.CallOption) (*RegisterMemberResponse, error) {
	out := new(RegisterMemberResponse)
	err := c.cc.Invoke(ctx, TrustRegistry_RegisterMember_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *trustRegistryClient) UnregisterMember(ctx context.Context, in *UnregisterMemberRequest, opts ...grpc.CallOption) (*UnregisterMemberResponse, error) {
	out := new(UnregisterMemberResponse)
	err := c.cc.Invoke(ctx, TrustRegistry_UnregisterMember_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *trustRegistryClient) GetMemberAuthorizationStatus(ctx context.Context, in *GetMemberAuthorizationStatusRequest, opts ...grpc.CallOption) (*GetMemberAuthorizationStatusResponse, error) {
	out := new(GetMemberAuthorizationStatusResponse)
	err := c.cc.Invoke(ctx, TrustRegistry_GetMemberAuthorizationStatus_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *trustRegistryClient) ListAuthorizedMembers(ctx context.Context, in *ListAuthorizedMembersRequest, opts ...grpc.CallOption) (*ListAuthorizedMembersResponse, error) {
	out := new(ListAuthorizedMembersResponse)
	err := c.cc.Invoke(ctx, TrustRegistry_ListAuthorizedMembers_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *trustRegistryClient) GetMember(ctx context.Context, in *GetMemberRequest, opts ...grpc.CallOption) (*GetMemberResponse, error) {
	out := new(GetMemberResponse)
	err := c.cc.Invoke(ctx, TrustRegistry_GetMember_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// TrustRegistryServer is the server API for TrustRegistry service.
// All implementations must embed UnimplementedTrustRegistryServer
// for forward compatibility
type TrustRegistryServer interface {
	// Register an authoritative issuer for a credential schema
	RegisterMember(context.Context, *RegisterMemberRequest) (*RegisterMemberResponse, error)
	// Removes an authoritative issuer for a credential schema from the trust registry
	UnregisterMember(context.Context, *UnregisterMemberRequest) (*UnregisterMemberResponse, error)
	// Fetch the status of a member for a given credential schema in a trust registry
	GetMemberAuthorizationStatus(context.Context, *GetMemberAuthorizationStatusRequest) (*GetMemberAuthorizationStatusResponse, error)
	// Fetch the ecosystem's authorized issuers and the respective templates against which it can issue
	ListAuthorizedMembers(context.Context, *ListAuthorizedMembersRequest) (*ListAuthorizedMembersResponse, error)
	// Get member for a given did in a trust registry
	GetMember(context.Context, *GetMemberRequest) (*GetMemberResponse, error)
	mustEmbedUnimplementedTrustRegistryServer()
}

// UnimplementedTrustRegistryServer must be embedded to have forward compatible implementations.
type UnimplementedTrustRegistryServer struct {
}

func (UnimplementedTrustRegistryServer) RegisterMember(context.Context, *RegisterMemberRequest) (*RegisterMemberResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RegisterMember not implemented")
}
func (UnimplementedTrustRegistryServer) UnregisterMember(context.Context, *UnregisterMemberRequest) (*UnregisterMemberResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UnregisterMember not implemented")
}
func (UnimplementedTrustRegistryServer) GetMemberAuthorizationStatus(context.Context, *GetMemberAuthorizationStatusRequest) (*GetMemberAuthorizationStatusResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMemberAuthorizationStatus not implemented")
}
func (UnimplementedTrustRegistryServer) ListAuthorizedMembers(context.Context, *ListAuthorizedMembersRequest) (*ListAuthorizedMembersResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ListAuthorizedMembers not implemented")
}
func (UnimplementedTrustRegistryServer) GetMember(context.Context, *GetMemberRequest) (*GetMemberResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetMember not implemented")
}
func (UnimplementedTrustRegistryServer) mustEmbedUnimplementedTrustRegistryServer() {}

// UnsafeTrustRegistryServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to TrustRegistryServer will
// result in compilation errors.
type UnsafeTrustRegistryServer interface {
	mustEmbedUnimplementedTrustRegistryServer()
}

func RegisterTrustRegistryServer(s grpc.ServiceRegistrar, srv TrustRegistryServer) {
	s.RegisterService(&TrustRegistry_ServiceDesc, srv)
}

func _TrustRegistry_RegisterMember_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RegisterMemberRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustRegistryServer).RegisterMember(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: TrustRegistry_RegisterMember_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustRegistryServer).RegisterMember(ctx, req.(*RegisterMemberRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TrustRegistry_UnregisterMember_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UnregisterMemberRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustRegistryServer).UnregisterMember(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: TrustRegistry_UnregisterMember_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustRegistryServer).UnregisterMember(ctx, req.(*UnregisterMemberRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TrustRegistry_GetMemberAuthorizationStatus_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMemberAuthorizationStatusRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustRegistryServer).GetMemberAuthorizationStatus(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: TrustRegistry_GetMemberAuthorizationStatus_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustRegistryServer).GetMemberAuthorizationStatus(ctx, req.(*GetMemberAuthorizationStatusRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TrustRegistry_ListAuthorizedMembers_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ListAuthorizedMembersRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustRegistryServer).ListAuthorizedMembers(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: TrustRegistry_ListAuthorizedMembers_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustRegistryServer).ListAuthorizedMembers(ctx, req.(*ListAuthorizedMembersRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TrustRegistry_GetMember_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetMemberRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TrustRegistryServer).GetMember(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: TrustRegistry_GetMember_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TrustRegistryServer).GetMember(ctx, req.(*GetMemberRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// TrustRegistry_ServiceDesc is the grpc.ServiceDesc for TrustRegistry service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var TrustRegistry_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "services.trustregistry.v1.TrustRegistry",
	HandlerType: (*TrustRegistryServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "RegisterMember",
			Handler:    _TrustRegistry_RegisterMember_Handler,
		},
		{
			MethodName: "UnregisterMember",
			Handler:    _TrustRegistry_UnregisterMember_Handler,
		},
		{
			MethodName: "GetMemberAuthorizationStatus",
			Handler:    _TrustRegistry_GetMemberAuthorizationStatus_Handler,
		},
		{
			MethodName: "ListAuthorizedMembers",
			Handler:    _TrustRegistry_ListAuthorizedMembers_Handler,
		},
		{
			MethodName: "GetMember",
			Handler:    _TrustRegistry_GetMember_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "services/trust-registry/v1/trust-registry.proto",
}
