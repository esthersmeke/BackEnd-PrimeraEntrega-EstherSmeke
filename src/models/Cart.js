// src/models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // ID numérico adicional
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

export const Cart = mongoose.model("Cart", cartSchema);
