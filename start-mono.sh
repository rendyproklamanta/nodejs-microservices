#!/bin/bash

# Check if the first argument is "build"
[ "$1" = "build" ] && build_arg="--build" || build_arg=""

docker compose -f docker-compose.prerequisite.yml up -d --force-recreate
docker compose -f docker-compose.dev.mono.yml up -d --force-recreate $build_arg

# Remove dangling
docker rmi --force $(docker images -q --filter "dangling=true")