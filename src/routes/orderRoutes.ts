import express from "express";
import { orderController } from "../controllers/orderController";

const router = express.Router();

// Public route for placing orders
router.post("/", orderController.createOrder);

// Admin routes (should ideally be protected, but keeping it simple for MVP as requested)
router.get("/", orderController.getAllOrders);
router.put("/:id/status", orderController.updateOrderStatus);

export default router;
