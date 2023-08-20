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

## Install and run on Docker as Microservice

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
docker build -t user_service:latest -f Dockerfile.user .
docker run -p 5002:5000 user_service
```
=> http://localhost:5002

## Install and run on VM or local PC
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
~ Save product stock : doc.product (objectId product)
~ Save product order : doc.order (objectId user)
~ Save user if register : doc.user
~ Get token if auto sign after register
<br/>
- <b>Deployment Flow</b>
=> 