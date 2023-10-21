import express from "express";
const router = express.Router();

import { createProject, getAllCustomerProjects } from "../controllers/projects";

router.put("/projects-items", createProject);
router.get("/projects-items/:customer_id", getAllCustomerProjects);

export default router;
