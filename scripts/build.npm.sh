#!/usr/bin/env bash

export NODE_OPTIONS="--openssl-legacy-provider --max_old_space_size=8192"
npm install -g npm@10.1.0
npm cache clean --force
npm install --legacy-peer-deps --maxsockets 1
npm run build -- --env=houston=relative
