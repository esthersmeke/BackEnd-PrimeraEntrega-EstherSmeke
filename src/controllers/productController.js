// src/controllers/productController.js

import { Cart } from "../models/Cart.js"; // Importa el modelo del carrito
import { Product } from "../models/Product.js";
import { HttpStatus } from "../utils/constants.js";
import mongoose from "mongoose"; // Importa mongoose para validaciones de ID

// Controlador para obtener todos los productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  try {
    // Obtener o crear un carrito para el usuario
    let cart = await Cart.findOne(); // Ajusta esto según la lógica de usuario
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    // Configuración de paginación y filtros
    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort:
        sort === "asc"
          ? { price: 1 }
          : sort === "desc"
          ? { price: -1 }
          : undefined,
      lean: true,
    };
    const filter = query
      ? {
          $or: [
            { title: new RegExp(query, "i") },
            { category: new RegExp(query, "i") },
          ],
        }
      : {};

    const productsData = await Product.paginate(filter, options);
    const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl
      .split("?")
      .shift()}`;
    const prevLink = productsData.hasPrevPage
      ? `${baseUrl}?page=${productsData.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;
    const nextLink = productsData.hasNextPage
      ? `${baseUrl}?page=${productsData.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
      : null;

    const response = {
      status: "success", // o "error" en caso de fallos
      payload: productsData.docs, // resultado de los productos paginados
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      page: productsData.page,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: prevLink, // enlace a la página anterior, si existe
      nextLink: nextLink, // enlace a la página siguiente, si existe
    };

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // Responder en JSON para solicitudes de API como en Postman
      res.json(response);
    } else {
      // Renderizar la vista para solicitudes en el navegador
      res.render("home", response);
    }
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al obtener productos" });
  }
};

// Controlador para obtener un producto por ID y renderizar la vista de detalles
export const getProductById = async (req, res) => {
  const { pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "El ID proporcionado no es válido." });
  }

  try {
    const product = await Product.findById(pid).lean();

    // Obtener o crear un carrito para el usuario
    let cart = await Cart.findOne(); // Ajusta esto según la lógica de usuario
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    if (product) {
      res.render("productDetail", { product, cartId: cart._id }); // Pasamos el `cartId`
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: `Producto con ID ${pid} no encontrado` });
    }
  } catch (error) {
    console.error(
      `Error al cargar el producto con ID ${pid}: ${error.message}`
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error al cargar el producto" });
  }
};

// Controlador para agregar un nuevo producto
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    if (error.code === 11000) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error:
          "El código del producto ya existe. Por favor, utiliza un código único.",
      });
    } else {
      console.error(`Error al agregar el producto: ${error.message}`);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Error al agregar el producto" });
    }
  }
};

// Controlador para actualizar un producto por ID
export const updateProduct = async (req, res) => {
  const { pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "El ID proporcionado no es válido." });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
      new: true,
    });
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

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "El ID proporcionado no es válido." });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(pid);
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

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
