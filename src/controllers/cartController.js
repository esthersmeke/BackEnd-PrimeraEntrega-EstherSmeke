// src/controllers/cartController.js
import { CartManager } from "../dao/CartManager.js"; // Importa desde `dao`
import { HttpStatus } from "../utils/constants.js";
import mongoose from "mongoose";
import { Cart } from "../models/Cart.js";

const cartManager = new CartManager();

// Controlador para obtener todos los carritos
export const getAllCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(HttpStatus.OK).json(carts);
  } catch (error) {
    console.error(`Error al obtener todos los carritos: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al obtener los carritos" });
  }
};

// Controlador para obtener un carrito por ID
export const getCartById = async ({ params: { cid } }) => {
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart) {
      return cart; // Devuelve el carrito encontrado
    } else {
      throw new Error(`Carrito con ID ${cid} no encontrado.`);
    }
  } catch (error) {
    console.error(
      `Error al obtener el carrito con ID ${cid}: ${error.message}`
    );
    throw new Error("Error al obtener el carrito");
  }
};

// Controlador para crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(HttpStatus.CREATED).json(newCart);
  } catch (error) {
    console.error(`Error al crear el carrito: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al crear el carrito" });
  }
};

// Controlador para agregar un producto a un carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    if (updatedCart) {
      res.status(HttpStatus.OK).json(updatedCart);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        error: `Carrito con ID ${cid} o producto con ID ${pid} no encontrado.`,
      });
    }
  } catch (error) {
    console.error(`Error al agregar el producto al carrito: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al agregar el producto al carrito" });
  }
};

// Controlador para eliminar un producto de un carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Convertir `cid` y `pid` a ObjectId usando `new`
    const cartId = new mongoose.Types.ObjectId(cid);
    const productId = new mongoose.Types.ObjectId(pid);

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Carrito con ID ${cid} no encontrado.` });
    }

    // Eliminar el producto del carrito
    cart.products = cart.products.filter(
      (item) => !item.product.equals(productId)
    );
    await cart.save();

    res
      .status(HttpStatus.OK)
      .json({ message: `Producto ${pid} eliminado del carrito ${cid}` });
  } catch (error) {
    console.error(
      `Error al eliminar el producto del carrito: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

// Función para actualizar la cantidad de un producto en un carrito
export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; // Asegúrate de enviar `quantity` en el cuerpo de la solicitud

  try {
    const cartId = new mongoose.Types.ObjectId(cid);
    const productId = new mongoose.Types.ObjectId(pid);

    // Buscar el carrito
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Carrito con ID ${cid} no encontrado.` });
    }

    // Encontrar el producto en el carrito y actualizar la cantidad
    const product = cart.products.find((item) =>
      item.product.equals(productId)
    );
    if (!product) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado en el carrito.` });
    }

    product.quantity = quantity; // Actualizar la cantidad
    await cart.save();

    res.status(HttpStatus.OK).json({
      message: `Cantidad del producto ${pid} actualizada en el carrito ${cid}`,
    });
  } catch (error) {
    console.error(
      `Error al actualizar la cantidad del producto: ${error.message}`
    );
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
};

// Función para actualizar el carrito con un arreglo de productos
export const updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // El nuevo arreglo de productos se pasa en el cuerpo de la solicitud

  try {
    const cartId = new mongoose.Types.ObjectId(cid);

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Carrito con ID ${cid} no encontrado.` });
    }

    // Validar y actualizar los productos en el carrito
    cart.products = products.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product),
      quantity: item.quantity,
    }));

    await cart.save();

    res
      .status(HttpStatus.OK)
      .json({ message: `Carrito ${cid} actualizado con los nuevos productos` });
  } catch (error) {
    console.error(`Error al actualizar el carrito: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al actualizar el carrito" });
  }
};

//Elimina todos los productos de un carrito específico.
export const clearCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cartId = new mongoose.Types.ObjectId(cid);

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Carrito con ID ${cid} no encontrado.` });
    }

    // Vaciar el arreglo de productos
    cart.products = [];
    await cart.save();

    res
      .status(HttpStatus.OK)
      .json({ message: `Todos los productos eliminados del carrito ${cid}` });
  } catch (error) {
    console.error(
      `Error al eliminar todos los productos del carrito: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al eliminar los productos del carrito" });
  }
};
