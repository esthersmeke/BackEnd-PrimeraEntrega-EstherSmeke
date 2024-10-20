// src/models/CartManager.js
import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = []; // Inicializa un array vacío para los carritos
    this.nextId = 1; // Inicializa el ID autoincremental
  }

  // Cargar todos los carritos desde el archivo
  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.carts = JSON.parse(data);
      // Establecer nextId al ID más alto
      if (this.carts.length > 0) {
        this.nextId = Math.max(...this.carts.map((cart) => cart.id)) + 1;
      }
    } catch (error) {
      console.error("Error: Unable to load the carts.", error);
      this.carts = []; // Si hay un error, inicializa como un array vacío
    }
    return this.carts;
  }

  // Guardar los carritos en el archivo
  async saveCarts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Error: Unable to save the carts.", error);
    }
  }

  // Método para crear un carrito
  async createCart() {
    await this.loadCarts(); // Carga los carritos existentes antes de agregar uno nuevo
    const newCart = { id: this.nextId, products: [] }; // Crear un nuevo carrito
    this.carts.push(newCart); // Agregar el nuevo carrito a la lista
    this.nextId++; // Incrementar el siguiente ID
    await this.saveCarts(); // Guardar los carritos actualizados en el archivo
    return newCart; // Devolver el nuevo carrito
  }

  // Método para agregar un producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    await this.loadCarts(); // Cargar carritos desde el archivo
    const cart = this.carts.find((cart) => cart.id === cartId); // Buscar carrito por ID

    if (!cart) {
      throw new Error("Cart not found"); // Si el carrito no existe
    }

    const existingProduct = cart.products.find((p) => p.product === productId); // Buscar si el producto ya está en el carrito

    if (existingProduct) {
      // Si el producto ya existe, aumentar la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({ product: productId, quantity });
    }

    await this.saveCarts(); // Guardar los carritos actualizados
    return cart; // Devolver el carrito actualizado
  }

  // Obtener todos los productos de un carrito por su ID
  async getCartById(cartId) {
    await this.loadCarts(); // Cargar carritos desde el archivo
    const cart = this.carts.find((cart) => cart.id === cartId); // Buscar carrito por ID

    if (!cart) {
      throw new Error("Cart not found"); // Si el carrito no existe
    }

    return cart; // Devolver el carrito encontrado
  }
}

export default CartManager;
