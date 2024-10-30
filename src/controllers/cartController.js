// /src/controllers/cartController.js
import { CartManager } from "../models/CartManager.js";
import { HttpStatus } from "../utils/constants.js";

const cartManager = new CartManager();

export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(HttpStatus.OK).json(carts);
  } catch (error) {
    console.error(`Error al obtener todos los carritos: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `Error interno al obtener los carritos.` });
  }
};

// Controlador para crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(HttpStatus.CREATED).json(newCart);
  } catch (error) {
    console.error(`Error al crear un nuevo carrito: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `Error interno al crear un nuevo carrito.` });
  }
};

// Controlador para obtener productos de un carrito por ID
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart.error) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({
          message: `Carrito con ID ${cid} no encontrado. Verifique si el ID es correcto o si el carrito fue creado.`,
        });
    } else {
      res.status(HttpStatus.OK).json(cart);
    }
  } catch (error) {
    console.error(`Error al obtener carrito con ID ${cid}: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `Error interno al obtener el carrito con ID ${cid}.` });
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
    console.error(
      `Error al agregar producto con ID ${pid} al carrito con ID ${cid}: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        error: `Error interno al agregar el producto con ID ${pid} al carrito con ID ${cid}. Verifique los detalles y vuelva a intentarlo.`,
      });
  }
};
