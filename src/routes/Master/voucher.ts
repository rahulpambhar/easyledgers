import express from "express";
import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { deleteVoucher, getVoucher, getVoucherById, getVoucherByParentId, insertVoucher, searchVoucher, updateVoucher } from "../../controllers/Master/voucher";

const router = express.Router();

router.post("/insert", verifyJWT, insertVoucher);
router.post("/update", verifyJWT, updateVoucher);
router.post("/", verifyJWT, getVoucherById);
router.post("/byParentId", verifyJWT, getVoucherByParentId);
router.post("/get", verifyJWT, getVoucher);
router.post("/search", verifyJWT, searchVoucher);
router.post("/delete", verifyJWT, deleteValidator, deleteVoucher);

export default router;