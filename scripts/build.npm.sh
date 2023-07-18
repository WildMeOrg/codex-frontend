#!/usr/bin/env bash

npm install --legacy-peer-deps --openssl-legacy-provider
npm run build -- --env=houston=relative
