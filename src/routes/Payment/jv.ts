import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { deleteValidator } from "../../utils/validations";
import { getInvoiceNumber, insert, update, getById, get, deleteJV, search } from "../../controllers/Payment/jv";

const router = express.Router();

router.post("/getInvoiceNumber", verifyJWT, getInvoiceNumber);
router.post("/insert", verifyJWT, insert);
router.post("/update", verifyJWT, update); // update sale
router.post("/", verifyJWT, getById);
router.post("/get", verifyJWT, get);
router.post("/delete", verifyJWT, deleteValidator, deleteJV);
router.post("/search", verifyJWT, search);

export default router;