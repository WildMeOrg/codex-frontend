#!/usr/bin/env bash

export NODE_OPTIONS=--openssl-legacy-provider
npm install -g npm@10.1.0
npm install --legacy-peer-deps
npm run build -- --env=houston=relative
