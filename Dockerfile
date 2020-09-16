FROM node:12.16.1

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN git clone https://github.com/Ren14/dolar-blue.git . && npm install

