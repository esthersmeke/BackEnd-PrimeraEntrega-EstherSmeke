import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CartManager {
  constructor() {
    this.filePath = path.resolve(__dirname, "../data/carts.json"); // Asegurarse de usar ruta absoluta
    this.carts = [];
    console.log("Ruta absoluta al archivo de carritos:", this.filePath); // Log para verificar la ruta absoluta
    this.init();
  }

  async init() {
    try {
      console.log(
        "Intentando leer el archivo de carritos desde:",
        this.filePath
      );
      const data = await fs.readFile(this.filePath, "utf-8");
      this.carts = JSON.parse(data);
      console.log("Archivo de carritos cargado correctamente.");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error(
          "Archivo de carritos no encontrado. Verifica que carts.json existe en la carpeta data."
        );
      } else if (error.name === "SyntaxError") {
        console.error(
          "Error al parsear el archivo de carritos: El archivo no tiene un formato JSON válido."
        );
      } else {
        console.error(`Error al inicializar CartManager: ${error.message}`);
      }
    }
  }

  async getCarts() {
    return this.carts;
  }

  async createCart() {
    const newCart = {
      id: this._generateId(),
      products: [],
    };

    this.carts.push(newCart);
    await this._saveCarts();
    return newCart;
  }

  async getCartById(id) {
    const cart = this.carts.find((cart) => cart.id === Number(id));
    return cart || { error: "Carrito no encontrado" };
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (!cart || cart.error) return { error: "Carrito no encontrado" };

    const productIndex = cart.products.findIndex(
      (prod) => prod.product === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this._saveCarts();
    return cart;
  }

  async _saveCarts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
      console.log("Archivo de carritos guardado correctamente.");
    } catch (error) {
      console.error(`Error al guardar carritos: ${error.message}`);
    }
  }

  _generateId() {
    return this.carts.length > 0
      ? Math.max(...this.carts.map((cart) => cart.id)) + 1
      : 1;
  }
}
