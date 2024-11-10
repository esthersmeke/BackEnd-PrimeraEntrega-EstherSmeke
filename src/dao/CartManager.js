// src/dao/CartManager.js
import { Cart } from "../models/Cart.js";

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
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex((p) => p.product == productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((p) => p.product != productId);
    return await cart.save();
  }
}
