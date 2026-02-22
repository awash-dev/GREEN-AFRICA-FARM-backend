import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  name_am?: string;
  name_om?: string;
  price: number;
  category?: string;
  image_url?: string;
  image_base64?: string;
  stock: number;
  unit?: string;
  origin?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    name_am: { type: String, index: true },
    name_om: { type: String, index: true },
    price: { type: Number, required: true, min: 0, index: true },
    category: { type: String, index: true },
    image_url: { type: String },
    image_base64: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: "unit" },
    origin: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Search index for text-based search
ProductSchema.index({ name: "text", name_am: "text", name_om: "text" });

// To match the frontend expected 'id' field instead of '_id'
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    // delete ret._id;
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);