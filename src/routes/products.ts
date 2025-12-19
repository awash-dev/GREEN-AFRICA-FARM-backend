import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductStats,
} from "../controllers/productController";
import { asyncHandler } from "../middleware/errorHandler";
import { body } from "express-validator";

const router = Router();

// Validation for product creation/update
const productValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").optional().isString(),
  body("description").optional().isString(),
  body("description_am").optional().isString(),
  body("description_om").optional().isString(),
  body("image_base64").optional().isString(),
];

router.get("/", asyncHandler(getAllProducts));
router.get("/categories", asyncHandler(getCategories));
router.get("/stats", asyncHandler(getProductStats)); // New stats route
router.get("/:id", asyncHandler(getProductById));
router.post("/", productValidation, asyncHandler(createProduct));
router.put("/:id", productValidation, asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(deleteProduct));

export default router;
