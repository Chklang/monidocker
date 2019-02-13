FROM node:alpine as build
WORKDIR /app
COPY . /app/
RUN \
	npm i --unsafe-perm && \
	npm run dist && \
	cd dist && \
	npm i

FROM node:alpine
COPY --from=build /app/dist /app
WORKDIR /app
CMD node ./lib-server/webserver/server.js
