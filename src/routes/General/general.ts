import express from "express";

import { verifyJWT } from "../../middleware/verifyJWT";
import {
  checkGst,
  getCity,
  getState,
  upload,
  companySettings
} from "../../controllers/General/general";
const router = express.Router();

router.post("/settings", verifyJWT, companySettings);
router.post("/checkGst", verifyJWT, checkGst);
router.post("/state", verifyJWT, getState);
router.post("/city", verifyJWT, getCity);
router.post("/upload", verifyJWT, upload);

export default router;
