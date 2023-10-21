import { body, param } from "express-validator";

const validateIdInParam = [
  param("user_id", "invalid id").isLength({ min: 1, max: 10 }),
];

const validateRegistrationData = [
  body("name", "name is required").notEmpty().isString(),
  body("company", "company is required").notEmpty().isString(),
  body("email", "valid email is required").notEmpty().isEmail(),
  body("password", "password is invalid")
    .notEmpty()
    .isString()
    .isLength({ min: 8, max: 50 }),
  body("phone_number", "phone number is required")
    .notEmpty()
    .isLength({ min: 8, max: 8 }),
  body("role", "role is required").notEmpty().isString().isUppercase(),
];

const validateLoginData = [
  body("email", "email is invalid").notEmpty().isEmail(),
  body("password", "password is required").notEmpty().isString(),
];

export { validateIdInParam, validateRegistrationData, validateLoginData };
