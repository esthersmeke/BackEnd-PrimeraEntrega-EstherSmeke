// src/dao/ProductManager.js

import { Product } from "../models/Product.js";

export class ProductManager {
  // Obtener productos con paginación y filtros
  async getProducts(filter, options) {
    return await Product.paginate(filter, options);
  }

  // Obtener un producto específico por su ID
  async getProductById(id) {
    return await Product.findById(id);
  }

  // Agregar un nuevo producto
  async addProduct(data) {
    const newProduct = new Product(data);
    return await newProduct.save();
  }

  // Actualizar un producto existente por su ID
  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  // Eliminar un producto por su ID
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}
