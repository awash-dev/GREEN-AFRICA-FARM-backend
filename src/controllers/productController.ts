import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import { successResponse, paginatedResponse } from "../utils/response";
import { AppError } from "../middleware/errorHandler";
import { validationResult } from "express-validator";

// Enhanced in-memory cache with support for multiple queries
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300 * 1000; // 5 minutes
const CATEGORY_CACHE_TTL = 600 * 1000; // 10 minutes

export async function getAllProducts(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Cache key based on query parameters
  const cacheKey = JSON.stringify(req.query);
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  // Filtering parameters
  const category = req.query.category as string;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const search = req.query.search as string;

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
    const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(sanitizedSearch, "i");
    query.$or = [
      { name: searchRegex },
      { name_am: searchRegex },
      { name_om: searchRegex },
      { category: searchRegex },
    ];
  }

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  // Adjust products for frontend
  const formattedProducts = products.map((p: any) => {
    return {
      ...p,
      id: p._id.toString(),
      _id: p._id.toString()
    };
  });

  // Build response data
  const responseData = {
    success: true,
    data: formattedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };

  // Cache the query result
  queryCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

  return res.status(200).json(responseData);
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID format", 400);
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const formattedProduct = {
    ...product,
    id: (product._id as any).toString()
  };

  return successResponse(res, formattedProduct);
}

export async function createProduct(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const productData = { ...req.body };

  // Prioritize image_base64 by clearing image_url if provided
  if (productData.image_base64) {
    productData.image_url = "";
  }

  // Ensure price and stock are numbers
  if (productData.price) productData.price = Number(productData.price);
  if (productData.stock) productData.stock = Number(productData.stock);

  const newProduct = await Product.create(productData);

  queryCache.clear(); // Invalidate all query caches
  return successResponse(res, newProduct, "Product created successfully", 201);
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid product ID format", 400);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const updateData = { ...req.body };

  // Remove fields that shouldn't be updated directly
  delete updateData._id;
  delete updateData.id;

  // Ensure price and stock are updated correctly from body
  // Ensure image_base64 is handled and prioritize it
  if (req.body.image_base64) {
    updateData.image_base64 = req.body.image_base64;
    updateData.image_url = "";
  }

  // Ensure we don't accidentally remove _id if it's sent
  delete updateData._id;

  // Ensure numerical fields are numbers
  if (updateData.price !== undefined) updateData.price = Number(updateData.price);
  if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new AppError("Product not found", 404);
  }

  queryCache.clear(); // Invalidate all query caches
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

  queryCache.clear(); // Invalidate all query caches
  return successResponse(res, null, "Product deleted successfully");
}

export async function getCategories(req: Request, res: Response) {
  const cacheKey = 'categories';
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CATEGORY_CACHE_TTL) {
    return res.json(cached.data);
  }

  const categories = await Product.distinct("category", {
    category: { $ne: null },
  });

  const responseData = { success: true, data: categories };
  queryCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

  return res.status(200).json(responseData);
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