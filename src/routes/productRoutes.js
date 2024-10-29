// src/routes/productRoutes.js
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// Ruta para obtener todos los productos
router.get("/", getAllProducts);

// Ruta para obtener un producto por ID
router.get("/:pid", getProductById);

// Ruta para agregar un nuevo producto
router.post("/", addProduct);

// Ruta para actualizar un producto existente
router.put("/:pid", updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/:pid", deleteProduct);

export default router;
