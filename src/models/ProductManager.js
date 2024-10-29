//src/models/ProductManager.js

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProductManager {
  constructor() {
    this.products = [];
    this.filePath = path.resolve(__dirname, "../data/products.json"); // Usar 'path.resolve' para obtener una ruta absoluta
    this.init();
  }

  // Método para inicializar y cargar productos desde el archivo
  async init() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.log("Archivo no encontrado, creando uno nuevo...");
      await this._saveProducts(); // Guardar productos iniciales si no existe el archivo
    }
  }

  // Método para obtener todos los productos
  async getProducts() {
    return this.products;
  }

  // Método para obtener un producto por ID
  async getProductById(id) {
    const products = await this.getProducts();
    // Convertimos el id a número para asegurar una comparación correcta
    const product = products.find((product) => product.id === Number(id));
    return product || { error: "Producto no encontrado" };
  }

  // Método para agregar un nuevo producto
  async addProduct(productData) {
    // Validamos que todos los campos sean obligatorios
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.code ||
      !productData.stock ||
      !productData.thumbnails
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validamos que no se repita el código "code"
    const productExists = this.products.some(
      (product) => product.code === productData.code
    );
    if (productExists) {
      throw new Error("El código ya existe");
    }

    const newProduct = {
      id: this._generateId(),
      ...productData,
    };

    this.products.push(newProduct);
    await this._saveProducts(); // Guardamos la lista actualizada
    return newProduct;
  }

  // Método para actualizar un producto por ID
  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(
      (product) => product.id === Number(id)
    );

    if (productIndex === -1) {
      return { error: "Producto no encontrado" };
    }

    const updatedProduct = { ...products[productIndex], ...updateData };

    // Asegurarse de que el ID no se modifique
    updatedProduct.id = products[productIndex].id;

    products[productIndex] = updatedProduct;
    await this._saveProducts(products);
    return updatedProduct;
  }

  // Método para eliminar un producto por ID
  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter(
      (product) => product.id !== Number(id)
    );

    // Si no se eliminó ningún producto, devolvemos un error
    if (products.length === filteredProducts.length) {
      return { error: "Producto no encontrado" };
    }

    // Guardar los productos filtrados
    await this._saveProducts(filteredProducts);
    return { message: "Producto eliminado" };
  }

  // Método privado para guardar productos en el archivo
  async _saveProducts(products) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error(`Error al guardar productos: ${error.message}`);
    }
  }

  // Método privado para generar un ID único y autoincrementable
  _generateId() {
    return this.products.length > 0
      ? Math.max(...this.products.map((prod) => prod.id)) + 1
      : 1;
  }
}
