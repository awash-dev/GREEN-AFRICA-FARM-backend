import { Request, Response } from "express";
import { getDatabase } from "../config/database";
import { Product, PaginationParams } from "../types/index";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response";
import { AppError } from "../middleware/errorHandler";

export async function getAllProducts(req: Request, res: Response) {
  const db = await getDatabase();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  // Filtering parameters
  const category = req.query.category as string;
  const minPrice = req.query.minPrice
    ? parseFloat(req.query.minPrice as string)
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice as string)
    : undefined;
  const search = req.query.search as string;

  // Build dynamic query
  let whereClause = "";
  const params: any[] = [];
  const conditions: string[] = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }

  if (minPrice !== undefined) {
    conditions.push("price >= ?");
    params.push(minPrice);
  }

  if (maxPrice !== undefined) {
    conditions.push("price <= ?");
    params.push(maxPrice);
  }

  if (search) {
    conditions.push("(name LIKE ? OR description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
  const countResult = await db.get(countQuery, params);
  const total = countResult.total;

  // Get paginated products
  const query = `
    SELECT * FROM products 
    ${whereClause}
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
  const products = await db.all(query, [...params, limit, offset]);

  return paginatedResponse(res, products, page, limit, total);
}

export async function getProductById(req: Request, res: Response) {
  const db = await getDatabase();
  const { id } = req.params;

  const product = await db.get("SELECT * FROM products WHERE id = ?", [id]);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return successResponse(res, product);
}

export async function createProduct(req: Request, res: Response) {
  const db = await getDatabase();
  const {
    name,
    description,
    description_am,
    description_om,
    price,
    stock,
    category,
    image_base64,
  } = req.body;

  const result = await db.run(
    `INSERT INTO products (name, description, description_am, description_om, price, stock, category, image_base64) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description || null,
      description_am || null,
      description_om || null,
      price,
      stock,
      category || null,
      image_base64 || null,
    ]
  );

  const newProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    result.lastID,
  ]);

  return successResponse(res, newProduct, "Product created successfully", 201);
}

export async function updateProduct(req: Request, res: Response) {
  const db = await getDatabase();
  const { id } = req.params;
  const {
    name,
    description,
    description_am,
    description_om,
    price,
    stock,
    category,
    image_base64,
  } = req.body;

  // Check if product exists
  const existingProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    id,
  ]);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  // Build dynamic update query
  const updates: string[] = [];
  const params: any[] = [];

  if (name !== undefined) {
    updates.push("name = ?");
    params.push(name);
  }

  if (description !== undefined) {
    updates.push("description = ?");
    params.push(description);
  }

  if (description_am !== undefined) {
    updates.push("description_am = ?");
    params.push(description_am);
  }

  if (description_om !== undefined) {
    updates.push("description_om = ?");
    params.push(description_om);
  }

  if (price !== undefined) {
    updates.push("price = ?");
    params.push(price);
  }

  if (stock !== undefined) {
    updates.push("stock = ?");
    params.push(stock);
  }

  if (category !== undefined) {
    updates.push("category = ?");
    params.push(category);
  }

  if (image_base64 !== undefined) {
    updates.push("image_base64 = ?");
    params.push(image_base64);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");

  if (updates.length === 1) {
    // Only updated_at
    throw new AppError("No fields to update", 400);
  }

  params.push(id);

  await db.run(
    `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
    params
  );

  const updatedProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    id,
  ]);

  return successResponse(res, updatedProduct, "Product updated successfully");
}

export async function deleteProduct(req: Request, res: Response) {
  const db = await getDatabase();
  const { id } = req.params;

  // Check if product exists
  const existingProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    id,
  ]);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  await db.run("DELETE FROM products WHERE id = ?", [id]);

  return successResponse(res, null, "Product deleted successfully");
}

export async function getCategories(req: Request, res: Response) {
  const db = await getDatabase();
  const categories = await db.all(
    "SELECT DISTINCT category FROM products WHERE category IS NOT NULL"
  );
  return successResponse(
    res,
    categories.map((c: any) => c.category)
  );
}

export async function getProductStats(req: Request, res: Response) {
  const db = await getDatabase();

  const stats = await db.get(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN stock <= 5 AND stock > 0 THEN 1 ELSE 0 END) as lowStock,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as outOfStock,
            SUM(price * stock) as totalValue
        FROM products
    `);

  return successResponse(res, {
    total: stats.total || 0,
    lowStock: stats.lowStock || 0,
    outOfStock: stats.outOfStock || 0,
    totalValue: stats.totalValue || 0,
  });
}
