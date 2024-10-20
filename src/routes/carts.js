// src/routes/carts.js
import { Router } from "express";
import CartManager from "../models/CartManager.js";
import path from "path";
import { validateCartExists, validateProductExists } from "../utils/utils.js";

const router = Router();
const CARTS_FILE = path.resolve("src/models/carts.json"); // Ruta al archivo de carritos
const cartManager = new CartManager(CARTS_FILE); // Crear una instancia de CartManager

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart(); // Crear un nuevo carrito
    res.status(201).json(newCart); // Devolver el nuevo carrito
  } catch (error) {
    res.status(500).json({ error: "Error: Unable to create cart" });
  }
});

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid); // Convertir a número
  try {
    const cart = await cartManager.getCartById(cid);
    res.json(cart); // Devolver el carrito si se encuentra
  } catch (error) {
    res
      .status(error.message === "Cart not found" ? 404 : 500)
      .json({ error: error.message });
  }
});

// Agregar producto a un carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid); // ID del carrito
  const pid = req.params.pid; // ID del producto
  const { quantity } = req.body; // Cantidad de producto

  try {
    // Validar que el carrito y el producto existan
    const cartExists = await validateCartExists(cid);
    const productExists = await validateProductExists(pid);

    if (!cartExists) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    res.status(200).json(updatedCart); // Devolver el carrito actualizado
  } catch (error) {
    res
      .status(error.message === "Cart not found" ? 404 : 500)
      .json({ error: error.message });
  }
});

export default router;
