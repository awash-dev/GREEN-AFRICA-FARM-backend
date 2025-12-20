import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import { successResponse, paginatedResponse } from "../utils/response";
import { AppError } from "../middleware/errorHandler";
import ProductModel from "../models/Product";

// Simple in-memory cache
let productCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function getAllProducts(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Filtering parameters
  const category = req.query.category as string;
  const minPrice = req.query.minPrice
    ? parseFloat(req.query.minPrice as string)
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice as string)
    : undefined;
  const search = req.query.search as string;

  // Return cached data if available and no query params
  const isDefaultQuery =
    !category &&
    minPrice === undefined &&
    maxPrice === undefined &&
    !search &&
    page === 1 &&
    limit === 10;
  if (
    isDefaultQuery &&
    productCache &&
    Date.now() - productCache.timestamp < CACHE_TTL
  ) {
    return res.json(productCache.data);
  }

  // Build MongoDB query
  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (search) {
    // Use text index search for high performance
    query.$text = { $search: search };
  }

  // Get total count and paginated products
  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .sort(search ? { score: { $meta: "textScore" } } : { created_at: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  const response = paginatedResponse(res, products, page, limit, total);

  // Cache default query result
  if (isDefaultQuery) {
    productCache = { data: (response as any).data, timestamp: Date.now() };
  }

  return response;
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID format", 400);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return successResponse(res, product);
}

export async function createProduct(req: Request, res: Response) {
  const productData = req.body;

  const newProduct = await Product.create(productData);

  productCache = null; // Invalidate cache
  return successResponse(res, newProduct, "Product created successfully", 201);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID format", 400);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...updateData, updated_at: new Date() },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError("Product not found", 404);
  }

  productCache = null; // Invalidate cache
  return successResponse(res, updatedProduct, "Product updated successfully");
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID format", 400);
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new AppError("Product not found", 404);
  }

  productCache = null; // Invalidate cache
  return successResponse(res, null, "Product deleted successfully");
}

export async function getCategories(req: Request, res: Response) {
  const categories = await Product.distinct("category", {
    category: { $ne: null },
  });
  return successResponse(res, categories);
}

export async function getProductStats(req: Request, res: Response) {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        lowStock: {
          $sum: {
            $cond: [
              { $and: [{ $lte: ["$stock", 5] }, { $gt: ["$stock", 0] }] },
              1,
              0,
            ],
          },
        },
        outOfStock: {
          $sum: {
            $cond: [{ $eq: ["$stock", 0] }, 1, 0],
          },
        },
        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
      },
    },
  ]);

  const defaultStats = {
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  };

  return successResponse(res, stats[0] || defaultStats);
}
