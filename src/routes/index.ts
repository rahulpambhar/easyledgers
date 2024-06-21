import { Router } from "express";
import auth from "./Auth/auth";
import general from "./General/general";
import company from "./Auth/company";
import tcsSections from "./Master/tcsSections";
import generalLedger from "./Master/generalLedger";
import ledger from "./Master/ledger";
import voucher from "./Master/voucher";
import hsn from "./Master/hsn";
import uom from "./Master/uom";
import product from "./Master/product";
import billTerm from "./Master/billTerm";
import transport from "./Master/transport";
import warehouse from "./Master/warehouse";
import salesOrder from "./Sales/salesOrder";
import deliveryNote from './Sales/deliveryNote';
import sales from './Sales/sales';
import saleReturn from './Sales/saleReturn';

import purchaseOrder from "./Purchase/purchaseOrder";
import receiptNote from './Purchase/receiptNote';
import purchase from './Purchase/purchase';
import purchaseReturn from './Purchase/purchaseReturn';

import payment from "./Payment/payment";
import receipt from './Payment/receipt';
import jv from './Payment/jv';
import contra from './Payment/contra';

import report from './Report/report';

const router = Router();

//Auth Route
router.use("/", auth);
router.use("/", general);
router.use("/company", company);
router.use("/tcs", tcsSections);
router.use("/generalLedger", generalLedger);
router.use("/ledger", ledger);
router.use("/voucher", voucher);
router.use("/hsn", hsn);
router.use("/uom", uom);
router.use("/product", product);
router.use("/billTerm", billTerm);
router.use("/transport", transport);
router.use("/warehouse", warehouse);
router.use("/salesOrder", salesOrder);
router.use("/deliveryNote", deliveryNote);
router.use("/sales", sales);
router.use("/saleReturn", saleReturn);

router.use("/purchaseOrder", purchaseOrder);
router.use("/receiptNote", receiptNote);
router.use("/purchase", purchase);
router.use("/purchaseReturn", purchaseReturn);

router.use("/payment", payment);
router.use("/receipt", receipt);
router.use("/jv", jv);
router.use("/contra", contra);

router.use("/report", report);

export default router;