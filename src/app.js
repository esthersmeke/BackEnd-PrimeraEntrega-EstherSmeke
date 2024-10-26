import express from "express";
import productsRouter from "./routes/products.js"; // Importar el router de productos
import cartsRouter from "./routes/carts.js"; // Importar el router de carritos
import { engine } from "express-handlebars";
import { Server } from "socket.io";

const app = express();
const PORT = 8080; // Establecer el puerto

// Configurar Handlebars como motor de vistas
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para manejar JSON y datos en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static("./src/public"));

// Ruta de prueba para verificar servidor
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

// Usar los routers para las rutas /products y /api/carts
app.use("/products", productsRouter); // Ruta de productos para renderizar vista
app.use("/api/carts", cartsRouter);

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Cliente conectado");
});

export { io };
