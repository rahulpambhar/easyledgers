import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { deleteWarehouse, getWarehouseById, getWarehouses, insertWarehouse, searchWarehouse, updateWarehouse } from "../../controllers/Master/warehouse";
const router = express.Router();

router.post("/insert", verifyJWT, insertWarehouse);
router.post("/update", verifyJWT, updateWarehouse);
router.post("/", verifyJWT, getWarehouseById);
router.post("/get", verifyJWT, getWarehouses);
router.post("/search", verifyJWT, searchWarehouse);
router.post("/delete", verifyJWT, deleteValidator, deleteWarehouse);


export default router;