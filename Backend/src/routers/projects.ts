import express from "express";
const router = express.Router();

import { auth, authCustomer, authSupplier } from "../middleware/auth";
import {
  validateIdInParam,
  validateCreateProject,
  validateUpdateProject,
} from "../validators/projects";
import { validation as checkValid } from "../middleware/checkValid";
import {
  createProject,
  getAllCustomerProjects,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject,
  deleteItem,
} from "../controllers/projects";

router.put(
  "/projects-items",
  authCustomer,
  validateCreateProject,
  checkValid,
  createProject
);
router.get(
  "/projects-items/:customer_id",
  authCustomer,
  validateIdInParam,
  checkValid,
  getAllCustomerProjects
);
router.get("/projects-items", authSupplier, getAllProjects);
router.post(
  "/projects-items/:project_id",
  auth,
  validateIdInParam,
  checkValid,
  getProjectById
);
router.delete(
  "/projects-items/:project_id",
  authCustomer,
  validateIdInParam,
  checkValid,
  deleteProject
);
router.patch(
  "/projects-items/:project_id",
  authCustomer,
  validateIdInParam,
  validateUpdateProject,
  checkValid,
  updateProject
);

router.delete(
  "/items/:item_id",
  authCustomer,
  validateIdInParam,
  checkValid,
  deleteItem
);

export default router;
