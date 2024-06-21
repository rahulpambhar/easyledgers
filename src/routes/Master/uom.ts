import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { deleteUom, getUom, getUomById, insertUom, searchUom, updateUom } from "../../controllers/Master/uom";
const router = express.Router();

router.post("/insert", verifyJWT, insertUom);
router.post("/update", verifyJWT, updateUom);
router.post("/", verifyJWT, getUomById);
router.post("/get", verifyJWT, getUom);
router.post("/search", verifyJWT, searchUom);
router.post("/delete", verifyJWT, deleteValidator, deleteUom);


export default router;