FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY turbo.json package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm turbo run build --filter=@iglesiasbc/api

FROM node:20-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
