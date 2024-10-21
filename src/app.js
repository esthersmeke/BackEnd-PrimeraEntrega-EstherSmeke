import express from "express";
import productsRouter from "./routes/products.js"; // Importar el router de productos
import cartsRouter from "./routes/carts.js"; // Importar el router de carritos
import { engine } from "express-handlebars";

const app = express();
const PORT = 8080; // Establecer el puerto

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar datos codificados en URL
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

// Usar los routers para las rutas /api/products y /api/carts
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
