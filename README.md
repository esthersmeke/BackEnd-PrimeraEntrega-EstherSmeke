# BackEnd Primera Entrega - Esther Smeke

## Descripción

Este proyecto consiste en el desarrollo de un servidor basado en Node.js y Express, que gestiona productos y carritos de compras, con la integración de Handlebars para vistas y WebSockets para la actualización en tiempo real.

## Instrucciones para la instalación

1. Clona el repositorio en tu máquina local:

   ```bash
   git clone https://github.com/esthersmeke/BackEnd-PrimeraEntrega-EstherSmeke.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd BackEnd-PrimeraEntrega-EstherSmeke
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

4. Inicia el servidor en el puerto 8080:
   ```bash
   npm start
   ```

## Endpoints

### Productos

- **GET /api/products**

  - Devuelve la lista de todos los productos.
  - Ejemplo:
    ```bash
    curl http://localhost:8080/api/products
    ```

- **GET /api/products/:pid**

  - Devuelve un producto específico según su ID.
  - Ejemplo:
    ```bash
    curl http://localhost:8080/api/products/1
    ```

- **POST /api/products**

  - Agrega un nuevo producto.
  - Ejemplo:
    ```bash
    curl -X POST http://localhost:8080/api/products -d '{"title":"Producto 1", "description":"Descripción", "price":100, "code":"abc123", "stock":50, "thumbnails":["/img1.png"]}' -H "Content-Type: application/json"
    ```

- **PUT /api/products/:pid**

  - Actualiza un producto existente por su ID.
  - Ejemplo:
    ```bash
    curl -X PUT http://localhost:8080/api/products/1 -d '{"title":"Producto Actualizado", "price":200}' -H "Content-Type: application/json"
    ```

- **DELETE /api/products/:pid**
  - Elimina un producto por su ID.
  - Ejemplo:
    ```bash
    curl -X DELETE http://localhost:8080/api/products/1
    ```

### Carritos

- **POST /api/carts**

  - Crea un nuevo carrito vacío.
  - Ejemplo:
    ```bash
    curl -X POST http://localhost:8080/api/carts
    ```

- **GET /api/carts/:cid**

  - Devuelve los productos de un carrito específico por su ID.
  - Ejemplo:
    ```bash
    curl http://localhost:8080/api/carts/1
    ```

- **POST /api/carts/:cid/product/:pid**
  - Agrega un producto al carrito por su ID.
  - Ejemplo:
    ```bash
    curl -X POST http://localhost:8080/api/carts/1/product/1
    ```

## Vistas

- **`/`** - Muestra la lista de todos los productos.
- **`/realtimeproducts`** - Muestra la lista de productos con actualización en tiempo real mediante WebSockets.

## WebSockets

El proyecto está integrado con WebSockets para actualizar la vista de productos en tiempo real.

### Flujo de WebSocket

1. Al agregar un nuevo producto, la vista de productos se actualiza automáticamente en `/realtimeproducts`.
2. Al eliminar un producto, la vista también se actualiza automáticamente.

## Dependencias

- **express**: Servidor para gestionar las peticiones HTTP.
- **express-handlebars**: Motor de plantillas para las vistas.
- **socket.io**: Manejo de WebSockets para actualización en tiempo real.
- **fs**: Módulo para manejo de archivos en el file system.
- **path**: Para manejo de rutas en el servidor.

## Estructura del Proyecto

/BackEnd-PrimeraEntrega-EstherSmeke/
│
├── /src
│ ├── /controllers
│ │ ├── productController.js # Lógica de negocio para productos
│ │ └── cartController.js # Lógica de negocio para carritos
│ │
│ ├── /models
│ │ ├── ProductManager.js # Clase ProductManager (manejo de productos con file system)
│ │ └── CartManager.js # Clase CartManager (manejo de carritos con file system)
│ │
│ ├── /routes
│ │ ├── productRoutes.js # Rutas para productos (/api/products)
│ │ └── cartRoutes.js # Rutas para carritos (/api/carts)
│ │
│ ├── /views # Vistas con Handlebars
│ │ └── /layout
│ │ └── main.handlebars
│ │ ├── home.handlebars # Vista para listar productos
│ │ └── realTimeProducts.handlebars # Vista para actualizar productos en tiempo real
│ │
│ ├── /public # Archivos estáticos (JS, CSS, imágenes)
│ │ └── /js
│ │ └── realtime.js # Lógica de cliente para WebSockets
│ │└── styles.css
│ │
│ ├── /sockets
│ │ └── socket.js # Configuración y lógica del servidor WebSocket
│ │
│ ├── /utils
│ │ └── constants.js # Constantes globales como los códigos de estado HTTP
│ │
│ └── app.js # Configuración del servidor y middlewares (Express, Handlebars, etc.)
│
├── /data # Almacén de datos
│ ├── products.json # Persistencia de productos
│ └── carts.json # Persistencia de carritos
│
├── /node_modules # Módulos de Node.js
│
├── .gitignore # Ignorar archivos (como node_modules)
├── package.json # Dependencias y scripts del proyecto
└── README.md # Instrucciones del proyecto
