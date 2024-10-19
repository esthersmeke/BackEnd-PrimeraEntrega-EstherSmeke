// src/routes/products.js
import { Router } from "express";
import ProductManager from "../models/ProductManager.js"; // Importar ProductManager
import path from "path";

const router = Router();
const PRODUCTS_FILE = path.resolve("src/models/products.json"); // Ruta al archivo de productos
const productManager = new ProductManager(PRODUCTS_FILE); // Crear una instancia de ProductManager

// Obtener todos los productos con limitación
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 0; // Limitar resultados
  try {
    const products = await productManager.getProducts();
    res.json(limit > 0 ? products.slice(0, limit) : products); // Enviar respuesta
  } catch (error) {
    res.status(500).json({ error: "Error: Unable to retrieve products" });
  }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir a número
  try {
    const product = await productManager.getProductById(pid);
    res.json(product); // Devolver el producto si se encuentra
  } catch (error) {
    // Manejo del error específico cuando no se encuentra el producto
    if (error.message === "Not Found") {
      return res.status(404).json({ error: "Error: Product does not exist." });
    }
    // Manejo de otros errores (por ejemplo, problemas de lectura de archivo)
    res.status(500).json({ error: "Error: Unable to retrieve product" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body); // Agregar el nuevo producto
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message }); // Respuesta con error
  }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir a número
  try {
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    // Manejo del error específico cuando no se encuentra el producto
    if (error.message === "Not Found") {
      return res.status(404).json({ error: "Error: Product does not exist." });
    }
    // Manejo de otros errores (por ejemplo, problemas de lectura de archivo)
    res.status(500).json({ error: "Error: Unable to update product" });
  }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir a número
  try {
    await productManager.deleteProduct(pid);
    res.status(204).send(); // No se envía contenido
  } catch (error) {
    res
      .status(error.message === "Not Found" ? 404 : 500)
      .json({ error: error.message });
  }
});

export default router;
