#build stage
FROM node:10.13-alpine AS builder
RUN GRPC_HEALTH_PROBE_VERSION=v0.3.0 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
RUN npm install -g typescript
COPY . .
COPY --from=builder /bin/grpc_health_probe /bin/grpc_health_probe
RUN npm run build-ts
LABEL Name=upload-service Version=0.0.1
EXPOSE 8080
CMD ["npm", "run", "serve"]