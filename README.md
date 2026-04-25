# Inventario SaaS modular

Base de backend en Node.js + Express + Firestore inspirada en el contrato de arquitectura del archivo `Arquitectura Pagina inventario.txt`.

## Objetivos

- Multi-tenant por `clienteId`
- Monolito modular preparado para evolucionar
- Backend como fuente de verdad
- Comunicacion entre modulos por servicios
- Firestore como capa de persistencia

## Estructura

```text
src/
  app.js
  server.js
  config/
  middleware/
  modules/
    auth/
    catalog/
    clients/
    inventory/
    orders/
    payments/
  shared/
```

## Reglas implementadas

- Todo request resuelve `clienteId` desde header, query o subdominio.
- Ningun modulo accede al almacenamiento de otro modulo.
- Pedidos consulta a Inventario por contrato de servicio.
- Firestore se organiza por modulo y `clienteId`.

## Inicio rapido

1. Instala dependencias:

```bash
npm install
```

2. Crea tu archivo `.env` a partir de `.env.example`.
3. Coloca tus credenciales de Firebase en la ruta configurada.
4. Ejecuta:

```bash
npm run dev
```

## Rutas principales

- `GET /health`
- `GET /api/catalog/products`
- `POST /api/inventory/check`
- `POST /api/orders`
- `GET /api/clients/buyers`
- `POST /api/payments/status`
- `POST /api/auth/login`

## Siguientes pasos recomendados

- Agregar validacion con `zod` o `joi`
- Agregar autenticacion JWT real
- Registrar eventos de dominio
- Agregar pruebas de integracion
- Separar modulos criticos a microservicios cuando escale
