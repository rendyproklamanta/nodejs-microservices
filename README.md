# Nodejs Based Microservices

## Prerequisite

- Install docker : https://docs.docker.com/engine/install/ <!-- markdownlint-disable MD034 -->

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

- Set Terminal VSCode to git bash
  
- Start Monolith

```shell
./start-mono.sh
```

- http://localhost:5000 <!-- markdownlint-disable MD034 -->

======== OR ========

- Start Microservices

```shell
./start-micro.sh
```

- http://localhost:5000 (API Gateway)
- http://localhost:500X (Sevices)

## On Production

- Init docker to docker swarm
- Using Traefik for domain proxy, ex : auth.domain.com, user.domain.com
- Link Traefik : https://github.com/rendyproklamanta/docker-swarm-traefik

## Microservices Flow

- @ <b>Editing Flow</b> <!-- markdownlint-disable MD033 -->
=> services => routes => middleware => controller => broker =>  model
<br/>

- @ <b>Deployment Flow</b>
- using cloud VPS minimal 2gb
- using gitlab runner for pipeline
- edit "gitlab-ci.yml" to deploy each service
