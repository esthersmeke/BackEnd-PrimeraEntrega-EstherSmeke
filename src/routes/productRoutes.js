// src/routes/productRoutes.js

import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

// Obtener todos los productos con paginación, filtros y ordenamiento
router.get("/", productController.getProducts);

// Obtener un producto por ID y renderizar la vista de detalles
router.get("/:pid", productController.getProductById);

// Agregar un nuevo producto
router.post("/", productController.addProduct);

// Actualizar un producto existente
router.put("/:pid", productController.updateProduct);

// Eliminar un producto por ID
router.delete("/:pid", productController.deleteProduct);

export default router;
