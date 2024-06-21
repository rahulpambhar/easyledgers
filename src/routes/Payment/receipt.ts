import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { deleteValidator } from "../../utils/validations";
import { getInvoiceNumber, insert, update, getById, get, deleteReceipt, search, download } from "../../controllers/Payment/receipt";

const router = express.Router();

router.post("/getInvoiceNumber", verifyJWT, getInvoiceNumber);
router.post("/insert", verifyJWT, insert);
router.post("/update", verifyJWT, update); // update sale
router.post("/", verifyJWT, getById);
router.post("/get", verifyJWT, get);
router.post("/delete", verifyJWT, deleteValidator, deleteReceipt);
router.post("/search", verifyJWT, search);
router.post("/download", verifyJWT, download);


export default router;