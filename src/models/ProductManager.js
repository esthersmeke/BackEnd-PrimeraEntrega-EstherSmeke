// src/models/ProductManager.js
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
    const product = products.find((product) => product.id === Number(id));
    return product || { error: "Producto no encontrado" };
  }

  // Método para agregar un nuevo producto
  async addProduct(productData) {
    // Si no se proporciona 'thumbnails', asignar un arreglo vacío
    productData.thumbnails = productData.thumbnails || [];

    // Validar que todos los campos obligatorios estén presentes
    const requiredFields = [
      "title",
      "description",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (
        productData[field] === undefined ||
        productData[field] === null ||
        productData[field] === ""
      ) {
        console.error(
          `El campo '${field}' es obligatorio, valor recibido: ${productData[field]}`
        );
        throw new Error(`El campo '${field}' es obligatorio`);
      }
    }

    // Generar un código único automáticamente para cada producto nuevo
    const code = `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newProduct = {
      id: this._generateId(),
      code, // Asignar el código generado automáticamente
      status: true, // Agregar 'status' con valor predeterminado de true
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

    if (products.length === filteredProducts.length) {
      return { error: "Producto no encontrado" };
    }

    await this._saveProducts(filteredProducts);
    return { message: "Producto eliminado" };
  }

  // Método privado para guardar productos en el archivo
  async _saveProducts(products = this.products) {
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
