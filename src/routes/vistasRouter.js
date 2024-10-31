import express from "express";
import ProductManager from "../models/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url); // Ruta del archivo actual
const __dirname = path.dirname(__filename); // Directorio del archivo actual

const productsPath = path.join(__dirname, "../models/products.json");
const productManager = new ProductManager(productsPath); // Pasar la ruta del archivo

router.get("/realtimeproducts", async (req, res) => {
  console.log("GET /realtimeproducts called");
  try {
    const products = await productManager.getProducts();
    res.render("realtimeproducts", { products }); // Renderiza la vista con la lista de productos
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

export { router };
