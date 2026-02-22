
import mongoose from "mongoose";
import Product from "./src/models/Product";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://su1401168_db_user:8mSmhSKNi942yQgA@cluster0.wsfbqpf.mongodb.net/";
const PUBLIC_DIR = path.join(__dirname, "..", "frontend", "public");

async function seedImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.error(`Public directory not found at: ${PUBLIC_DIR}`);
            process.exit(1);
        }

        const files = fs.readdirSync(PUBLIC_DIR)
            .filter(f => f.toLowerCase().startsWith("photo_") && (f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".jpeg")))
            .sort();

        console.log(`Found ${files.length} images starting with 'photo_'`);

        // We'll keep the existing 10 products but update their images, 
        // and then add more if there are more images.

        const existingProducts = await Product.find({}).sort({ created_at: 1 });
        console.log(`Current product count: ${existingProducts.length}`);

        // Update existing
        for (let i = 0; i < existingProducts.length; i++) {
            if (i < files.length) {
                const filePath = path.join(PUBLIC_DIR, files[i]);
                const imageBuffer = fs.readFileSync(filePath);
                const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

                existingProducts[i].image_base64 = base64Image;
                await existingProducts[i].save();
                console.log(`Updated existing product: ${existingProducts[i].name}`);
            }
        }

        // Create new products for remaining images
        if (files.length > existingProducts.length) {
            console.log(`Creating ${files.length - existingProducts.length} new products...`);
            for (let i = existingProducts.length; i < files.length; i++) {
                const filePath = path.join(PUBLIC_DIR, files[i]);
                const imageBuffer = fs.readFileSync(filePath);
                const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

                const newProduct = new Product({
                    name: `Premium Harvest ${i + 1}`,
                    description: "Freshly harvested premium organic produce from the Ethiopian Highlands. 100% natural and chemical-free.",
                    price: Math.floor(Math.random() * 500) + 50,
                    stock: Math.floor(Math.random() * 100) + 10,
                    category: "Fruits",
                    image_base64: base64Image,
                    unit: "kg",
                    origin: "Ethiopian Highlands"
                });

                await newProduct.save();
                console.log(`Created new product: ${newProduct.name}`);
            }
        }

        console.log("Seeding completed successfully. Total products now in DB: " + (await Product.countDocuments()));
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding images:", error);
        process.exit(1);
    }
}

seedImages();
