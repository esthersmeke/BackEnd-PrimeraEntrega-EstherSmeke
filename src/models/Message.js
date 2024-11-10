import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
