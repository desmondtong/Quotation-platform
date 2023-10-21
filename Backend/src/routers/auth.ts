import express from "express";
const router = express.Router();

import {
  validateIdInParam,
  validateLoginData,
  validateRegistrationData,
} from "../validators/auth";
import { validation as checkValid } from "../middleware/checkValid";
import { register, login, getUserById } from "../controllers/auth";

router.get("/accounts/:user_id", validateIdInParam, checkValid, getUserById);
router.put("/register", validateRegistrationData, checkValid, register);
router.put("/login", validateLoginData, checkValid, login);

export default router;
