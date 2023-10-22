import express from "express";
const router = express.Router();

import { auth } from "../middleware/auth";
import {
  getRoles,
  getItemStatuses,
  getQtStatuses,
  getTechnologies,
  getMaterials,
  getSurfaceFinishes,
} from "../controllers/constraint";

router.get("/constraints/roles", getRoles);

router.get("/constraints/item-statuses", auth, getItemStatuses);
router.get("/constraints/qt-statuses", auth, getQtStatuses);

router.get("/constraints/technologies", auth, getTechnologies);
router.get("/constraints/materials", auth, getMaterials);
router.get("/constraints/surface-finishes", auth, getSurfaceFinishes);

export default router;
