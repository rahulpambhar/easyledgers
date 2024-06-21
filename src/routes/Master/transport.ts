import express from 'express';

import { verifyJWT } from "../../middleware/verifyJWT";
import { deleteValidator } from "../../utils/validations";
import { deleteTransport, getTransportById, getTransports, insertTransport, searchTransport, updateTransport } from "../../controllers/Master/transport";
const router = express.Router();

router.post("/insert", verifyJWT, insertTransport);
router.post("/update", verifyJWT, updateTransport);
router.post("/", verifyJWT, getTransportById);
router.post("/get", verifyJWT, getTransports);
router.post("/search", verifyJWT, searchTransport);
router.post("/delete", verifyJWT, deleteValidator, deleteTransport);


export default router;