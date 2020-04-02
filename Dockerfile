FROM node:13.10.1-alpine3.10

ADD . /code/
WORKDIR /code

RUN apk add --no-cache yarn git ffmpeg && \
    yarn install && \
    yarn run webpack && \
    yarn cache clean

EXPOSE 3000

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD ["yarn", "start"]
