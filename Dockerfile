#
# Super simple example of a Dockerfile
#
FROM node:latest
MAINTAINER Konrad Schieban

EXPOSE 8080:5000

ADD . /src

RUN cd /src && npm install

WORKDIR /src

CMD node index.js