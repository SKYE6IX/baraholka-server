#!/bin/bash

npx prisma migrate deploy

node dist/app.js
