# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
    

RUN chown -R node:node /app

USER node

COPY . .

RUN npx prisma generate

CMD ["node", "dist/app.js"]

EXPOSE 3000

