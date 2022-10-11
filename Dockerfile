FROM nginx:alpine as org.wildme.codex.frontend.deploy

COPY ./codex-frontend /usr/share/nginx/html

COPY ./.dockerfiles/www/default.conf /etc/nginx/conf.d/default.conf
