import express from "express";
const router = express.Router();

import { createProject } from "../controllers/projects";

router.put("/projects-items", createProject);

export default router;
