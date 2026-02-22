
import mongoose from "mongoose";
import Product from "./src/models/Product";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/green_africa_farm";

async function listProducts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        const products = await Product.find({});
        console.log(`Found ${products.length} products:`);
        products.forEach((p: any) => {
            console.log(`- ${p.name} (ID: ${p._id}, Category: ${p.category})`);
        });
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

listProducts();
