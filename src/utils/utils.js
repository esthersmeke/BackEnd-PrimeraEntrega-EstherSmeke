// src/utils/utils.js
import CartManager from "../models/CartManager.js";
import ProductManager from "../models/ProductManager.js"; // Asegúrate de importar el ProductManager si es necesario

const cartManager = new CartManager("src/models/carts.json");
const productManager = new ProductManager("src/models/products.json");

// Validar que un carrito exista
export const validateCartExists = async (cartId) => {
  try {
    const carts = await cartManager.loadCarts();
    return carts.some((cart) => cart.id === cartId);
  } catch (error) {
    console.error("Error: Unable to validate cart existence.", error);
    return false; // Devuelve false si hay un error
  }
};
// Validar que un producto exista
export const validateProductExists = async (productId) => {
  try {
    const products = await productManager.loadProducts(); // Asegúrate de que este método exista
    return products.some((product) => product.id === parseInt(productId));
  } catch (error) {
    console.error("Error: Unable to validate product existence.", error);
    return false; // Devuelve false si hay un error
  }
};
