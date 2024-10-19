import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts(); // Cargar productos en el constructor
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = []; // Si hay un error, comenzamos con un array vacío
      console.error("Error loading products:", error.message); // Mostrar error en la consola
    }
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
        "Todos los campos (excepto thumbnails y status) son obligatorios"
      );
    }

    // Validar que price y stock sean números positivos
    if (typeof price !== "number" || price <= 0) {
      throw new Error("El precio debe ser un número positivo");
    }
    if (typeof stock !== "number" || stock < 0) {
      throw new Error("El stock debe ser un número positivo o cero");
    }

    // Verificar si el código ya existe
    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      throw new Error("El código del producto ya existe");
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
      throw new Error("Producto no encontrado");
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
      throw new Error("Not found");
    }

    this.products.splice(productIndex, 1); // Eliminar producto
    await this.saveProducts(); // Guardar cambios en el archivo
    return { message: "Producto eliminado exitosamente" };
  }

  async getProducts() {
    return this.products; // Ya se cargan en el constructor
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Not found");
    }
    return product;
  }
}

export default ProductManager;
