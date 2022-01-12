npx grpc_tools_node_protoc_ts  \
--js_out=import_style=commonjs,binary:./ \
--grpc_out=./ \
--ts_out=./ \
file.proto
