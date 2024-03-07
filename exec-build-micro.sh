#!/bin/sh

source ./source/.env

### Building image based services ###
docker build --rm --build-arg SERVICE_NAME=$SERVICE_GATEWAY -t $SERVICE_GATEWAY:latest -f Dockerfile.gateway .
docker build --rm --build-arg SERVICE_NAME=$SERVICE_AUTH -t $SERVICE_AUTH:latest -f Dockerfile.micro .

### Remove dangling images
docker rmi $(docker images -f "dangling=true" -q)