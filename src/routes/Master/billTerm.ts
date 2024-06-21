import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteBillTerm, getBillTerm, getBillTermById, insertBillTerm, searchBillTerm, updateBillTerm } from "../../controllers/Master/billTerm";
import { deleteValidator } from "../../utils/validations";
const router = express.Router();

router.post("/insert", verifyJWT, insertBillTerm);
router.post("/update", verifyJWT, updateBillTerm);
router.post("/", verifyJWT, getBillTermById);
router.post("/get", verifyJWT, getBillTerm);
router.post("/search", verifyJWT, searchBillTerm);
router.post("/delete", verifyJWT, deleteValidator, deleteBillTerm);


export default router;