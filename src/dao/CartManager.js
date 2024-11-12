// src/dao/CartManager.js
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

export class CartManager {
  async getCarts() {
    return await Cart.find().populate("products.product");
  }

  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async addCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const productIndex = cart.products.findIndex((item) =>
      item.product._id.equals(productId)
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex === -1)
      throw new Error("Producto no encontrado en el carrito");

    cart.products.splice(productIndex, 1);
    return await cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = cart.products.find((item) =>
      item.product.equals(productId)
    );
    if (!product) throw new Error("Producto no encontrado en el carrito");

    product.quantity = quantity;
    return await cart.save();
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    return await cart.save();
  }
}
