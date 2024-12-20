# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

EXPOSE 8080

FROM base as dev

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .

RUN chown -R node:node /app

USER node   

RUN npx prisma generate

CMD ["npm", "run", "dev"]

FROM base as prod

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chown -R node:node /app

USER node

RUN npx prisma generate

ENTRYPOINT [ "/docker-entrypoint.sh" ]