FROM alpine:3.11

ADD . /code/
WORKDIR /code

RUN apk add --no-cache nodejs yarn git && \
    yarn install && \
    yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
