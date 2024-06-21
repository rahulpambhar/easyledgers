import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { insertCompany, updateCompany, deleteCompany, getCompanyById, getCompany } from "../../controllers/Auth/company";

const router = express.Router();

router.post("/insert", verifyJWT, insertCompany);
router.post("/update", verifyJWT, updateCompany);
router.post("/", verifyJWT, getCompanyById);
router.post("/get", verifyJWT, getCompany);
router.post("/delete", verifyJWT, deleteCompany);

export default router;