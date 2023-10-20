import express from "express";
const router = express.Router();

import {
  getRoles,
  getItemStatuses,
  getQtStatuses,
  getTechnologies,
  getMaterials,
  getSurfaceFinishes,
} from "../controllers/constraint";

router.get("/constraints/roles", getRoles);

router.get("/constraints/item-statuses", getItemStatuses);
router.get("/constraints/qt-statuses", getQtStatuses);

router.get("/constraints/technologies", getTechnologies);
router.get("/constraints/materials", getMaterials);
router.get("/constraints/surface-finishes", getSurfaceFinishes);

export default router;
