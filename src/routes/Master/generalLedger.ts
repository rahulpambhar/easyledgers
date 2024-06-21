import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { GLUpdateValidator, GLinsertValidator } from "../../utils/validations";
import { getGeneralLedger, insertGeneralLedger, updateGeneralLedger, deleteGeneralLedger, getGeneralLedgerById, searchGeneralLedger } from '../../controllers/Master/generalLedger';

const router = express.Router();

router.post("/insert", verifyJWT, GLinsertValidator, insertGeneralLedger);
router.post("/update", verifyJWT, GLUpdateValidator, updateGeneralLedger);
router.post("/", verifyJWT, getGeneralLedgerById);
router.post("/get", verifyJWT, getGeneralLedger);
router.post("/search", verifyJWT, searchGeneralLedger);
router.post("/delete", verifyJWT, deleteGeneralLedger, deleteGeneralLedger);


export default router;