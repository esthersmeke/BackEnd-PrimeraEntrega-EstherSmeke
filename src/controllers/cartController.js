import { CartManager } from "../models/CartManager.js";
import { HttpStatus } from "../utils/constants.js";

const cartManager = new CartManager();

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(HttpStatus.OK).json(carts);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Controlador para crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(HttpStatus.CREATED).json(newCart);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Controlador para obtener productos de un carrito por ID
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart.error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: cart.error });
    } else {
      res.status(HttpStatus.OK).json(cart);
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Controlador para agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (updatedCart.error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: updatedCart.error });
    } else {
      res.status(HttpStatus.OK).json(updatedCart);
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
