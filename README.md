# Gestión de Productos Financieros

Aplicación full-stack para la gestión de productos financieros compuesta por una API REST en Node.js y un frontend en Angular.

---

## Tabla de Contenidos

- [Backend API](#backend-api)
- [Frontend Angular](#frontend-angular)
- [Levantar el proyecto con Docker Compose](#levantar-el-proyecto-con-docker-compose)

---

## Backend API

### Stack

- **Runtime:** Node.js con TypeScript
- **Framework:** Express + `routing-controllers`
- **Validación:** `class-validator` / `class-transformer`
- **Puerto:** `3002`
- **Prefijo base:** `/bp`

### Modelo de Producto

| Campo           | Tipo   | Validaciones                   |
| --------------- | ------ | ------------------------------ |
| `id`            | string | Requerido, no vacío            |
| `name`          | string | Mín. 6 caracteres, máx. 100    |
| `description`   | string | Mín. 10 caracteres, máx. 200   |
| `logo`          | string | Requerido, no vacío            |
| `date_release`  | string | Formato fecha ISO (YYYY-MM-DD) |
| `date_revision` | string | Formato fecha ISO (YYYY-MM-DD) |

### Endpoints

#### Obtener todos los productos

```
GET /bp/products
```

**Respuesta 200**

```json
{
  "data": [
    {
      "id": "trj-crd",
      "name": "Tarjetas de Crédito",
      "description": "Tarjeta de consumo bajo la modalidad de crédito",
      "logo": "https://example.com/logo.png",
      "date_release": "2024-02-01",
      "date_revision": "2025-02-01"
    }
  ]
}
```

---

#### Obtener un producto por ID

```
GET /bp/products/:id
```

| Parámetro | Tipo   | Descripción     |
| --------- | ------ | --------------- |
| `id`      | string | ID del producto |

**Respuesta 200** — objeto producto  
**Respuesta 404** — `{ "message": "Not product found with that identifier" }`

---

#### Verificar existencia de un ID

```
GET /bp/products/verification/:id
```

| Parámetro | Tipo   | Descripción    |
| --------- | ------ | -------------- |
| `id`      | string | ID a verificar |

**Respuesta 200** — `true` si el ID ya existe, `false` si está disponible

---

#### Crear un producto

```
POST /bp/products
Content-Type: application/json
```

**Body**

```json
{
  "id": "trj-crd",
  "name": "Tarjetas de Crédito",
  "description": "Tarjeta de consumo bajo la modalidad de crédito",
  "logo": "https://example.com/logo.png",
  "date_release": "2024-02-01",
  "date_revision": "2025-02-01"
}
```

**Respuesta 200**

```json
{
  "message": "Product added successfully",
  "data": { ... }
}
```

**Respuesta 400** — `{ "message": "Duplicate identifier found in the database" }`

---

#### Actualizar un producto

```
PUT /bp/products/:id
Content-Type: application/json
```

| Parámetro | Tipo   | Descripción     |
| --------- | ------ | --------------- |
| `id`      | string | ID del producto |

**Body** — mismos campos que en la creación (el `id` no se modifica)

**Respuesta 200**

```json
{
  "message": "Product updated successfully",
  "data": { ... }
}
```

**Respuesta 404** — producto no encontrado

---

#### Eliminar un producto

```
DELETE /bp/products/:id
```

| Parámetro | Tipo   | Descripción     |
| --------- | ------ | --------------- |
| `id`      | string | ID del producto |

**Respuesta 200**

```json
{
  "message": "Product removed successfully"
}
```

**Respuesta 404** — producto no encontrado

---

## Frontend Angular

### Stack

- **Framework:** Angular 21 con TypeScript
- **Estado global:** Angular Signals (`signal`, `computed`, `resource`)
- **Formularios:** `@angular/forms/signals`
- **HTTP Client:** `@angular/common/http`
- **Tests:** Vitest + jsdom
- **Puerto desarrollo:** `4200`

### Arquitectura

```
src/app/
├── core/                  # Lógica de negocio y estado global
│   ├── products-api.ts    # Servicio HTTP hacia el backend
│   ├── products-store.ts  # Estado de la lista de productos
│   ├── product-form-store.ts  # Estado del formulario de creación
│   ├── product-edit-store.ts  # Estado del formulario de edición
│   └── product.model.ts   # Interfaces del modelo
├── components/            # Componentes reutilizables
│   ├── header/            # Cabecera de la aplicación
│   ├── product-table/     # Tabla de productos con acciones
│   ├── search-bar/        # Barra de búsqueda en tiempo real
│   ├── pagination/        # Control de paginación (5 / 10 / 20)
│   ├── confirm-delete-modal/  # Modal de confirmación de eliminación
│   └── context-menu/      # Menú contextual (editar / eliminar)
└── pages/                 # Vistas enrutadas
    ├── products-page/     # Listado principal
    ├── product-form-page/ # Creación de producto
    └── product-edit-page/ # Edición de producto
```

### Rutas

| Ruta                          | Página          | Descripción                        |
| ----------------------------- | --------------- | ---------------------------------- |
| `/products`                   | ProductsPage    | Listado de todos los productos     |
| `/products/new`               | ProductFormPage | Formulario para crear un producto  |
| `/products/update/:productId` | ProductEditPage | Formulario para editar un producto |
| `/**`                         | —               | Redirige a `/products`             |

### Funcionalidades

- **Listado de productos** — muestra la tabla con todos los productos cargados desde el backend.
- **Búsqueda en tiempo real** — filtra los productos por nombre mientras el usuario escribe.
- **Paginación** — permite visualizar 5, 10 o 20 resultados por página.
- **Crear producto** — formulario reactivo con validaciones síncronas y asíncronas (verifica duplicidad de ID contra el backend).
- **Editar producto** — pre-carga los datos del producto seleccionado y permite actualizar todos sus campos.
- **Eliminar producto** — muestra un modal de confirmación antes de ejecutar la eliminación.
- **Menú contextual** — accesible desde cada fila de la tabla para editar o eliminar el producto.
- **Manejo de errores** — mensajes de error y estados de carga visibles en la UI durante las operaciones HTTP.

### Variables de entorno

| Variable | Valor por defecto       | Descripción             |
| -------- | ----------------------- | ----------------------- |
| `apiUrl` | `http://localhost:3002` | URL base de la API REST |

---

## Levantar el proyecto con Docker Compose

### Pasos

1. **Configurar variables de entorno (Docker)**

   Crea un archivo `.env` en la raíz del proyecto para sobrescribir los valores por defecto:

   ```env
   BACKEND_PORT=3002
   FRONTEND_PORT=4200
   NODE_ENV=development
   ```

2. **Configurar variables de entorno (Angular)**

Crear el archivo `.env` en el proyecto de Angular, basado en el archivo de ejemplo:

```env
API_URL=http://localhost:3002
```

Ejecutar el script `set-envs.js` para crear automáticamente el directorio `environments` que requiere el proyecto.

```bash

cd reto_angular

node scripts/set-envs.js

```

3. **Construir y levantar los servicios**

   ```bash
   docker compose up --build -d
   ```

4. **Acceder a la aplicación**

   | Servicio | URL                   |
   | -------- | --------------------- |
   | Frontend | http://localhost:4200 |
   | Backend  | http://localhost:3002 |

### Servicios definidos

| Servicio   | Imagen           | Puerto host → contenedor | Descripción                   |
| ---------- | ---------------- | ------------------------ | ----------------------------- |
| `backend`  | Dockerfile local | `3002` → `3002`          | API REST Node.js              |
| `frontend` | Dockerfile local | `4200` → `80`            | App Angular servida por Nginx |

> Los servicios se comunican a través de la red interna `app-network` (driver: bridge). El frontend depende del backend (`depends_on: backend`).

### Detener los servicios

```bash
docker compose down
```
