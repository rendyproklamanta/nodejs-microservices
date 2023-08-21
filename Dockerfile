FROM node:16-alpine

RUN mkdir -p /app && chown -R node:node /app
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY . .
COPY index.js index.js

RUN yarn install

EXPOSE 5000

RUN yarn test test/healthcheck.test.js

CMD ["node", "index.js"]

# docker build -t app_api:latest -f Dockerfile .
# docker run -p 5000:5000 app_api