import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, price, stock } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new AppError(
      "Product name is required and must be a non-empty string",
      400
    );
  }

  if (price === undefined || typeof price !== "number" || price < 0) {
    throw new AppError(
      "Price is required and must be a non-negative number",
      400
    );
  }

  if (
    stock === undefined ||
    typeof stock !== "number" ||
    stock < 0 ||
    !Number.isInteger(stock)
  ) {
    throw new AppError(
      "Stock is required and must be a non-negative integer",
      400
    );
  }

  // Validate base64 image if provided
  if (req.body.image_base64) {
    const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
    if (!base64Regex.test(req.body.image_base64)) {
      throw new AppError(
        "Invalid image format. Must be base64 encoded image (png, jpg, jpeg, gif, or webp)",
        400
      );
    }

    // Check image size (limit to 5MB)
    const base64Length = req.body.image_base64.length;
    const sizeInBytes = (base64Length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 5) {
      throw new AppError("Image size must not exceed 5MB", 400);
    }
  }

  next();
}

export function validateProductUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, price, stock } = req.body;

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length === 0)
  ) {
    throw new AppError("Product name must be a non-empty string", 400);
  }

  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    throw new AppError("Price must be a non-negative number", 400);
  }

  if (
    stock !== undefined &&
    (typeof stock !== "number" || stock < 0 || !Number.isInteger(stock))
  ) {
    throw new AppError("Stock must be a non-negative integer", 400);
  }

  // Validate image if provided (allows both base64 and URLs)
  if (req.body.image_base64) {
    const isBase64 = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(
      req.body.image_base64
    );
    const isUrl = /^https?:\/\//.test(req.body.image_base64);

    if (!isBase64 && !isUrl) {
      throw new AppError(
        "Invalid image format. Must be a base64 encoded image or a valid URL",
        400
      );
    }

    if (isBase64) {
      // Check image size (limit to 5MB for base64 strings)
      const base64Length = req.body.image_base64.length;
      const sizeInBytes = (base64Length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 5) {
        throw new AppError("Image size must not exceed 5MB", 400);
      }
    }
  }

  next();
}

export function validatePagination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1) {
    throw new AppError("Page must be greater than 0", 400);
  }

  if (limit < 1 || limit > 100) {
    throw new AppError("Limit must be between 1 and 100", 400);
  }

  req.query.page = page.toString();
  req.query.limit = limit.toString();

  next();
}
