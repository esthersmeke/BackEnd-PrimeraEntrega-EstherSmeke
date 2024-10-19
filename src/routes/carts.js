// src/routes/carts.js
import { Router } from "express";
import CartManager from "../models/CartManager.js"; // Importar CartManager

const router = Router();
const CARTS_FILE = "src/models/carts.json"; // Ruta de carts.json
const cartManager = new CartManager(CARTS_FILE); // Instanciar CartManager

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart(); // Usar el método createCart
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error: Unable to create the cart." });
  }
});

// Obtener productos del carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await cartManager.loadCarts(); // Cargar carritos
    const cart = carts.find((c) => c.id === parseInt(cid)); // Convertir cid a número
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Error: Cart not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error: Unable to read the cart." });
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.addProductToCart(parseInt(cid), pid); // Usar el método addProductToCart
    const updatedCart = await cartManager.loadCarts(); // Cargar carritos para obtener el carrito actualizado
    const cart = updatedCart.find((c) => c.id === parseInt(cid));
    res.status(201).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error: Unable to add the product to the cart." });
  }
});

export default router;
