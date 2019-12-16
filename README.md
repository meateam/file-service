# File Service

**Compiling Protobuf To Golang:**
- `protoc -I proto/ proto/file/file.proto --go_out=plugins=grpc:./proto`
- `protoc -I proto/ proto/quota/quota.proto --go_out=plugins=grpc:./proto`