#!/usr/bin/env bash

export NODE_OPTIONS="--openssl-legacy-provider"

npm install --legacy-peer-deps
npm run build -- --env=houston=relative

