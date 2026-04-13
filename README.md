# Consi Studio

Webapp ecommerce mobile-first pensada para compartirse desde WhatsApp, construida con Next.js, TypeScript y Tailwind CSS.

La app usa como fuente de catálogo el feed real provisto por `CATALOG_API_URL`. Actualmente ese feed responde en formato RSS/XML, y la capa `services/catalog` lo transforma a un modelo `Product` desacoplado para que la UI no dependa del backend crudo.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Docker listo para Cloud Run

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
CATALOG_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

Notas:

- `CATALOG_API_URL` tiene un fallback al endpoint compartido para que el proyecto pueda correr sin configuración extra.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` acepta el formato internacional sin `+`.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run start
```

## Docker

```bash
docker build -t consi-studio .
docker run -p 8080:8080 consi-studio
```

## Despliegue sugerido en Cloud Run

Archivo incluido: `cloudrun.yaml`

Ejemplo de flujo:

```bash
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/consi-studio/consi-studio
gcloud run services replace cloudrun.yaml --region REGION
```

Antes de desplegar:

- Reemplazar `PROJECT_ID`, `REGION` e `IMAGE` en `cloudrun.yaml`
- Configurar `CATALOG_API_URL` y `NEXT_PUBLIC_WHATSAPP_NUMBER`

## Arquitectura

```text
app/                 rutas y layout principal
components/          bloques visuales reutilizables
lib/                 utilidades, env y helpers de WhatsApp
services/catalog/    fetch, parseo RSS/XML y adaptadores
styles/              tokens de marca
types/               contratos tipados del dominio
```

## Commits sugeridos

```text
feat: scaffold nextjs ecommerce base
feat: add branded design system and mobile home
feat: integrate rss catalog service and product detail pages
chore: add docker and cloud run deployment config
docs: document local development and deployment flow
```
