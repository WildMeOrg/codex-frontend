FROM node:16.20.1 as org.wildme.codex.frontend.build

COPY . /code 

WORKDIR /code

RUN set -ex \
 && ./scripts/build.npm.sh

##########################################################################################
FROM nginx:alpine as org.wildme.codex.frontend.deploy

COPY --from=org.wildme.codex.frontend.build /code/dist /usr/share/nginx/html

COPY ./.dockerfiles/www/default.conf /etc/nginx/conf.d/default.conf
