#!/bin/bash

docker compose -f docker-compose.prerequisite.yml up -d --force-recreate
docker compose -f docker-compose.dev.mono.yml up -d --force-recreate