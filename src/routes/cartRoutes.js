// src/routes/cartRoutes.js
import { Router } from "express";
import * as cartController from "../controllers/cartController.js";

const router = Router();

router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/products/:pid", cartController.addProductToCart);
router.delete("/:cid/products/:pid", cartController.removeProductFromCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.clearCart);

export default router;
