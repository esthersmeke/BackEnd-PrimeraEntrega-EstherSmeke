import express from "express";
import { ProductManager } from "../dao/ProductManager.js"; // Manager de MongoDB

const router = express.Router();
const productManager = new ProductManager(); // No necesitas pasar la ruta del archivo

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  console.log("GET /realtimeproducts called");
  try {
    const products = await productManager.getProducts(); // Obtener productos desde MongoDB
    res.render("realtimeproducts", { products }); // Renderiza la vista con los productos de MongoDB
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

export { router };
