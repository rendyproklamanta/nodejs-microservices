FROM node:16-alpine

RUN mkdir -p /app && chown -R node:node /app

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY .env .env
COPY ./config ./config
COPY ./test ./test
COPY ./services ./services
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY jsconfig.json jsconfig.json
COPY jest.config.json jest.config.json
COPY index.js index.js

RUN yarn install

EXPOSE 5000

RUN yarn test test/healthcheck.test.js

CMD ["node", "index.js"]

# docker build -t gateway_service:latest -f Dockerfile.gateway .
# docker run -p 5000:5000 gateway_service