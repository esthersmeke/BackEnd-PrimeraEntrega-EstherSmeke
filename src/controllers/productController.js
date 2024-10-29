//src/controllers/productController.js
import { ProductManager } from "../models/ProductManager.js";
import { HttpStatus } from "../utils/constants.js"; // Importamos las constantes

const productManager = new ProductManager("./data/products.json");

// Controlador para obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const { limit } = req.query; // Obtener el parámetro de consulta 'limit'
    let products = await productManager.getProducts();

    // Si se especifica un límite, devolver solo esa cantidad de productos
    if (limit) {
      products = products.slice(0, Number(limit));
    }

    res.status(HttpStatus.OK).json(products);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (product.error) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `Producto con ID ${pid} no encontrado.` });
    } else {
      res.status(HttpStatus.OK).json(product);
    }
  } catch (error) {
    console.error(`Error al obtener producto con ID ${pid}: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `Error interno al obtener el producto con ID ${pid}.` });
  }
};

// Controlador para agregar un nuevo producto
export const addProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    status,
    thumbnails,
  } = req.body;
  try {
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          error:
            "Todos los campos (title, description, code, price, stock, category) son obligatorios.",
        });
    }
    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      status,
      thumbnails,
    });
    res.status(HttpStatus.CREATED).json(newProduct);
  } catch (error) {
    console.error(`Error al agregar el producto: ${error.message}`);
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: `Error al agregar el producto: ${error.message}` });
  }
};

// Controlador para actualizar un producto existente
export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const updateData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, updateData);
    if (updatedProduct.error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: updatedProduct.error });
    } else {
      res.status(HttpStatus.OK).json(updatedProduct);
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// Controlador para eliminar un producto
export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const result = await productManager.deleteProduct(pid);
    if (result.error) {
      res.status(HttpStatus.NOT_FOUND).json({ message: result.error });
    } else {
      res.status(HttpStatus.OK).json(result);
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
