import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { deleteValidator } from "../../utils/validations";
import { deleteProduct, getProduct, getProductById, insertProduct, updateProduct, searchProduct, insertProductGroup, updateProductGroup, getProductGroup, getProductGroupById, searchProductGroup, deleteProductGroup } from '../../controllers/Master/product';

const router = express.Router();

router.post("/group/insert", verifyJWT, insertProductGroup);
router.post("/group/update", verifyJWT, updateProductGroup);
router.post("/group/get", verifyJWT, getProductGroup);
router.post("/group", verifyJWT, getProductGroupById);
router.post("/group/search", verifyJWT, searchProductGroup);
router.post("/group/delete", verifyJWT, deleteValidator, deleteProductGroup);

router.post("/insert", verifyJWT, insertProduct);
router.post("/update", verifyJWT, updateProduct);
router.post("/", verifyJWT, getProductById);
router.post("/get", verifyJWT, getProduct);
router.post("/search", verifyJWT, searchProduct);
router.post("/delete", verifyJWT, deleteValidator, deleteProduct);

export default router;