// src/controllers/productController.js

import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { HttpStatus } from "../utils/constants.js";
import mongoose from "mongoose";

// Controlador para obtener todos los productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res, next) => {
  const { limit = 10, page = 1, sort = "asc", query = "" } = req.query;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

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
      status: "success",
      payload: productsData.docs,
      totalDocs: productsData.totalDocs,
      docsCount: productsData.docs.length,
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      page: productsData.page,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.json(response);
    } else {
      res.render("home", response);
    }
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    next(error); // Pasamos el error directamente
  }
};

// Controlador para obtener un producto por ID y renderizar la vista de detalles
export const getProductById = async (req, res, next) => {
  const { pid } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "El ID proporcionado no es válido.",
      };
    }

    const product = await Product.findById(pid).lean();

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ products: [] });
    }

    if (product) {
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        res.json({ product, cartId: cart._id });
      } else {
        res.render("productDetail", { product, cartId: cart._id });
      }
    } else {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Producto con ID ${pid} no encontrado`,
      };
    }
  } catch (error) {
    console.error(
      `Error al cargar el producto con ID ${pid}: ${error.message}`
    );
    next(error); // Pasamos el error directamente
  }
};

// Controlador para agregar un nuevo producto
export const addProduct = async (req, res, next) => {
  const requiredFields = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: `Error al agregar el producto. El campo '${missingFields.join(
        ", "
      )}' es obligatorio.`,
    });
  }

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
      next(error); // Pasamos el error directamente
    }
  }
};

// Controlador para actualizar un producto por ID
export const updateProduct = async (req, res, next) => {
  const { pid } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "El ID proporcionado no es válido.",
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
      new: true,
    });
    if (updatedProduct) {
      res.status(HttpStatus.OK).json(updatedProduct);
    } else {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Producto con ID ${pid} no encontrado.`,
      };
    }
  } catch (error) {
    console.error(
      `Error al actualizar el producto con ID ${pid}: ${error.message}`
    );
    next(error); // Pasamos el error directamente
  }
};

// Controlador para eliminar un producto por ID
export const deleteProduct = async (req, res, next) => {
  const { pid } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "El ID proporcionado no es válido.",
      };
    }

    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (deletedProduct) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Producto eliminado correctamente" });
    } else {
      throw {
        status: HttpStatus.NOT_FOUND,
        message: `Producto con ID ${pid} no encontrado.`,
      };
    }
  } catch (error) {
    console.error(
      `Error al eliminar el producto con ID ${pid}: ${error.message}`
    );
    next(error); // Pasamos el error directamente
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
