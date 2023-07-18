#!/usr/bin/env bash

npm install --legacy-peer-deps
NODE_OPTIONS='--openssl-legacy-provider' npm run build -- --env=houston=relative

