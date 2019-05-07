# File Service
**Compiling Protobuf To Golang:**
protoc -I proto/ proto/file.proto --go_out=plugins=grpc:./proto