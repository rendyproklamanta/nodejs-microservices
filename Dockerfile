FROM node:20-alpine

RUN mkdir -p /app && chown -R node:node /app
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

COPY ./source .
COPY ./source/index/index.js index.js

# Install Yarn
RUN npm install -g yarn --force
run yarn set version stable
RUN yarn

EXPOSE 5000

RUN NODE_OPTIONS='--experimental-vm-modules' jest healthcheck.test.js --force-exit

CMD ["node", "--loader", "esm-module-alias/loader", "--no-warnings", "index.js"]

# docker build -t app_api:latest -f Dockerfile .
# docker run -p 5000:5000 app_api