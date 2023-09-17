#!/usr/bin/env bash

export NODE_OPTIONS=--openssl-legacy-provider
npm install -g npm@10.1.0
npm cache clean --force
npm install --legacy-peer-deps --maxsockets 1
npm run build -- --env=houston=relative
