import { Router } from "express";
import * as cartController from "../controllers/cartController.js";

const router = Router();

// Ruta para obtener todos los carritos
router.get("/", cartController.getAllCarts);

// Ruta para crear un nuevo carrito
router.post("/", cartController.createCart);

// Ruta para obtener los productos de un carrito por ID y renderizar la vista
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Llama al controlador correctamente
    const cart = await cartController.getCartById({ params: { cid } });
    res.render("cart", { cart });
  } catch (error) {
    console.error(`Error al cargar el carrito con ID ${cid}: ${error.message}`);
    res.status(500).send("Error al cargar el carrito");
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/products/:pid", cartController.addProductToCart);

// Endpoint para eliminar un producto específico de un carrito
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);

// Ruta para actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", cartController.updateProductQuantity);

// Ruta para actualizar el carrito con un arreglo de productos
router.put("/:cid/products", cartController.updateCart);

// Ruta para eliminar todos los productos de un carrito
router.delete("/:cid", cartController.clearCart);

export default router;
