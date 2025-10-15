import express from "express";
import { authMiddleware, sellerAuthenticate } from "../middleware/auth.middleware.js";

import { cancelOrder, createOrder, getAllOrders, getSingleOrder, updateOrder, deleteOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getSingleOrder);
router.put("/:id", authMiddleware, sellerAuthenticate, updateOrder);
router.delete("/:id/cancel", authMiddleware, cancelOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;