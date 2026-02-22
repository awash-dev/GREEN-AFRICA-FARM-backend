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

// Validation for product creation
const productCreateValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").optional().isString(),
  body("name_am").optional().isString(),
  body("name_om").optional().isString(),
];

// Validation for product update (all fields optional)
const productUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").optional().isString(),
  body("name_am").optional().isString(),
  body("name_om").optional().isString(),
];

router.get("/", asyncHandler(getAllProducts));
router.get("/categories", asyncHandler(getCategories));
router.get("/stats", asyncHandler(getProductStats));
router.get("/:id", asyncHandler(getProductById));
router.post("/", productCreateValidation, asyncHandler(createProduct));
router.put("/:id", productUpdateValidation, asyncHandler(updateProduct));
router.delete("/:id", asyncHandler(deleteProduct));

export default router;