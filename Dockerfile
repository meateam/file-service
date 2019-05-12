#build stage
FROM node:10.13-alpine AS builder
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent && mv node_modules ../
RUN npm install -g typescript
COPY . .
RUN npm run build-ts
LABEL Name=upload-service Version=0.0.1
EXPOSE 8080
CMD ["npm", "run", "serve"]