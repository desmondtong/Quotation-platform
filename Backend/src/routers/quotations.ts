import express from "express";
const router = express.Router();

import { createQuotation } from "../controllers/quotations";

router.put("/quotations-items", createQuotation);
// router.get("/quotations-items/:customer_id", getAllCustomerquotations);
// router.get("/quotations-items", getAllquotations);
// router.post("/quotations-items/:project_id", getProjectById);
// router.delete("/quotations-items/:project_id", deleteProject);
// router.patch("/quotations-items/:project_id", updateProject);

// router.delete("/items/:item_id", deleteItem);

export default router;
