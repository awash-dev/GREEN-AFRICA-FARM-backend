import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongoDB } from "./src/config/mongodb";
import productRoutes from "./src/routes/products";
import teamRoutes from "./src/routes/team";
import orderRoutes from "./src/routes/orderRoutes";
import { errorHandler } from "./src/middleware/errorHandler";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Green Africa Farm API (MongoDB)",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      team: "/api/team",
      orders: "/api/orders",
    },
  });
});

app.use("/api/products", productRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectMongoDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Products API: http://localhost:${port}/api/products`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
