import express from "express";
const router = express.Router();

import { auth, authCustomer, authSupplier } from "../middleware/auth";
import {
  validateIdInParam,
  validateCreateQuotation,
  validateUpdateQuotation,
  validateGetQuotation,
  validateQuotationActions,
} from "../validators/quotations";
import { validation as checkValid } from "../middleware/checkValid";
import {
  createQuotation,
  deleteQuotation,
  getAllSupplierQuotations,
  getQuotationsByItemId,
  getQuotationsByCustomerId,
  updateQuotation,
  getQuotationsByQuotationId,
  declineQuotation,
  acceptQuotation,
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
  "/quotations-items/item_id",
  authCustomer,
  validateGetQuotation,
  checkValid,
  getQuotationsByItemId
);
router.post(
  "/quotations-items/customer_id",
  authCustomer,
  validateGetQuotation,
  checkValid,
  getQuotationsByCustomerId
);
router.post(
  "/quotations-items/quotation_id",
  auth,
  validateGetQuotation,
  checkValid,
  getQuotationsByQuotationId
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
router.patch(
  "/decline-quotation",
  authCustomer,
  validateQuotationActions,
  checkValid,
  declineQuotation
);
router.patch(
  "/accept-quotation",
  authCustomer,
  validateQuotationActions,
  checkValid,
  acceptQuotation
);

// router.delete(
//   "/qt_items/:qt_item_id",
//   authSupplier,
//   validateIdInParam,
//   checkValid,
//   deleteQtItem
// );

export default router;
