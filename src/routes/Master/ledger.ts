import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { UpdateLedger, deleteLedger, getLedger, getLedgerByGLGroup, getLedgerById, insertLedger, searchLedger } from "../../controllers/Master/ledger";
const router = express.Router();

router.post("/insert", verifyJWT, insertLedger);
router.post("/update", verifyJWT, UpdateLedger);
router.post("/", verifyJWT, getLedgerById);
router.post("/byGroup", verifyJWT, getLedgerByGLGroup);
router.post("/get", verifyJWT, getLedger);
router.post("/search", verifyJWT, searchLedger);
router.post("/delete", verifyJWT, deleteValidator, deleteLedger);


export default router;