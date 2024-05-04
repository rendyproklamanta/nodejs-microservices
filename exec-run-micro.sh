#!/bin/bash

source ./source/.env

### Run services ###
docker run -d -p $PORT_GATEWAY_SERVICE:5000 --name $SERVICE_GATEWAY --rm $SERVICE_GATEWAY 
docker run -d -p $PORT_AUTH_SERVICE:5000 --name $SERVICE_AUTH --rm $SERVICE_AUTH 
# docker compose -f docker-compose.production.yml up -d --force-recreate
