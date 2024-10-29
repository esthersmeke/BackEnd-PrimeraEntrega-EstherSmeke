import express from "express";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { ProductManager } from "./models/ProductManager.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);

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
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas de productos y carritos
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Rutas de vistas
app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).send("Error al cargar la lista de productos");
  }
});

app.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts");
});

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  // Enviar la lista inicial de productos cuando el cliente se conecta
  const products = await productManager.getProducts();
  socket.emit("productList", products);

  // Escuchar para cambios en productos y emitir a todos los clientes conectados
  socket.on("newProduct", async (product) => {
    const existingProduct = productManager.products.find(
      (p) => p.code === product.code
    );
    if (existingProduct) {
      socket.emit("error", {
        message: "El código del producto debe ser único.",
      });
      return;
    }

    try {
      await productManager.addProduct(product);
      const updatedProducts = await productManager.getProducts();
      io.emit("productList", updatedProducts);
    } catch (error) {
      console.error("Error al agregar el producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const updatedProducts = await productManager.getProducts();
      io.emit("productList", updatedProducts);
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
    }
  });
}); // <- Aquí se cierra el bloque de `io.on('connection', ...)`

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
