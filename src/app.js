import express from "express";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { configureSocket } from "./sockets/socket.js";

const app = express();
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "/src/views"));

// Servir archivos estáticos
app.use(express.static(path.join(path.resolve(), "/src/public")));

// Rutas para productos y carritos
app.use("/api/products", productRoutes); // Rutas para productos
app.use("/api/carts", cartRoutes); // Rutas para carritos, asegúrate de que esta línea esté presente

// Rutas de vistas
app.get("/", (req, res) => {
  res.render("home", { title: "Lista de Productos" });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

// Conexión con WebSocket
configureSocket(io);

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
