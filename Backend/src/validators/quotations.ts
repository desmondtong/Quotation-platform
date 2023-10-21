import { body, check, param } from "express-validator";

const validateIdInParam = [
  param("supplier_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
  param("project_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
  param("quotation_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
  param("qt_item_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
];

const validateCreateQuotation = [
  body("supplier_id", "supplier id is required")
    .notEmpty()
    .isLength({ min: 1, max: 10 }),
  body("project_id", "project id is required")
    .notEmpty()
    .isLength({ min: 1, max: 10 }),

  check("qt_items", "qt_items must be an array").notEmpty().isArray(),
  check("qt_items.*.technology", "technology is required")
    .notEmpty()
    .isString(),
  check("qt_items.*.material", "material is required").notEmpty().isString(),
  check("qt_items.*.surface_finish", "surface finish is required")
    .notEmpty()
    .isString(),
  check("qt_items.*.item_name", "item name is required").notEmpty().isString(),
  check("qt_items.*.quantity", "quantity is required").notEmpty().isInt(),
  check("qt_items.*.unit_price", "unit price is required")
    .notEmpty()
    .isDecimal(),
];

const validateUpdateQuotation = [
  body("status", "status must be string").optional().notEmpty().isString(),

  check("qt_items", "qt_items must be an array").optional().isArray(),
  check("qt_items.*.qt_item_id", "quote item ID must be integer")
    .optional()
    .notEmpty()
    .isInt(),
  check("qt_items.*.technology", "technology must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("qt_items.*.material", "material must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("qt_items.*.surface_finish", "surface finish must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("qt_items.*.item_name", "item name must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("qt_items.*.quantity", "quantity must be integer")
    .optional()
    .notEmpty()
    .isInt(),
  check("qt_items.*.unit_price", "unit price must be a decimal number")
    .optional()
    .notEmpty()
    .isDecimal(),
];

export { validateIdInParam, validateCreateQuotation, validateUpdateQuotation };
