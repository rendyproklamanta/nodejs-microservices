#!/bin/sh

source ./source/.env

# Set a variable services
gateway_service="gateway"
auth_service="auth"
user_service="user"

### Building image based services ###
docker build --build-arg SERVICE_NAME=$gateway_service -t $gateway_service:latest -f Dockerfile.gateway .
docker build --build-arg SERVICE_NAME=$auth_service -t $auth_service:latest -f Dockerfile.micro .

### Run services ###
docker run -d -p $PORT_GATEWAY_SERVICE:5000 --name $gateway_service --rm $gateway_service 
docker run -d -p $PORT_AUTH_SERVICE:5000 --name $auth_service --rm $auth_service 
