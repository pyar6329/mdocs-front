FROM node:6.11.2-alpine

ENV APP_DIR="/usr/src/app"

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY package.json yarn.lock ${APP_DIR}/

WORKDIR ${APP_DIR}

RUN set -x \
    && chmod u+x /usr/local/bin/docker-entrypoint.sh \
    && apk add --update --upgrade --no-cache --virtual .yarn-dependency-packages \
        bash \
    && yarn install

COPY . ${APP_DIR}/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["--dev"]

EXPOSE 3000
