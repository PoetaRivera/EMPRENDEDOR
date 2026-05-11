# Seguimiento — EMPRENDEDOR-BACKEND

## Estado actual (2026-05-10)

Backend funcional con 45 tests pasando. Listo para conectar con frontend.

### Lo que tiene

| Funcionalidad | Estado |
|---------------|--------|
| 6 modulos (auth, catalog, inventory, orders, clients, payments) | Completo |
| JWT real con middleware de autenticacion | Completo |
| Validacion de inputs con zod (todos los modulos) | Completo |
| Transaccion Firestore en createOrder (atomicidad) | Completo |
| Paginacion en todos los listados | Completo |
| CORS habilitado | Completo |
| Datos fiscales CCF/FCF en clientes y ordenes | Completo |
| Emisor configurable por env vars | Completo |
| 45 tests (5 suites) | Pasando |

### Lo que NO tiene

- Frontend (no hay)
- `.env.example` desactualizado (faltan JWT_SECRET, EMISOR_*)
- Sin deploy cloud (corre local en :3000)
- Auth: login usa email sin password (JWT se genera con cualquier email)

---

## Siguiente paso: Frontend

Stack: React + React Router + Tailwind (mismo ecosistema que PageMusic y portfolio)

### Estructura propuesta

```
frontend-emprendedor/
  src/
    App.jsx
    api.js                    # fetch wrapper con JWT en header
    pages/
      LoginPage.jsx
      CatalogPage.jsx
      InventoryPage.jsx
      OrdersPage.jsx
      OrderCreatePage.jsx     # form con stock check + datos fiscales
      ClientsPage.jsx
      ClientFormPage.jsx      # form con toggle facturacion CCF/FCF
    components/
      Layout.jsx              # sidebar + topbar
      PaginatedTable.jsx
      StatusBadge.jsx
```

### Flujo de trabajo por modulos (orden sugerido)

1. **Setup + Login** — proyecto React, routing, api.js con JWT, LoginPage
2. **Layout** — sidebar por modulo, topbar con tenant name, logout
3. **Catalogo** — tabla paginada de productos + form crear producto
4. **Inventario** — tabla de stock + ajuste manual
5. **Clientes** — CRUD con formulario de datos fiscales (toggle CCF/FCF)
6. **Pedidos** — el mas complejo:
   - OrderCreate: seleccionar cliente, items con check de stock, metodo de pago
   - Si el cliente tiene facturacion habilitada → campos fiscales obligatorios
   - Tabla de pedidos con status badges
   - Actualizacion manual de estado de pago (pendiente / acordado / recibido)

### Prioridades pendientes del backend (baja)

- [ ] Actualizar `.env.example` con JWT_SECRET y EMISOR_*
- [ ] Agregar password al login (actualmente acepta cualquier email)
- [ ] Endpoint `GET /api/clients/buyers/:id` para obtener cliente individual
- [ ] Endpoint `GET /api/orders?hasFactura=true` para filtrar ordenes con factura

### Repositorio

- GitHub: https://github.com/PoetaRivera/EMPRENDEDOR-BACKEND
- Branch: master
- Ultimo commit: `4c46a0f` — datos fiscales CCF/FCF
