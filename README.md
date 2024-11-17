# Ecommerce Backend

Este es el backend de una aplicación de ecommerce desarrollada con Node.js, Express, MongoDB y WebSocket para la administración de productos y carritos de compras en tiempo real.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework de backend para la creación de APIs y rutas.
- **MongoDB**: Base de datos NoSQL para almacenar productos y carritos.
- **Mongoose**: ODM para interactuar con MongoDB.
- **WebSocket**: Comunicación en tiempo real con los clientes.
- **Handlebars**: Motor de plantillas para renderizar vistas en el servidor.
- **Cors**: Middleware para permitir solicitudes desde diferentes dominios, útil en aplicaciones frontend-backend separadas.

## Endpoints

### Productos

- **GET /api/products**: Obtener todos los productos con paginación, filtros y ordenamiento.

  - **Parámetros de consulta (query params):**
    - `limit`: Límite de productos por página (por defecto: 10).
    - `page`: Número de página (por defecto: 1).
    - `sort`: Ordenar por precio (`asc` para ascendente o `desc` para descendente).
    - `query`: Buscar productos por:
      - `title` o `category` (busca coincidencias parciales).
      - **`status:true`** para filtrar productos disponibles (activos).
  - **Ejemplo de uso:**
    ```
    GET /api/products?limit=5&page=1&sort=asc&query=status:true
    ```

- **GET /api/products/:pid**: Obtener un producto específico por su ID.
- **POST /api/products**: Agregar un nuevo producto.
- **PUT /api/products/:pid**: Actualizar un producto por su ID.
- **DELETE /api/products/:pid**: Eliminar un producto por su ID.

### Carritos

- **GET /api/carts**: Obtener todos los carritos.
- **POST /api/carts**: Crear un nuevo carrito.
- **GET /api/carts/:cid**: Obtener un carrito específico por su ID.
- **POST /api/carts/:cid/products/:pid**: Agregar un producto a un carrito específico.
- **DELETE /api/carts/:cid/products/:pid**: Eliminar un producto de un carrito específico.
- **PUT /api/carts/:cid/products/:pid**: Actualizar la cantidad de un producto en un carrito.
- **DELETE /api/carts/:cid**: Vaciar un carrito.

## Funcionalidad en Tiempo Real

Este proyecto usa WebSocket para manejar actualizaciones en tiempo real de la lista de productos. Los clientes reciben actualizaciones cuando un producto es agregado o eliminado, permitiendo una experiencia interactiva en el frontend.

## Manejo de Errores

El Middleware de manejo de errores captura excepciones tanto del backend como de la lógica del servidor, asegurando que las respuestas sean estandarizadas en formato JSON, con mensajes personalizados para cada caso (como errores de validación o problemas de conectividad).

## Vistas

Se utiliza Handlebars para renderizar vistas en el servidor. Las vistas disponibles son:

- **Lista de Productos (Home) (`/products`)**:  
  Muestra la lista completa de productos con opciones para buscar, filtrar por categoría, y ordenar por precio.

- **Detalle de Producto (`/products/:pid`)**:  
  Página con los detalles de un producto específico, que incluye un botón para regresar a la lista de productos y la opción de agregar el producto al carrito.

- **Carrito (`/cart/:cid`)**:  
  Visualización de los productos en un carrito específico, con opciones para actualizar cantidades, eliminar productos, o vaciar el carrito.

- **Productos en Tiempo Real (`/realtimeproducts`)**:  
  Página interactiva que muestra una lista actualizada en tiempo real de productos mediante WebSockets.

## Estructura del Proyecto

```plaintext
📦ecommerce-backend
┣ 📂src
┃ ┣ 📂controllers
┃ ┃ ┣ 📜cartController.js # Lógica para carritos de compras
┃ ┃ ┗ 📜productController.js # Lógica para manejo de productos
┃ ┣ 📂dao
┃ ┃ ┣ 📜CartManager.js # Clase para manejo de carritos
┃ ┃ ┣ 📜MessageManager.js # Clase para manejo de mensajes
┃ ┃ ┗ 📜ProductManager.js # Clase para manejo de productos
┃ ┣ 📂models
┃ ┃ ┣ 📜Cart.js # Modelo de carrito
┃ ┃ ┣ 📜Message.js # Modelo para mensajes
┃ ┃ ┗ 📜Product.js # Modelo de producto
┃ ┣ 📂public
┃ ┃ ┣ 📂js
┃ ┃ ┃ ┣ 📜cartActions.js # Lógica de cliente para acciones del carrito
┃ ┃ ┃ ┗ 📜realtime.js # Lógica de cliente para WebSockets
┃ ┃ ┣ 📜index.html
┃ ┃ ┗ 📜styles.css
┃ ┣ 📂routes
┃ ┃ ┣ 📜cartRoutes.js # Rutas para carritos
┃ ┃ ┣ 📜productRoutes.js # Rutas para productos
┃ ┃ ┗ 📜vistasRouter.js # Rutas para vistas
┃ ┣ 📂sockets
┃ ┃ ┗ 📜configureSocket.js # Configuración del servidor WebSocket
┃ ┣ 📂utils
┃ ┃ ┣ 📜constants.js # Constantes globales
┃ ┃ ┗ 📜errorHandler.js # Middleware para manejo de errores
┃ ┣ 📂views
┃ ┃ ┣ 📂layouts
┃ ┃ ┃ ┗ 📜main.handlebars # Layout principal
┃ ┃ ┣ 📜cart.handlebars # Vista para carrito
┃ ┃ ┣ 📜error.handlebars # Vista para errores
┃ ┃ ┣ 📜home.handlebars # Vista para listar productos
┃ ┃ ┣ 📜productDetail.handlebars # Vista para detalles de producto
┃ ┃ ┗ 📜realTimeProducts.handlebars # Vista para productos en tiempo real
┃ ┗ 📜app.js
┣ 📜.gitignore
┣ 📜README.md
┣ 📜package-lock.json
┗ 📜package.json
```
