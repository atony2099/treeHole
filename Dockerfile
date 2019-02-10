FROM node:8.9.4-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm i --production

COPY . /usr/src/app

CMD npm run docker