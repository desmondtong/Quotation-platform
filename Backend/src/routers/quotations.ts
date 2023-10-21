import express from "express";
const router = express.Router();

import {
  createQuotation,
  getAllSupplierQuotations,
} from "../controllers/quotations";

router.put("/quotations-items", createQuotation);
router.get("/quotations-items/:supplier_id", getAllSupplierQuotations);
// router.get("/quotations-items", getAllquotations);
// router.post("/quotations-items/:project_id", getProjectById);
// router.delete("/quotations-items/:project_id", deleteProject);
// router.patch("/quotations-items/:project_id", updateProject);

// router.delete("/items/:item_id", deleteItem);

export default router;
