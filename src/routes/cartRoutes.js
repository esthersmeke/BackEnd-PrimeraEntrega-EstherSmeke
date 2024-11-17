// src/routes/cartRoutes.js

import { Router } from "express";
import * as cartController from "../controllers/cartController.js";

const router = Router();

// Ruta para obtener todos los carritos
router.get("/", cartController.getAllCarts);

// Ruta para crear un nuevo carrito
router.post("/", cartController.createCart);

// Ruta para obtener un carrito específico por su ID
router.get("/:cid", cartController.getCartById);

// Ruta para agregar un producto a un carrito específico
router.post("/:cid/products/:pid", cartController.addProductToCart);

// Ruta para eliminar un producto de un carrito específico
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);

// Ruta para actualizar todos los productos en un carrito
router.put("/:cid", cartController.updateCartProducts);

// Ruta para actualizar la cantidad de un producto en un carrito específico
router.put("/:cid/products/:pid", cartController.updateProductQuantity);

// Ruta para vaciar un carrito específico
router.delete("/:cid", cartController.clearCart);

export default router;
