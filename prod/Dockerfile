FROM node:lts as dist-build
ARG git_ref=develop
RUN set -x \
    && cd /tmp \
    && git clone --branch ${git_ref} https://github.com/WildMeOrg/codex-frontend.git
# Install dependencies & build distribution
RUN set -ex \
    && cd /tmp/codex-frontend \
    && npm install \
    && npm run build -- --env=houston=relative


FROM nginx:alpine as main
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=dist-build /tmp/codex-frontend/dist /usr/share/nginx/html
