FROM node:20-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install

RUN pnpm turbo run build --filter=@iglesiasbc/api

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
