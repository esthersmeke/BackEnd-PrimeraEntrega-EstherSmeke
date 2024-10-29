import { Router } from "express";
import {
  createCart,
  getCartById,
  getAllCarts,
  addProductToCart,
} from "../controllers/cartController.js";

const router = Router();

// Ruta para obtener todos los carritos
router.get("/", getAllCarts);

// Ruta para crear un nuevo carrito
router.post("/", createCart);

// Ruta para obtener los productos de un carrito por ID
router.get("/:cid", getCartById);

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", addProductToCart);

export default router;
