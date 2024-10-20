import fs from "fs/promises";

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error loading products:", error); // Mostrar error en la consola
      this.products = []; // Si hay un error, comenzamos con un array vacío
    }
    return this.products;
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error saving products:", error.message); // Mostrar error en la consola
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnails = [],
    code,
    stock,
    category,
    status = true,
  }) {
    // Validar que los campos obligatorios estén presentes
    if (
      !title ||
      !description ||
      !price ||
      !code ||
      stock === undefined ||
      !category
    ) {
      throw new Error(
        "All fields are required except for thumbnails and status."
      );
    }

    // Validar que price y stock sean números positivos
    if (typeof price !== "number" || price <= 0) {
      throw new Error("The price must be a positive number.");
    }
    if (typeof stock !== "number" || stock < 0) {
      throw new Error("The stock must be a positive number or zero.");
    }

    // Verificar si el código ya existe
    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      throw new Error("The product code already exists.");
    }

    // Generar un ID autoincrementable
    const id = this.getNextId();

    // Crear el nuevo producto con todos los campos incluidos
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
    };

    // Agregar el nuevo producto al array y guardar
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  getNextId() {
    return this.products.length > 0
      ? Math.max(...this.products.map((product) => product.id)) + 1 // ID más alto + 1
      : 1; // Comienza desde 1 si no hay productos
  }

  // UPDATE
  async updateProduct(id, updates) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) {
      throw new Error("Not Found.");
    }

    // Actualizar los campos del producto
    const updatedProduct = { ...this.products[productIndex], ...updates };
    this.products[productIndex] = updatedProduct;
    await this.saveProducts(); // Guardar cambios en el archivo
    return updatedProduct;
  }

  // DELETE
  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex === -1) {
      throw new Error("Not Found");
    }

    this.products.splice(productIndex, 1); // Eliminar producto
    await this.saveProducts(); // Guardar cambios en el archivo
    return { message: "Product successfully deleted." };
  }

  async getProducts() {
    return this.products; // Ya se cargan en el constructor
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Not Found");
    }
    return product;
  }
}

export default ProductManager;
