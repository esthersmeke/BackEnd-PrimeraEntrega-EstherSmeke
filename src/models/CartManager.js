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
      console.error("Error al cargar los carritos:", error);
      this.carts = []; // Si hay un error, inicializa como un array vacío
    }
    return this.carts;
  }

  // Guardar los carritos en el archivo
  async saveCarts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Error al guardar los carritos:", error);
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
  async addProductToCart(cartId, productId) {
    await this.loadCarts(); // Cargar carritos existentes
    const cart = this.carts.find((c) => c.id === cartId); // Buscar el carrito por ID

    if (!cart) {
      throw new Error("Carrito no encontrado"); // Lanzar error si no se encuentra el carrito
    }

    const productInCart = cart.products.find((p) => p.product === productId); // Buscar el producto en el carrito
    if (productInCart) {
      productInCart.quantity += 1; // Incrementar la cantidad si ya existe
    } else {
      cart.products.push({ product: productId, quantity: 1 }); // Agregar nuevo producto si no existe
    }

    await this.saveCarts(); // Guardar los cambios en los carritos
  }

  // Aquí puedes añadir más métodos según sea necesario (por ejemplo, eliminar productos, etc.)
}

export default CartManager;
