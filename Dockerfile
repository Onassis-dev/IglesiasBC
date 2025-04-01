FROM node:20-alpine AS builder

ENV NODE_ENV=development

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install

RUN ls

RUN pnpm turbo run build --filter=@iglesiasbc/api 

ENV NODE_ENV=development

EXPOSE 3000


CMD ["node", "apps/api/dist/main.js"]
