import express from "express";
import { verifyJWT } from '../../middleware/verifyJWT';
import { trialBalance, byGLIdHistory, byGLId, getLedgersByGLId, getMonthlyByLedgerId, getLedgerInfoByMonth, pnl, balanceSheet } from "../../controllers/Report/report";

const router = express.Router();

router.post("/trialBalance", verifyJWT, trialBalance);
router.post("/byGLIdHistory", verifyJWT, byGLIdHistory);
router.post("/byGLId", verifyJWT, byGLId);
router.post("/getLedgersByGLId", verifyJWT, getLedgersByGLId);
router.post("/getMonthlyByLedgerId", verifyJWT, getMonthlyByLedgerId);
router.post("/getLedgerInfoByMonth", verifyJWT, getLedgerInfoByMonth);
router.post("/pnl", verifyJWT, pnl);
router.post("/balanceSheet", verifyJWT, balanceSheet);

export default router;