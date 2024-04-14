FROM node:20.12.1-slim

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN npm install -g pnpm

RUN pnpm install --production

RUN apt-get update -y && apt-get install -y openssl

RUN pnpm prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]