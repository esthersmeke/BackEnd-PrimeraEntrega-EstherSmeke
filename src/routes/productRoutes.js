// src/routes/productRoutes.js
import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

// Ruta para obtener todos los productos con paginación, filtros y ordenamiento
router.get("/", productController.getProducts);

// Ruta para obtener un producto por ID y renderizar la vista de detalles
router.get("/:pid", productController.getProductById);

// Ruta para agregar un nuevo producto
router.post("/", productController.addProduct);

// Ruta para actualizar un producto existente
router.put("/:pid", productController.updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/:pid", productController.deleteProduct);

export default router;
