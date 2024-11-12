import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true }, // Índice en título
  description: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true, index: true }, // Índice en precio
  stock: { type: Number, required: true },
  category: { type: String, required: true, index: true }, // Índice en categoría
  status: { type: Boolean, default: true },
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model("Product", productSchema);
