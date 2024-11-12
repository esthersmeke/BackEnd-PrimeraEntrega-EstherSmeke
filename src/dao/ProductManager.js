// src/dao/ProductManager.js
import { Product } from "../models/Product.js";

export class ProductManager {
  async getProducts(filter, options) {
    return await Product.paginate(filter, options);
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(data) {
    const newProduct = new Product(data);
    return await newProduct.save();
  }

  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}
