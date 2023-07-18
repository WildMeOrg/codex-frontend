#!/usr/bin/env bash

npm install --legacy-peer-deps
npm run build -- --env=houston=relative --openssl-legacy-provider
