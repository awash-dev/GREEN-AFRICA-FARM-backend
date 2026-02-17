import { Request, Response } from "express";
import Order from "../models/Order";
import { v4 as uuidv4 } from "uuid";

export const orderController = {
    createOrder: async (req: Request, res: Response) => {
        try {
            const { customer, items, total } = req.body;

            // Generate a shorter, human-readable order ID for Ethiopia (e.g. GAF-7821)
            const shortId = Math.floor(1000 + Math.random() * 9000);
            const orderId = `GAF-${shortId}`;

            const newOrder = new Order({
                orderId,
                customer,
                items,
                total
            });

            const savedOrder = await newOrder.save();
            res.status(201).json({
                success: true,
                data: {
                    orderId: savedOrder.orderId,
                    _id: savedOrder._id
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getAllOrders: async (req: Request, res: Response) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: orders });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateOrderStatus: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
            res.status(200).json({ success: true, data: updatedOrder });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
