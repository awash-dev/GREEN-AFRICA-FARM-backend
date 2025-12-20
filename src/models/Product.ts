import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  description_am?: string;
  description_om?: string;
  price: number;
  stock: number;
  unit?: string;
  origin?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    description_am: { type: String },
    description_om: { type: String },
    price: { type: Number, required: true, min: 0, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, index: true },
    image_base64: { type: String },
    unit: { type: String, default: "unit" },
    origin: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Search index for text-based search
ProductSchema.index({ name: "text", description: "text" });

// To match the frontend expected 'id' field instead of '_id'
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
