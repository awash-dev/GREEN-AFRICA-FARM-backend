import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Product from "./src/models/Product";
import { connectMongoDB } from "./src/config/mongodb";
import { cloudinary } from "./src/config/cloudinary";

process.env.DOTENV_KEY = "";
dotenv.config();

const productsToSeed = [
    {
        "_id": "6996e96625529c78611f5401",
        "name": "Lemon",
        "name_am": "ሎሚ",
        "name_om": "Loomii",
        "price": 2000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5402",
        "name": "Lime",
        "name_am": "ሎሚ አረንጓዴ",
        "name_om": "Loomii magariisaa",
        "price": 2000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5403",
        "name": "Apple",
        "name_am": "ፖም",
        "name_om": "Appilii",
        "price": 300,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5404",
        "name": "Banana",
        "name_am": "ሙዝ",
        "name_om": "Muuzii",
        "price": 200,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5405",
        "name": "Orange",
        "name_am": "ብርቱካን",
        "name_om": "Burtukaana",
        "price": 2000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5406",
        "name": "Mango",
        "name_am": "ማንጎ",
        "name_om": "Mangoo",
        "price": 400,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5407",
        "name": "Papaya",
        "name_am": "ፓፓያ",
        "name_om": "Paappaayaa",
        "price": 400,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5408",
        "name": "Avocado",
        "name_am": "አቮካዶ",
        "name_om": "Avokaadoo",
        "price": 400,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5409",
        "name": "Grape",
        "name_am": "ወይን",
        "name_om": "Wayinii",
        "price": 6000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5410",
        "name": "Watermelon",
        "name_am": "ሐብሐብ",
        "name_om": "Bishaankii",
        "price": 0,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5411",
        "name": "Peach",
        "name_am": "ፒች",
        "name_om": "Peechii",
        "price": 2700,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5412",
        "name": "Pear",
        "name_am": "ፒር",
        "name_om": "Peerii",
        "price": 600,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5413",
        "name": "Plum",
        "name_am": "ፕለም",
        "name_om": "Plamii",
        "price": 400,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5414",
        "name": "Strawberry",
        "name_am": "እንጆሪ",
        "name_om": "Istiroobarii",
        "price": 200,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5415",
        "name": "Blueberry",
        "name_am": "ብሉቤሪ",
        "name_om": "Buluuberii",
        "price": 6000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5416",
        "name": "Raspberry",
        "name_am": "ራስቤሪ",
        "name_om": "Raasberii",
        "price": 6000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5417",
        "name": "Blackberry",
        "name_am": "ብላክቤሪ",
        "name_om": "Bilaakberii",
        "price": 6000,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5418",
        "name": "Pomegranate",
        "name_am": "ሮማን",
        "name_om": "Roomaanii",
        "price": 500,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5419",
        "name": "Passion fruit",
        "name_am": "ፓሽን ፍሩት",
        "name_om": "Paashan furuutii",
        "price": 800,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5420",
        "name": "Dragon fruit",
        "name_am": "ድራጎን ፍሩት",
        "name_om": "Diraagon furuutii",
        "price": 1200,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5421",
        "name": "Tangerine",
        "name_am": "ቴንጀሪን",
        "name_om": "Mandariinii",
        "price": 800,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5424",
        "name": "Apple Mango",
        "name_am": "አፕል ማንጎ",
        "name_om": "Appilii Mangoo",
        "price": 400,
        "stock": 100,
        "category": "Fruits",
        "origin": "Ethiopia",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    },
    {
        "_id": "6996e96625529c78611f5426",
        "name": "Coffee",
        "name_am": "ቡና",
        "name_om": "Buna",
        "price": 200,
        "stock": 5000,
        "category": "Beverage",
        "origin": "Kaffa",
        "unit": "kg",
        "created_at": new Date("2026-02-22T10:00:00.000Z"),
        "updated_at": new Date("2026-02-22T10:00:00.000Z"),
    }
];

async function seed() {
    try {
        await connectMongoDB();
        console.log("Connected to MongoDB for seeding...");

        // Remove empty string description fields since they are not in schema anymore
        // and format the data
        const formattedProducts = productsToSeed.map(p => {
            // Find matching image
            const imageFileName = `${p.name.toLowerCase().replace(/\s/g, '_')}.png`; // Replace spaces for file names
            const localImagePath = path.join(__dirname, "public", imageFileName);
            let hasLocalImage = fs.existsSync(localImagePath);

            return {
                _id: new mongoose.Types.ObjectId(p._id),
                name: p.name,
                name_am: p.name_am,
                name_om: p.name_om,
                price: p.price,
                stock: p.stock,
                category: p.category,
                origin: p.origin,
                unit: p.unit,
                created_at: p.created_at,
                updated_at: p.updated_at,
                localImagePath: hasLocalImage ? localImagePath : null
            }
        });

        for (const productData of formattedProducts) {
            let imageUrl = undefined;

            if (productData.localImagePath) {
                console.log(`Uploading image for ${productData.name}...`);
                try {
                    const uploadResult = await cloudinary.uploader.upload(productData.localImagePath, {
                        folder: "green_africa_farm_products",
                        transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }]
                    });
                    imageUrl = uploadResult.secure_url;
                } catch (e) {
                    console.error(`Failed to upload image for ${productData.name}`, e);
                }
            }

            // Prepare final upsert object
            const upsertData: any = { ...productData };
            delete upsertData.localImagePath; // don't save this to DB
            if (imageUrl) {
                upsertData.image_url = imageUrl;
                upsertData.image_base64 = ""; // Clear old base64 if uploading new image
            }

            await Product.findByIdAndUpdate(upsertData._id, upsertData, { upsert: true, new: true, runValidators: true });
            console.log(`Upserted ${upsertData.name} ${imageUrl ? '(with image)' : ''}`);
        }

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
