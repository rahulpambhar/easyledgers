import express from 'express';
import { insertTcs, updateTcs, deleteTcs, getById, getTcs, tcsSearch } from '../../controllers/Master/tcsSections';

import { tcs, getPaginationValidator, deleteValidator, } from "../../utils/validations";
import { verifyJWT } from "../../middleware/verifyJWT";

const router = express.Router();

router.post('/insert', verifyJWT, tcs, insertTcs);
router.post('/update', verifyJWT, tcs, updateTcs);
router.post('/', verifyJWT, getById);
router.post('/get', verifyJWT, getPaginationValidator, getTcs);
router.post('/search', verifyJWT, tcsSearch);
router.post('/delete', verifyJWT, deleteValidator, deleteTcs);

export default router;