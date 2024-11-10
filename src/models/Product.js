import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: { type: String, unique: true },
  price: Number,
  stock: Number,
  category: String,
  status: Boolean,
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);
export const Product = mongoose.model("Product", productSchema);
