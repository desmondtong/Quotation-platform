import express from "express";
const router = express.Router();

import {
  createProject,
  getAllCustomerProjects,
  getAllProjects,
  getProjectById,
  deleteProject,
} from "../controllers/projects";

router.put("/projects-items", createProject);
router.get("/projects-items/:customer_id", getAllCustomerProjects);
router.get("/projects-items", getAllProjects);
router.post("/projects-items/:project_id", getProjectById);
router.delete("/projects-items/:project_id", deleteProject);

export default router;
