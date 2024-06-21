import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { deleteHSN, getHSN, getHsnById, insertHSN, searchHSN, updateHSN } from "../../controllers/Master/hsn";
const router = express.Router();

router.post("/insert", verifyJWT, insertHSN);
router.post("/update", verifyJWT, updateHSN);
router.post("/", verifyJWT, getHsnById);
router.post("/get", verifyJWT, getHSN);
router.post("/search", verifyJWT, searchHSN);
router.post("/delete", verifyJWT, deleteValidator, deleteHSN);


export default router;