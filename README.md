# Nodejs Based Microservices

- Using docker : Seperate directory services for runing each docker service
- Using Traefik for domain proxy, ex : auth.domain.com, user.domain.com

## Tech and Packages we use in this project

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
- passport : login management

## Local development

-- Monolith

```shell
docker compose -f docker-compose.prerequisite.yml up -d --force-recreate
docker compose -f docker-compose.dev.mono.yml up -d --force-recreate
```

- http://localhost:5000 <!-- markdownlint-disable MD034 -->

-- Microservices

```shell
docker compose -f docker-compose.prerequisite.yml up -d --force-recreate
./exec-build-micro.sh
docker compose -f docker-compose.dev.micro.yml up -d --force-recreate
```

- http://localhost:5000 (API Gateway)
- http://localhost:500X (Sevices)

## Microservices Flow

- @ <b>Editing Flow</b> <!-- markdownlint-disable MD033 -->
=> services => routes => middleware => controller => broker =>  model
<br/>

- @ <b>Deployment Flow</b>
- using cloud VPS minimal 2gb
- using gitlab runner for pipeline
- edit "gitlab-ci.yml" to deploy each service
