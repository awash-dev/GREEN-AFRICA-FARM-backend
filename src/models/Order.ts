import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    orderId: string;
    customer: {
        fullName: string;
        phone: string;
        address: string;
        region: string;
        notes?: string;
    };
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    orderId: { type: String, required: true, unique: true },
    customer: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        region: { type: String, required: true },
        notes: { type: String }
    },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
