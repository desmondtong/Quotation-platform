import express from "express";
const router = express.Router();

import {
  createProject,
  getAllCustomerProjects,
  getAllProjects,
} from "../controllers/projects";

router.put("/projects-items", createProject);
router.get("/projects-items/:customer_id", getAllCustomerProjects);
router.get("/projects-items", getAllProjects);

export default router;
