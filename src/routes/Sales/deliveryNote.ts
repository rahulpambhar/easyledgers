import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { deleteValidator } from "../../utils/validations";
import { getInvoiceNumber, insert, update, getById, get, cancel, deleteDN, search, download } from "../../controllers/Sales/deliveryNote";

const router = express.Router();

router.post("/getInvoiceNumber", verifyJWT, getInvoiceNumber);
router.post("/insert", verifyJWT, insert);
router.post("/update", verifyJWT, update); // update sale
router.post("/getById", verifyJWT, getById);
router.post("/get", verifyJWT, get);
router.post("/cancel", verifyJWT, deleteValidator, cancel);
router.post("/delete", verifyJWT, deleteValidator, deleteDN);
router.post("/search", verifyJWT, search);
router.post("/download", verifyJWT, download);

export default router;