FROM node:10.13-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm config set -g production false
RUN npm install --silent
RUN npm install -g mocha
COPY . .
EXPOSE 50051
CMD ["npm", "run", "run_tests"]