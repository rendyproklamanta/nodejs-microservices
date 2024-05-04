#!/bin/bash

docker compose -f docker-compose.prerequisite.yml up -d --force-recreate
./exec-build-micro.sh
docker compose -f docker-compose.dev.micro.yml up -d --force-recreate