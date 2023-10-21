import express from "express";
const router = express.Router();

import {
  createProject,
  getAllCustomerProjects,
  getAllProjects,
  getProjectById,
} from "../controllers/projects";

router.put("/projects-items", createProject);
router.get("/projects-items/:customer_id", getAllCustomerProjects);
router.get("/projects-items", getAllProjects);
router.post("/projects-items/:project_id", getProjectById);

export default router;
