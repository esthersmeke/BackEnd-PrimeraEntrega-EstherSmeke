import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { Product } from "./src/models/Product.js";
import { Cart } from "./src/models/Cart.js";

const mongoURI =
  "mongodb+srv://esthersmeke:coder@cluster0.ayouo.mongodb.net/ecommerceBe1?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

async function importData() {
  try {
    const productsPath = path.resolve("./src/data/products.json");
    const productsData = await fs.readFile(productsPath, "utf-8");
    const products = JSON.parse(productsData);

    // Solo insertar productos que no existan en la base de datos
    for (const product of products) {
      const existingProduct = await Product.findOne({ code: product.code });
      if (!existingProduct) {
        await Product.create(product);
      }
    }

    const cartsPath = path.resolve("./src/data/carts.json");
    const cartsData = await fs.readFile(cartsPath, "utf-8");
    const carts = JSON.parse(cartsData).map((cart) => ({
      ...cart,
      products: cart.products.map((item) => ({
        ...item,
        product: new mongoose.Types.ObjectId(item.product),
      })),
    }));

    await Cart.insertMany(carts);
    console.log("Datos importados correctamente");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error al importar datos:", error);
  }
}

importData();
