#!/usr/bin/env bash

set -e

export DOCKER_BUILDKIT=1

export DOCKER_CLI_EXPERIMENTAL=enabled

export NODE_OPTIONS="--openssl-legacy-provider"

usage () {
    echo "Usage: $0 [-t <tag>] [-r <registry-url>] [<image> ...]";
}

if [ ! -d ".git/" ]; then
    echo "Cannot build Docker image when this repo is a submodule within a larger repo."
    exit 1;
fi

# Parse commandline options
while getopts ":t:r:" option; do
    case ${option} in
        t ) TAG=${OPTARG};;
        r ) REGISTRY=${OPTARG};;
        \? ) usage; exit 1;;
    esac
done
shift $((OPTIND - 1))

# Assign variables
TAG=${TAG:-universal}
REGISTRY=${REGISTRY:-}
IMAGES=${@:-houston-frontend codex-frontend}
# Set the image prefix
if [ -n "$REGISTRY" ]; then
    IMG_PREFIX="${REGISTRY}/"
else
    IMG_PREFIX="wildme/"
fi

# docker buildx create --name multi-arch-builder --use

for IMG in $IMAGES; do
    echo "Building and Pushing Multi-platform ${IMG_PREFIX}${IMG}:${TAG}"
    if [ "$TAG" == "universal" ]; then
        docker buildx build \
            --no-cache \
            -t ${IMG_PREFIX}${IMG}:${TAG} \
            --platform linux/amd64,linux/arm64 \
            .
    else
        docker buildx build \
            --no-cache \
            -t ${IMG_PREFIX}${IMG}:${TAG} \
            --platform linux/amd64,linux/arm64 \
            --push \
            .
    fi
done
