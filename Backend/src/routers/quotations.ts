import express from "express";
const router = express.Router();

import { authCustomer, authSupplier } from "../middleware/auth";
import {
  validateIdInParam,
  validateCreateQuotation,
  validateUpdateQuotation,
  validateGetQuotation,
} from "../validators/quotations";
import { validation as checkValid } from "../middleware/checkValid";
import {
  createQuotation,
  deleteQtItem,
  deleteQuotation,
  getAllSupplierQuotations,
  getQuotationsByProjectId,
  getQuotationsByCustomerId,
  updateQuotation,
} from "../controllers/quotations";

router.put(
  "/quotations-items",
  authSupplier,
  validateCreateQuotation,
  checkValid,
  createQuotation
);
router.get(
  "/quotations-items/:supplier_id",
  authSupplier,
  validateIdInParam,
  checkValid,
  getAllSupplierQuotations
);
router.post(
  "/quotations-items/project_id",
  authCustomer,
  validateGetQuotation,
  checkValid,
  getQuotationsByProjectId
);
router.post(
  "/quotations-items/customer_id",
  authCustomer,
  validateGetQuotation,
  checkValid,
  getQuotationsByCustomerId
);
router.delete(
  "/quotations-items/:quotation_id",
  authSupplier,
  validateIdInParam,
  checkValid,
  deleteQuotation
);
router.patch(
  "/quotations-items/:quotation_id",
  authSupplier,
  validateIdInParam,
  validateUpdateQuotation,
  checkValid,
  updateQuotation
);

router.delete(
  "/qt_items/:qt_item_id",
  authSupplier,
  validateIdInParam,
  checkValid,
  deleteQtItem
);

export default router;
