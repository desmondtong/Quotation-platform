import express from "express";
const router = express.Router();

import {
  createQuotation,
  deleteQtItem,
  deleteQuotation,
  getAllSupplierQuotations,
  getQuotationsByProjectId,
  updateQuotation,
} from "../controllers/quotations";

router.put("/quotations-items", createQuotation);
router.get("/quotations-items/:supplier_id", getAllSupplierQuotations);
router.post("/quotations-items/:project_id", getQuotationsByProjectId);
router.delete("/quotations-items/:quotation_id", deleteQuotation);
router.patch("/quotations-items/:quotation_id", updateQuotation);

router.delete("/qt_items/:qt_item_id", deleteQtItem);

export default router;
