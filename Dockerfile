FROM alpine:3.11

ADD . /code/
WORKDIR /code

RUN apk add --no-cache nodejs yarn git && \
    yarn install && \
    yarn cache clean

EXPOSE 3000

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

CMD ["yarn", "start"]
