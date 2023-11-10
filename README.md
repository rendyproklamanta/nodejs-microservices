## Nodejs Based Microservices
- Using docker : Seperate directory services for runing each docker service
- Using Traefik for domain proxy, ex : auth.domain.com, user.domain.com

## Tech and Packages we use in this project:

- Framework Express.js.
- http-proxy-middleware : API gateway
- Mongodb : use for database .
- Mongoose : for all schema validation and database connection.
- JsonwebToken : for create jsonwebtoken.
- BcryptJs : for password encryption.
- Day.js : for data format.
- Nodemon : for run on dev server.
- Cors and Body parser
- morgan : http logger
- express validator
- yup : validator
- jest : for unit testing
- module-alias : import alias @
- pm2 : for deployed to VM

## List of microservices Port
- API Gateway : http://localhost:5000
- Auth service : http://localhost:5001
- User service : http://localhost:5002

## Build and run each service using docker-compose
- <b>Local development</b>
```
docker-compose -f docker-compose.prerequisite.yml up -d --force-recreate
docker-compose -f docker-compose.local.yml up --force-recreate
```
=> http://localhost:5000
<br>

- <b>Production</b>
1. Install traefik
```
https://github.com/rendyproklamanta/docker-traefik/tree/main/traefik
```
2. Build and deploy
```
docker build -t gateway_service:latest -f Dockerfile.gateway .
docker-compose -f docker-compose.gateway.yml up -d
```


## Build and run "each" service on Docker 

- Gateway Service <sup>*mandatory</sup>
```
docker build -t gateway_service:latest -f Dockerfile.gateway .
docker run -p 5000:5000 gateway_service
```
=> http://localhost:5000

<hr>

- Auth Service
@ login, logout, forgot
```

docker build -t auth_service:latest -f Dockerfile.auth .
docker run -p 5001:5000 auth_service
```
=> http://localhost:5001

<hr>

- User Service
@ manage user  CRUD
```
docker build --build-arg SERVICE_NAME=user -t user_service:latest -f Dockerfile.micro .
docker run -p 5002:5000 user_service
```
=> http://localhost:5002

## Build and run on VM or local PC without Docker
```
yarn install
yarn dev
```
=> http://localhost:5000

- Running via ngrok proxy : 
```
ngrok http 5000
```
=> http://xyz.ngrok.io:5000

## Sample Transactions with microservices
- <b>Editing Flow</b>
=> services => routes => middleware => controller => broker =>  model
<br/>

- <b>Checkout order Flow</b>
== Save user if not registered ==
<i>queue</i>: QUEUE_USER_CREATE
<i>db</i> :  doc.user
== Save product stock ==
<i>queue</i>: PRODUCT_CREATE_MQ
<i>db</i> : doc.product
<i>param</i> : objectId product
== Save product order ==
<i>queue</i>: ORDER_CREATE_MQ
<i>db</i> :  doc.order
<i>param</i> : objectId user
== Auto sign in after complete checkout ==
<br/>

- <b>Deployment Flow</b>
=> using cloud VPS minimal 2gb
=> using gitlab runner for pipeline
=> edit "gitlab-ci.yml" to deploy each service

Step:
- Route > middleware > controller