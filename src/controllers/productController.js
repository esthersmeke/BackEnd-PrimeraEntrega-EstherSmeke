// src/controllers/productController.js
import { ProductManager } from "../dao/ProductManager.js"; // Importa desde `dao`
import { HttpStatus } from "../utils/constants.js";
import { Product } from "../models/Product.js";

const productManager = new ProductManager();

// Controlador para obtener todos los productos con paginación, filtros y ordenamiento
// Controlador para obtener todos los productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    const filter = query
      ? {
          $or: [
            { title: new RegExp(query, "i") },
            { category: new RegExp(query, "i") },
          ],
        }
      : {};

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    const products = await Product.paginate(filter, options);
    res.status(HttpStatus.OK).json(products);
  } catch (error) {
    console.error(`Error al obtener productos: ${error.message}`);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: `Error al obtener productos: ${error.message}` });
  }
};

// Controlador para obtener un producto por ID
export const getProductById = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (product) {
      res.status(HttpStatus.OK).json(product);
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado.` });
    }
  } catch (error) {
    console.error(
      `Error al obtener el producto con ID ${pid}: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error interno al obtener el producto" });
  }
};

// Controlador para agregar un nuevo producto
export const addProduct = async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);
    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    console.error(`Error al agregar el producto: ${error.message}`);
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Error al agregar el producto" });
  }
};

// Controlador para actualizar un producto por ID
export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    if (updatedProduct) {
      res.status(HttpStatus.OK).json(updatedProduct);
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado.` });
    }
  } catch (error) {
    console.error(
      `Error al actualizar el producto con ID ${pid}: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error interno al actualizar el producto" });
  }
};

// Controlador para eliminar un producto por ID
export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const deletedProduct = await productManager.deleteProduct(pid);
    if (deletedProduct) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Producto eliminado correctamente" });
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado.` });
    }
  } catch (error) {
    console.error(
      `Error al eliminar el producto con ID ${pid}: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error interno al eliminar el producto" });
  }
};
