# IglesiasBC

## Description

[IglesiasBC](https://iglesiasbc.com) is a SaaS platform designed for the management and connection of churches. The project is organized as a monorepo containing multiple applications and shared packages.

## Estructura del Monorepo

```
iglesiasbc/
|
├── apps/
│   ├── app/
│   ├── api/
│   └── www/
│
├── packages/
│   └── schemas/
|
├── package.json
```

## Stack

- **Web**: React + Astro
- **Frontend**: React + Vite
- **Backend**: NestJS + Fastify
- **Global**: typescript, ts-rest, shadcn/ui, pnpm
- **Database**: PostgreSQL
- **Documentation**: Scalar, OpenAPI
- **Deployment**: Docker, Coolify

## Common Commands

```bash
# Desarrollo
    turbo dev
# Producción
    turbo build
# Formatear
    turbo format
```
