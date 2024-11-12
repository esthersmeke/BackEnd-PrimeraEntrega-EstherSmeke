// src/controllers/cartController.js

import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js"; // Importación del modelo de producto
import mongoose from "mongoose";
import { HttpStatus } from "../utils/constants.js";

// Controlador para obtener o crear un carrito
export const getOrCreateCart = async () => {
  let cart = await Cart.findOne(); // Ajusta esto a la lógica de usuario o sesión
  if (!cart) {
    cart = await Cart.create({ products: [] });
  }
  return cart;
};

// Controlador para obtener todos los carritos
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().lean();
    res.status(HttpStatus.OK).json(carts);
  } catch (error) {
    console.error("Error al obtener todos los carritos:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al obtener los carritos" });
  }
};

// Controlador para obtener un carrito por ID y renderizar la vista del carrito
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "ID de carrito no válido" });
    }

    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Carrito no encontrado" });
    }
    // Respuesta condicional según el tipo de solicitud
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // Responder en JSON para solicitudes de API como en Postman
      res.json({ status: "success", cart });
    } else {
      // Renderizar la vista para solicitudes en el navegador
      res.render("cart", { cart });
    }
  } catch (error) {
    console.error(`Error al cargar el carrito con ID ${cid}: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al cargar el carrito" });
  }
};

// Controlador para crear un nuevo carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(HttpStatus.CREATED).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al crear el carrito" });
  }
};

// Controlador para agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "ID de carrito o producto no válido" });
    }
    if (quantity <= 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "La cantidad debe ser un valor positivo" });
    }

    // Verificar si el producto existe en la base de datos
    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado` });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      {
        $push: { products: { product: pid, quantity } },
      },
      { new: true }
    )
      .populate("products.product")
      .lean();

    res.status(HttpStatus.OK).json(updatedCart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al agregar el producto al carrito" });
  }
};

// Controlador para eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "ID de carrito o producto no válido" });
    }

    // Buscar el carrito
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Carrito con ID ${cid} no encontrado`,
      });
    }

    // Verificar si el producto está en el carrito
    const productInCart = cart.products.find((item) =>
      item.product.equals(pid)
    );
    if (!productInCart) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: `Producto con ID ${pid} no encontrado en el carrito`,
      });
    }

    // Eliminar el producto del carrito
    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      {
        $pull: { products: { product: pid } },
      },
      { new: true }
    )
      .populate("products.product")
      .lean();

    res.status(HttpStatus.OK).json(updatedCart);
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
};

// Controlador para actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "ID de carrito o producto no válido" });
    }
    if (quantity <= 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "La cantidad debe ser un valor positivo" });
    }

    const cart = await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    )
      .populate("products.product")
      .lean();

    if (!cart) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Producto o carrito no encontrado" });
    }

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto:",
      error.message
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al actualizar la cantidad del producto" });
  }
};

// Controlador para vaciar el carrito
export const clearCart = async (req, res) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "ID de carrito no válido" });
    }

    const clearedCart = await Cart.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    ).lean();
    res.status(HttpStatus.OK).json(clearedCart);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al vaciar el carrito" });
  }
};
