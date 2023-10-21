import { body, check, param } from "express-validator";

const validateIdInParam = [
  param("project_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
  param("item_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
  param("customer_id", "invalid id").optional().isLength({ min: 1, max: 10 }),
];

const validateCreateProject = [
  body("customer_id", "customer id is required")
    .notEmpty()
    .isLength({ min: 1, max: 10 }),
  body("project_name", "project name is required").notEmpty().isString(),
  
  check("items", "items must be an array").notEmpty().isArray(),
  check("items.*.technology", "technology is required").notEmpty().isString(),
  check("items.*.material", "material is required").notEmpty().isString(),
  check("items.*.surface_finish", "surface finish is required")
    .notEmpty()
    .isString(),
  check("items.*.item_name", "item name is required").notEmpty().isString(),
  check("items.*.quantity", "quantity is required").notEmpty().isInt(),
];

const validateUpdateProject = [
  body("project_name", "project name must be string")
    .optional()
    .notEmpty()
    .isString(),
  body("is_active", "is_active must be a boolean")
    .optional()
    .notEmpty()
    .isBoolean(),

  check("items", "items must be an array").optional().isArray(),
  check("items.*.item_id", "item ID must be integer").optional().notEmpty().isInt(),
  check("items.*.technology", "technology must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("items.*.material", "material must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("items.*.surface_finish", "surface finish must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("items.*.item_name", "item name must be string")
    .optional()
    .notEmpty()
    .isString(),
  check("items.*.quantity", "quantity must be integer")
    .optional()
    .notEmpty()
    .isInt(),
  check("items.*.status", "status must be string")
    .optional()
    .notEmpty()
    .isString(),
];

export { validateIdInParam, validateCreateProject, validateUpdateProject };
