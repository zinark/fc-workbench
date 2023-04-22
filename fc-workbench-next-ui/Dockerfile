FROM node:alpine3.17 as build
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm --version
RUN npm install
RUN npm build

FROM node:alpine3.17
EXPOSE 3000
WORKDIR /app
RUN npm install next@13.2.3 -g
COPY --from=build ./.next ./.next
ENTRYPOINT ["next", "start"]