// src/routes/productRoutes.js
import { Router } from "express";
import {
  getProducts, // Este controlador incluirá paginación, filtros y ordenamiento
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

// Ruta para obtener todos los productos con paginación, filtros y ordenamiento
router.get("/", getProducts);

// Ruta para obtener un producto por ID
router.get("/:pid", getProductById);

// Ruta para agregar un nuevo producto
router.post("/", addProduct);

// Ruta para actualizar un producto existente
router.put("/:pid", updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/:pid", deleteProduct);

export default router;
