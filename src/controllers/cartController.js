// src/controllers/cartController.js

import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";
import { HttpStatus } from "../utils/constants.js";

// Obtener o crear un carrito
export const getOrCreateCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ products: [] });
  }
  return cart;
};

// Obtener todos los carritos
export const getAllCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find().lean();
    res.status(HttpStatus.OK).json(carts);
  } catch (error) {
    console.error("Error al obtener todos los carritos:", error.message);
    next(error);
  }
};

// Obtener un carrito por ID y renderizar su vista
export const getCartById = async (req, res, next) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "ID de carrito no válido",
      };
    }

    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) {
      throw { status: HttpStatus.NOT_FOUND, message: "Carrito no encontrado" };
    }

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json({ status: "success", cart });
    } else {
      res.render("cart", { cart });
    }
  } catch (error) {
    console.error(`Error al cargar el carrito con ID ${cid}: ${error.message}`);
    next(error);
  }
};

// Crear un nuevo carrito
export const createCart = async (req, res, next) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(HttpStatus.CREATED).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error.message);
    next(error);
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "ID de carrito o producto no válido",
      };
    }

    if (quantity <= 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "La cantidad debe ser un valor positivo",
      };
    }

    const product = await Product.findById(pid);
    if (!product) {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Producto con ID ${pid} no encontrado`,
      };
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      throw { status: HttpStatus.NOT_FOUND, message: "Carrito no encontrado" };
    }

    const productInCart = cart.products.find((item) =>
      item.product.equals(pid)
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    await cart.populate("products.product");

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error.message);
    next(error);
  }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res, next) => {
  const { cid, pid } = req.params;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "ID de carrito o producto no válido",
      };
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Carrito con ID ${cid} no encontrado`,
      };
    }

    const productInCart = cart.products.find((item) =>
      item.product.equals(pid)
    );
    if (!productInCart) {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Producto con ID ${pid} no encontrado en el carrito`,
      };
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    )
      .populate("products.product")
      .lean();

    res.status(HttpStatus.OK).json(updatedCart);
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.message);
    next(error);
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "ID de carrito o producto no válido",
      };
    }
    if (quantity <= 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "La cantidad debe ser un valor positivo",
      };
    }

    const cart = await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    )
      .populate("products.product")
      .lean();

    if (!cart) {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: "Producto o carrito no encontrado",
      };
    }

    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto:",
      error.message
    );
    next(error);
  }
};

// Vaciar el carrito
export const clearCart = async (req, res, next) => {
  const { cid } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "ID de carrito no válido",
      };
    }

    const clearedCart = await Cart.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    ).lean();
    res.status(HttpStatus.OK).json(clearedCart);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error.message);
    next(error);
  }
};
