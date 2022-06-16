#!/usr/bin/env bash

docker build --no-cache -t wildme/codex-frontend:latest .
docker push wildme/codex-frontend:latest
