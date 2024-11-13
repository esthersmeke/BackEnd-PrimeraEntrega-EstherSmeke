# Ecommerce Backend

Este es el backend de una aplicación de ecommerce desarrollada con Node.js, Express, MongoDB y WebSocket para la administración de productos y carritos de compras en tiempo real.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework de backend para la creación de APIs y rutas.
- **MongoDB**: Base de datos NoSQL para almacenar productos y carritos.
- **Mongoose**: ODM para interactuar con MongoDB.
- **WebSocket**: Comunicación en tiempo real con los clientes.
- **Handlebars**: Motor de plantillas para renderizar vistas en el servidor.
- **Cors**: Middleware para permitir solicitudes desde diferentes dominios.

## Endpoints

### Productos

- **GET /api/products**: Obtener todos los productos con paginación, filtros y ordenamiento.
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

El middleware de manejo de errores se encarga de capturar errores y enviar respuestas estandarizadas en JSON al cliente, con mensajes personalizados para cada caso.

## Vistas

Se utiliza Handlebars para renderizar vistas en el servidor. Las vistas incluyen:

- **Home**: Muestra la lista de productos.
- **Detalle de Producto**: Página con los detalles de un producto específico.
- **Carrito**: Visualización de los productos en un carrito específico.

## Estructura del Proyecto

/BackEnd-PrimeraEntrega-EstherSmeke/
│
├── /src
│ ├── /controllers
│ │ ├── productController.js # Lógica de negocio para productos
│ │ └── cartController.js # Lógica de negocio para carritos
│ │
│ ├── /dao
│ │ ├── CartManager.js # Clase para manejo de carritos
│ │ ├── MessageManager.js # Clase para manejo de mensajes
│ │ └── ProductManager.js # Clase para manejo de productos
│ │
│ ├── /models
│ │ ├── Cart.js # Modelo de carrito
│ │ ├── Product.js # Modelo de producto
│ │ └── Message.js # Modelo para mensajes
│ │
│ ├── /routes
│ │ ├── productRoutes.js # Rutas para productos (/api/products)
│ │ ├── cartRoutes.js # Rutas para carritos (/api/carts)
│ │ └── vistasRouter.js # Rutas para vistas
│ │
│ ├── /sockets
│ │ └── configureSocket.js # Configuración y lógica del servidor WebSocket
│ │
│ ├── /utils
│ │ ├── constants.js # Constantes globales (códigos de estado HTTP)
│ │ └── errorHandler.js # Middleware para manejo de errores
│ │
│ ├── /views
│ │ ├── /layouts
│ │ │ └── main.handlebars # Layout principal
│ │ ├── cart.handlebars # Vista para un carrito específico
│ │ ├── error.handlebars # Vista para errores
│ │ ├── home.handlebars # Vista para listar productos
│ │ ├── productDetail.handlebars # Vista para detalles de un producto
│ │ └── realTimeProducts.handlebars # Vista para productos en tiempo real
│
├── /public # Archivos estáticos (JS, CSS, imágenes)
│ ├── /js
│ │ ├── cartActions.js # Lógica de cliente para acciones del carrito
│ │ ├── realtime.js # Lógica de cliente para WebSockets
│ │ └── addToCart.js # Lógica de cliente para agregar al carrito
│ └── styles.css # Estilos CSS
│
├── /node_modules # Dependencias de Node.js
│
├── .gitignore # Archivos y directorios a ignorar por Git
├── package.json # Información del proyecto y dependencias
├── package-lock.json # Control de versiones de dependencias
└── README.md # Documentación del proyecto
