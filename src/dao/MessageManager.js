// src/dao/MessageManager.js
import { Message } from "../models/Message.js";

export class MessageManager {
  async getMessages() {
    return await Message.find();
  }

  async addMessage(data) {
    const newMessage = new Message(data);
    return await newMessage.save();
  }
}
