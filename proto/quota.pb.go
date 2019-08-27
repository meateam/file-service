// Code generated by protoc-gen-go. DO NOT EDIT.
// source: quota.proto

package quota

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type IsAllowedToGetQuotaRequest struct {
	RequestingUser       string   `protobuf:"bytes,1,opt,name=requestingUser,proto3" json:"requestingUser,omitempty"`
	OwnerID              string   `protobuf:"bytes,2,opt,name=ownerID,proto3" json:"ownerID,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *IsAllowedToGetQuotaRequest) Reset()         { *m = IsAllowedToGetQuotaRequest{} }
func (m *IsAllowedToGetQuotaRequest) String() string { return proto.CompactTextString(m) }
func (*IsAllowedToGetQuotaRequest) ProtoMessage()    {}
func (*IsAllowedToGetQuotaRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_d3d42a6e345ff44a, []int{0}
}

func (m *IsAllowedToGetQuotaRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_IsAllowedToGetQuotaRequest.Unmarshal(m, b)
}
func (m *IsAllowedToGetQuotaRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_IsAllowedToGetQuotaRequest.Marshal(b, m, deterministic)
}
func (m *IsAllowedToGetQuotaRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_IsAllowedToGetQuotaRequest.Merge(m, src)
}
func (m *IsAllowedToGetQuotaRequest) XXX_Size() int {
	return xxx_messageInfo_IsAllowedToGetQuotaRequest.Size(m)
}
func (m *IsAllowedToGetQuotaRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_IsAllowedToGetQuotaRequest.DiscardUnknown(m)
}

var xxx_messageInfo_IsAllowedToGetQuotaRequest proto.InternalMessageInfo

func (m *IsAllowedToGetQuotaRequest) GetRequestingUser() string {
	if m != nil {
		return m.RequestingUser
	}
	return ""
}

func (m *IsAllowedToGetQuotaRequest) GetOwnerID() string {
	if m != nil {
		return m.OwnerID
	}
	return ""
}

type IsAllowedToGetQuotaResponse struct {
	Allowed              bool     `protobuf:"varint,1,opt,name=allowed,proto3" json:"allowed,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *IsAllowedToGetQuotaResponse) Reset()         { *m = IsAllowedToGetQuotaResponse{} }
func (m *IsAllowedToGetQuotaResponse) String() string { return proto.CompactTextString(m) }
func (*IsAllowedToGetQuotaResponse) ProtoMessage()    {}
func (*IsAllowedToGetQuotaResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_d3d42a6e345ff44a, []int{1}
}

func (m *IsAllowedToGetQuotaResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_IsAllowedToGetQuotaResponse.Unmarshal(m, b)
}
func (m *IsAllowedToGetQuotaResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_IsAllowedToGetQuotaResponse.Marshal(b, m, deterministic)
}
func (m *IsAllowedToGetQuotaResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_IsAllowedToGetQuotaResponse.Merge(m, src)
}
func (m *IsAllowedToGetQuotaResponse) XXX_Size() int {
	return xxx_messageInfo_IsAllowedToGetQuotaResponse.Size(m)
}
func (m *IsAllowedToGetQuotaResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_IsAllowedToGetQuotaResponse.DiscardUnknown(m)
}

var xxx_messageInfo_IsAllowedToGetQuotaResponse proto.InternalMessageInfo

func (m *IsAllowedToGetQuotaResponse) GetAllowed() bool {
	if m != nil {
		return m.Allowed
	}
	return false
}

type GetOwnerQuotaRequest struct {
	OwnerID              string   `protobuf:"bytes,1,opt,name=ownerID,proto3" json:"ownerID,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetOwnerQuotaRequest) Reset()         { *m = GetOwnerQuotaRequest{} }
func (m *GetOwnerQuotaRequest) String() string { return proto.CompactTextString(m) }
func (*GetOwnerQuotaRequest) ProtoMessage()    {}
func (*GetOwnerQuotaRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_d3d42a6e345ff44a, []int{2}
}

func (m *GetOwnerQuotaRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetOwnerQuotaRequest.Unmarshal(m, b)
}
func (m *GetOwnerQuotaRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetOwnerQuotaRequest.Marshal(b, m, deterministic)
}
func (m *GetOwnerQuotaRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetOwnerQuotaRequest.Merge(m, src)
}
func (m *GetOwnerQuotaRequest) XXX_Size() int {
	return xxx_messageInfo_GetOwnerQuotaRequest.Size(m)
}
func (m *GetOwnerQuotaRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_GetOwnerQuotaRequest.DiscardUnknown(m)
}

var xxx_messageInfo_GetOwnerQuotaRequest proto.InternalMessageInfo

func (m *GetOwnerQuotaRequest) GetOwnerID() string {
	if m != nil {
		return m.OwnerID
	}
	return ""
}

type GetOwnerQuotaResponse struct {
	OwnerID              string   `protobuf:"bytes,1,opt,name=ownerID,proto3" json:"ownerID,omitempty"`
	Limit                int64    `protobuf:"varint,2,opt,name=limit,proto3" json:"limit,omitempty"`
	Used                 int64    `protobuf:"varint,4,opt,name=used,proto3" json:"used,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *GetOwnerQuotaResponse) Reset()         { *m = GetOwnerQuotaResponse{} }
func (m *GetOwnerQuotaResponse) String() string { return proto.CompactTextString(m) }
func (*GetOwnerQuotaResponse) ProtoMessage()    {}
func (*GetOwnerQuotaResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_d3d42a6e345ff44a, []int{3}
}

func (m *GetOwnerQuotaResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_GetOwnerQuotaResponse.Unmarshal(m, b)
}
func (m *GetOwnerQuotaResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_GetOwnerQuotaResponse.Marshal(b, m, deterministic)
}
func (m *GetOwnerQuotaResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_GetOwnerQuotaResponse.Merge(m, src)
}
func (m *GetOwnerQuotaResponse) XXX_Size() int {
	return xxx_messageInfo_GetOwnerQuotaResponse.Size(m)
}
func (m *GetOwnerQuotaResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_GetOwnerQuotaResponse.DiscardUnknown(m)
}

var xxx_messageInfo_GetOwnerQuotaResponse proto.InternalMessageInfo

func (m *GetOwnerQuotaResponse) GetOwnerID() string {
	if m != nil {
		return m.OwnerID
	}
	return ""
}

func (m *GetOwnerQuotaResponse) GetLimit() int64 {
	if m != nil {
		return m.Limit
	}
	return 0
}

func (m *GetOwnerQuotaResponse) GetUsed() int64 {
	if m != nil {
		return m.Used
	}
	return 0
}

func init() {
	proto.RegisterType((*IsAllowedToGetQuotaRequest)(nil), "quota.IsAllowedToGetQuotaRequest")
	proto.RegisterType((*IsAllowedToGetQuotaResponse)(nil), "quota.IsAllowedToGetQuotaResponse")
	proto.RegisterType((*GetOwnerQuotaRequest)(nil), "quota.GetOwnerQuotaRequest")
	proto.RegisterType((*GetOwnerQuotaResponse)(nil), "quota.GetOwnerQuotaResponse")
}

func init() { proto.RegisterFile("quota.proto", fileDescriptor_d3d42a6e345ff44a) }

var fileDescriptor_d3d42a6e345ff44a = []byte{
	// 255 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xe2, 0x2e, 0x2c, 0xcd, 0x2f,
	0x49, 0xd4, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x62, 0x05, 0x73, 0x94, 0xe2, 0xb8, 0xa4, 0x3c,
	0x8b, 0x1d, 0x73, 0x72, 0xf2, 0xcb, 0x53, 0x53, 0x42, 0xf2, 0xdd, 0x53, 0x4b, 0x02, 0x41, 0xc2,
	0x41, 0xa9, 0x85, 0xa5, 0xa9, 0xc5, 0x25, 0x42, 0x6a, 0x5c, 0x7c, 0x45, 0x10, 0x66, 0x66, 0x5e,
	0x7a, 0x68, 0x71, 0x6a, 0x91, 0x04, 0xa3, 0x02, 0xa3, 0x06, 0x67, 0x10, 0x9a, 0xa8, 0x90, 0x04,
	0x17, 0x7b, 0x7e, 0x79, 0x5e, 0x6a, 0x91, 0xa7, 0x8b, 0x04, 0x13, 0x58, 0x01, 0x8c, 0xab, 0x64,
	0xce, 0x25, 0x8d, 0xd5, 0xfc, 0xe2, 0x82, 0xfc, 0xbc, 0xe2, 0x54, 0x90, 0xc6, 0x44, 0x88, 0x24,
	0xd8, 0x64, 0x8e, 0x20, 0x18, 0x57, 0xc9, 0x80, 0x4b, 0xc4, 0x3d, 0xb5, 0xc4, 0x1f, 0x64, 0x0c,
	0x8a, 0x93, 0x90, 0xac, 0x62, 0x44, 0xb5, 0x2a, 0x91, 0x4b, 0x14, 0x4d, 0x07, 0xc2, 0x12, 0xec,
	0x5a, 0x84, 0x44, 0xb8, 0x58, 0x73, 0x32, 0x73, 0x33, 0x4b, 0xc0, 0xae, 0x66, 0x0e, 0x82, 0x70,
	0x84, 0x84, 0xb8, 0x58, 0x4a, 0x8b, 0x53, 0x53, 0x24, 0x58, 0xc0, 0x82, 0x60, 0xb6, 0x17, 0x0b,
	0x07, 0xb3, 0x00, 0x8b, 0xd1, 0x1e, 0x46, 0x2e, 0x1e, 0xb0, 0xd9, 0xc1, 0xa9, 0x45, 0x65, 0x99,
	0xc9, 0xa9, 0x42, 0x71, 0x5c, 0xc2, 0x58, 0xbc, 0x27, 0xa4, 0xa8, 0x07, 0x09, 0x6a, 0xdc, 0x41,
	0x2b, 0xa5, 0x84, 0x4f, 0x09, 0xc4, 0xe1, 0x4a, 0x0c, 0x42, 0x3e, 0x5c, 0xbc, 0x28, 0x7e, 0x12,
	0x92, 0x86, 0x6a, 0xc3, 0x16, 0x36, 0x52, 0x32, 0xd8, 0x25, 0x61, 0xa6, 0x25, 0xb1, 0x81, 0xa3,
	0xde, 0x18, 0x10, 0x00, 0x00, 0xff, 0xff, 0x5f, 0x34, 0x0b, 0x4a, 0x09, 0x02, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// QuotaServiceClient is the client API for QuotaService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type QuotaServiceClient interface {
	IsAllowedToGetQuota(ctx context.Context, in *IsAllowedToGetQuotaRequest, opts ...grpc.CallOption) (*IsAllowedToGetQuotaResponse, error)
	GetOwnerQuota(ctx context.Context, in *GetOwnerQuotaRequest, opts ...grpc.CallOption) (*GetOwnerQuotaResponse, error)
}

type quotaServiceClient struct {
	cc *grpc.ClientConn
}

func NewQuotaServiceClient(cc *grpc.ClientConn) QuotaServiceClient {
	return &quotaServiceClient{cc}
}

func (c *quotaServiceClient) IsAllowedToGetQuota(ctx context.Context, in *IsAllowedToGetQuotaRequest, opts ...grpc.CallOption) (*IsAllowedToGetQuotaResponse, error) {
	out := new(IsAllowedToGetQuotaResponse)
	err := c.cc.Invoke(ctx, "/quota.QuotaService/IsAllowedToGetQuota", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *quotaServiceClient) GetOwnerQuota(ctx context.Context, in *GetOwnerQuotaRequest, opts ...grpc.CallOption) (*GetOwnerQuotaResponse, error) {
	out := new(GetOwnerQuotaResponse)
	err := c.cc.Invoke(ctx, "/quota.QuotaService/GetOwnerQuota", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// QuotaServiceServer is the server API for QuotaService service.
type QuotaServiceServer interface {
	IsAllowedToGetQuota(context.Context, *IsAllowedToGetQuotaRequest) (*IsAllowedToGetQuotaResponse, error)
	GetOwnerQuota(context.Context, *GetOwnerQuotaRequest) (*GetOwnerQuotaResponse, error)
}

// UnimplementedQuotaServiceServer can be embedded to have forward compatible implementations.
type UnimplementedQuotaServiceServer struct {
}

func (*UnimplementedQuotaServiceServer) IsAllowedToGetQuota(ctx context.Context, req *IsAllowedToGetQuotaRequest) (*IsAllowedToGetQuotaResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method IsAllowedToGetQuota not implemented")
}
func (*UnimplementedQuotaServiceServer) GetOwnerQuota(ctx context.Context, req *GetOwnerQuotaRequest) (*GetOwnerQuotaResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetOwnerQuota not implemented")
}

func RegisterQuotaServiceServer(s *grpc.Server, srv QuotaServiceServer) {
	s.RegisterService(&_QuotaService_serviceDesc, srv)
}

func _QuotaService_IsAllowedToGetQuota_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(IsAllowedToGetQuotaRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QuotaServiceServer).IsAllowedToGetQuota(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/quota.QuotaService/IsAllowedToGetQuota",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QuotaServiceServer).IsAllowedToGetQuota(ctx, req.(*IsAllowedToGetQuotaRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _QuotaService_GetOwnerQuota_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetOwnerQuotaRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(QuotaServiceServer).GetOwnerQuota(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/quota.QuotaService/GetOwnerQuota",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(QuotaServiceServer).GetOwnerQuota(ctx, req.(*GetOwnerQuotaRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _QuotaService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "quota.QuotaService",
	HandlerType: (*QuotaServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "IsAllowedToGetQuota",
			Handler:    _QuotaService_IsAllowedToGetQuota_Handler,
		},
		{
			MethodName: "GetOwnerQuota",
			Handler:    _QuotaService_GetOwnerQuota_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "quota.proto",
}