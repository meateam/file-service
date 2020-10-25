FROM node:10.16-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --silent
RUN npm config set unsafe-perm true
RUN npm config set -g production false
COPY . .
EXPOSE 8080
CMD ["npm", "run", "run_tests"]
