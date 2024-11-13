import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { router as vistasRouter } from "./routes/vistasRouter.js";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { ProductManager } from "./dao/ProductManager.js";
import cors from "cors";
import {
  getProducts,
  getProductById,
} from "./controllers/productController.js";
import { getOrCreateCart, getCartById } from "./controllers/cartController.js";
import { configureSocket } from "./sockets/configureSocket.js"; // Importamos el archivo de configuración de sockets
import { errorHandler } from "./utils/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = HttpServer(app);
const io = new IOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Conectar a MongoDB Atlas
const mongoURI =
  "mongodb+srv://esthersmeke:coder@cluster0.ayouo.mongodb.net/ecommerceBe1?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de Handlebars
app.engine(
  "handlebars",
  engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas de productos y carritos
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", vistasRouter);
// Rutas de vistas
app.get("/products", getProducts); // Controlador para renderizar lista de productos
app.get("/products/:pid", getProductById); // Controlador para detalles de un producto
app.get("/carts/:cid", getCartById); // Controlador para ver un carrito específico
app.get("/my-cart", async (req, res) => {
  try {
    const cart = await getOrCreateCart();
    res.redirect(`/carts/${cart._id}`);
  } catch (error) {
    console.error("Error al obtener o crear el carrito:", error.message);
    res.status(500).send("Error al obtener o crear el carrito");
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Configuración de WebSocket usando configureSocket
configureSocket(io, productManager);

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
