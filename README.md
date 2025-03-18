# IglesiasBC

## Descripción

[IglesiasBC](https://iglesiasbc.com) es una plataforma SaaS diseñada para la gestión y conexión de iglesias. El proyecto está estructurado como un monorepo que contiene múltiples aplicaciones y paquetes compartidos.

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
- **Base de Datos**: PostgreSQL
- **Documentación**: Scalar, OpenAPI
- **Despliegue**: Docker, Coolify

## Comandos

```bash
# Desarrollo
    turbo dev
# Producción
    turbo build
# Formatear
    turbo format
```
