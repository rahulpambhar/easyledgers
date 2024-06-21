--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-05-28 18:40:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5867 (class 0 OID 54764)
-- Dependencies: 282
-- Data for Name: Contra; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5831 (class 0 OID 54332)
-- Dependencies: 246
-- Data for Name: DeliveryNote; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5833 (class 0 OID 54351)
-- Dependencies: 248
-- Data for Name: DeliveryNoteItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5871 (class 0 OID 54791)
-- Dependencies: 286
-- Data for Name: JVItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5869 (class 0 OID 54778)
-- Dependencies: 284
-- Data for Name: JournalVoucher; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5859 (class 0 OID 54704)
-- Dependencies: 274
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5851 (class 0 OID 54601)
-- Dependencies: 266
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5853 (class 0 OID 54620)
-- Dependencies: 268
-- Data for Name: PurchaseItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5843 (class 0 OID 54497)
-- Dependencies: 258
-- Data for Name: PurchaseOrder; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5845 (class 0 OID 54515)
-- Dependencies: 260
-- Data for Name: PurchaseOrderItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5855 (class 0 OID 54653)
-- Dependencies: 270
-- Data for Name: PurchaseReturn; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5857 (class 0 OID 54671)
-- Dependencies: 272
-- Data for Name: PurchaseReturnItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5863 (class 0 OID 54734)
-- Dependencies: 278
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5847 (class 0 OID 54548)
-- Dependencies: 262
-- Data for Name: ReceiptNote; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5849 (class 0 OID 54566)
-- Dependencies: 264
-- Data for Name: ReceiptNoteItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5835 (class 0 OID 54386)
-- Dependencies: 250
-- Data for Name: Sales; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5837 (class 0 OID 54410)
-- Dependencies: 252
-- Data for Name: SalesItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5827 (class 0 OID 54281)
-- Dependencies: 242
-- Data for Name: SalesOrder; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5829 (class 0 OID 54300)
-- Dependencies: 244
-- Data for Name: SalesOrderItem; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5839 (class 0 OID 54444)
-- Dependencies: 254
-- Data for Name: SalesReturn; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5841 (class 0 OID 54463)
-- Dependencies: 256
-- Data for Name: SalesReturnItems; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5875 (class 0 OID 54822)
-- Dependencies: 290
-- Data for Name: activityLog; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5821 (class 0 OID 54239)
-- Dependencies: 236
-- Data for Name: billTerm; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5805 (class 0 OID 38600)
-- Dependencies: 220
-- Data for Name: generalLedger; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."generalLedger" VALUES (1, 'Assets', NULL, true, true, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (2, 'Liabilities', NULL, true, true, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (3, 'Incomes', NULL, true, true, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (4, 'Expenses', NULL, true, true, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (5, 'Capital', 2, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (6, 'Loans(Liability)', 2, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (7, 'Current Liabilities', 2, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (8, 'Fixed Assets', 1, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (9, 'Current Assets', 1, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (10, 'PL Incomes', 3, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (11, 'PL Expenses', 4, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (12, 'Trading Income', 3, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (13, 'Trading Expenses', 4, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (14, 'Sales', 3, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (15, 'Purchase', 4, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (16, 'Reserves and Surplus', 5, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (17, 'Secured Loans', 6, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (18, 'Unsecured Loans', 6, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (19, 'Sundry Creditors', 7, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (20, 'Provisions', 7, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (21, 'Investments', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (22, 'Sundry Debtors', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (23, 'Loans and Advances', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (24, 'Banks', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (25, 'Duties and taxes', 7, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (26, 'Other Income', 10, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (27, 'Deposits (Asset)', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (28, 'Branch / Divisions', 7, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (29, 'Bank OD A/c', 6, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (30, 'Suspense A/c', 7, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (31, 'Round off', 11, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (32, 'Bank OCC A/C', 6, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (33, 'Cash in Hand', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (34, 'Stock in Hand', 9, true, false, false, '2024-02-14 13:37:46.483', 0, '2024-02-14 13:37:46.483', 0);
INSERT INTO public."generalLedger" VALUES (35, 'Agent', 19, true, false, false, '2024-03-26 16:14:50.827', 0, '2024-03-26 16:14:50.827', 0);


--
-- TOC entry 5813 (class 0 OID 54167)
-- Dependencies: 228
-- Data for Name: hsn; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5807 (class 0 OID 38683)
-- Dependencies: 222
-- Data for Name: ledger; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.ledger VALUES (1, NULL, 'Profit & Loss', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 09:58:55.426', 1, '2024-03-09 09:58:55.426', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (2, 25, 'Input Igst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:01:44.73', 1, '2024-03-09 10:01:44.73', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (3, 25, 'Output Igst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:01:55.928', 1, '2024-03-09 10:01:55.928', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (4, 25, 'Input Sgst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:06.575', 1, '2024-03-09 10:02:06.575', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (5, 25, 'Output Sgst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:14.097', 1, '2024-03-09 10:02:14.097', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (6, 25, 'Input Cgst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:22.3', 1, '2024-03-09 10:02:22.3', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (7, 25, 'Output Cgst', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:31.159', 1, '2024-03-09 10:02:31.159', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (8, 25, 'Tds Payable', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:40.641', 1, '2024-03-09 10:02:40.641', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (9, 25, 'Tds Receivable', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:02:49.594', 1, '2024-03-09 10:02:49.594', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (10, 25, 'TCS', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:03:00.584', 1, '2024-03-09 10:03:00.584', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (11, 25, 'CESS', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:03:05.95', 1, '2024-03-09 10:03:05.95', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (12, 11, 'Discount', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:03:15.589', 1, '2024-03-09 10:03:15.589', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (13, 31, 'Round Off', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:03:24.731', 1, '2024-03-09 10:03:24.731', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (14, 33, 'Cash', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-09 10:03:32.757', 1, '2024-03-09 10:03:32.757', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (15, 14, 'Sales', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-12 05:31:24.57', 1, '2024-03-12 05:31:24.57', 0, NULL, false, NULL, NULL, 0.00);
INSERT INTO public.ledger VALUES (16, 15, 'Purchase', '', '', '', '', '', NULL, '', NULL, 0.00, NULL, 'null', 0, 0.00, false, '', 0.00, NULL, '', false, '', 'NA', 0.00, 0.00, 0.00, NULL, false, '', '', '', '', '', false, true, false, '2024-03-12 05:31:54.897', 1, '2024-03-12 05:31:54.897', 0, NULL, false, NULL, NULL, 0.00);


--
-- TOC entry 5811 (class 0 OID 54152)
-- Dependencies: 226
-- Data for Name: ledgerSummary; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5861 (class 0 OID 54718)
-- Dependencies: 276
-- Data for Name: paymentAgainst; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5817 (class 0 OID 54197)
-- Dependencies: 232
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5815 (class 0 OID 54184)
-- Dependencies: 230
-- Data for Name: productGroup; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5865 (class 0 OID 54748)
-- Dependencies: 280
-- Data for Name: receiptAgainst; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5819 (class 0 OID 54226)
-- Dependencies: 234
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5809 (class 0 OID 54135)
-- Dependencies: 224
-- Data for Name: tcs; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5873 (class 0 OID 54805)
-- Dependencies: 288
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5825 (class 0 OID 54267)
-- Dependencies: 240
-- Data for Name: transport; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5801 (class 0 OID 36719)
-- Dependencies: 216
-- Data for Name: uom; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.uom VALUES (1, 'BAGS', 'BAG', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (2, 'BALE', 'BAL', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (3, 'BILLION OF UNITS	', 'BOU', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (4, 'BOTTLES	', 'BTL', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (5, 'BOX', 'BOX', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (6, 'BUCKLES', 'BKL', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (7, 'BUNCHES', 'BUN', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (8, 'BUNDLES', 'BDL', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (9, 'CANS', 'CAN', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (10, 'CARTONS', 'CTN', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (11, 'CENTIMETERS', 'CMS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (12, 'CUBIC CENTIMETERS', 'CCM', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (13, 'CUBIC METERS', 'CBM', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (14, 'DOZENS', 'DOZ', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (15, 'DRUMS', 'DRM', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (16, 'GRAMMES', 'GMS', 3, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (17, 'GREAT GROSS', 'GGK', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (18, 'GROSS', 'GRS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (19, 'GROSS YARDS', 'GYD', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (20, 'KILOGRAMS', 'KG', 3, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (21, 'KILOLITRE', 'KLR', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (22, 'KILOMETRE', 'KME', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (23, 'METERS', 'MTR', 2, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (24, 'METRIC TON', 'MTS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (25, 'MILILITRE', 'MLT', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (26, 'NUMBERS', 'NOS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (27, 'OTHERS', 'OTH', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (28, 'PACKS', 'PAC', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (29, 'PAIRS', 'PRS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (30, 'PIECES', 'PCS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (31, 'QUINTAL', 'QTL', 2, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (32, 'ROLLS', 'ROL', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (33, 'SETS', 'SET', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (34, 'SQUARE FEET', 'SQF', 2, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (35, 'SQUARE METERS', 'SQM', 3, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (36, 'SQUARE YARDS', 'SQY', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (37, 'TABLETS', 'TBS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (38, 'TEN GROSS', 'TGM', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (39, 'THOUSANDS', 'THD', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (40, 'TONNES', 'TON', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (41, 'TUBES', 'TUB', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (42, 'UNITS', 'UNT', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (43, 'US GALLONS', 'UGS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);
INSERT INTO public.uom VALUES (44, 'YARDS', 'YDS', 0, false, '2024-03-01 12:20:04.02', 0, '2024-03-01 12:20:04.02', 0);


--
-- TOC entry 5803 (class 0 OID 37268)
-- Dependencies: 218
-- Data for Name: voucher; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.voucher VALUES (1, 'Sales', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:27:45.923', 1, '2024-03-04 07:27:45.923', 0);
INSERT INTO public.voucher VALUES (2, 'Purchase', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:27:50.885', 1, '2024-03-04 07:27:50.885', 0);
INSERT INTO public.voucher VALUES (3, 'Credit note', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:27:53.93', 1, '2024-03-04 07:27:53.93', 0);
INSERT INTO public.voucher VALUES (4, 'Debit note', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:27:58.173', 1, '2024-03-04 07:27:58.173', 0);
INSERT INTO public.voucher VALUES (5, 'Contra', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:01.936', 1, '2024-03-04 07:28:01.936', 0);
INSERT INTO public.voucher VALUES (6, 'Payment', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:05.303', 1, '2024-03-04 07:28:05.303', 0);
INSERT INTO public.voucher VALUES (7, 'Receipt', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:09.094', 1, '2024-03-04 07:28:09.094', 0);
INSERT INTO public.voucher VALUES (8, 'Journal', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:11.672', 1, '2024-03-04 07:28:11.672', 0);
INSERT INTO public.voucher VALUES (9, 'Sales Order', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:16.336', 1, '2024-03-04 07:28:16.336', 0);
INSERT INTO public.voucher VALUES (10, 'Delivery Note', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:22.535', 1, '2024-03-04 07:28:22.535', 0);
INSERT INTO public.voucher VALUES (11, 'Purchase Order', NULL, 'Automatic', false, NULL, false, NULL, true, false, '2024-03-04 07:28:26.634', 1, '2024-03-04 07:28:26.634', 0);


--
-- TOC entry 5823 (class 0 OID 54253)
-- Dependencies: 238
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- TOC entry 5920 (class 0 OID 0)
-- Dependencies: 281
-- Name: Contra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Contra_id_seq"', 1, false);


--
-- TOC entry 5921 (class 0 OID 0)
-- Dependencies: 247
-- Name: DeliveryNoteItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."DeliveryNoteItems_id_seq"', 1, false);


--
-- TOC entry 5922 (class 0 OID 0)
-- Dependencies: 245
-- Name: DeliveryNote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."DeliveryNote_id_seq"', 1, false);


--
-- TOC entry 5923 (class 0 OID 0)
-- Dependencies: 285
-- Name: JVItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."JVItems_id_seq"', 1, false);


--
-- TOC entry 5924 (class 0 OID 0)
-- Dependencies: 283
-- Name: JournalVoucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."JournalVoucher_id_seq"', 1, false);


--
-- TOC entry 5925 (class 0 OID 0)
-- Dependencies: 273
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 1, false);


--
-- TOC entry 5926 (class 0 OID 0)
-- Dependencies: 267
-- Name: PurchaseItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."PurchaseItems_id_seq"', 1, false);


--
-- TOC entry 5927 (class 0 OID 0)
-- Dependencies: 259
-- Name: PurchaseOrderItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."PurchaseOrderItems_id_seq"', 1, false);


--
-- TOC entry 5928 (class 0 OID 0)
-- Dependencies: 257
-- Name: PurchaseOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."PurchaseOrder_id_seq"', 1, false);


--
-- TOC entry 5929 (class 0 OID 0)
-- Dependencies: 271
-- Name: PurchaseReturnItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."PurchaseReturnItems_id_seq"', 1, false);


--
-- TOC entry 5930 (class 0 OID 0)
-- Dependencies: 269
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."PurchaseReturn_id_seq"', 1, false);


--
-- TOC entry 5931 (class 0 OID 0)
-- Dependencies: 265
-- Name: Purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Purchase_id_seq"', 1, false);


--
-- TOC entry 5932 (class 0 OID 0)
-- Dependencies: 263
-- Name: ReceiptNoteItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."ReceiptNoteItems_id_seq"', 1, false);


--
-- TOC entry 5933 (class 0 OID 0)
-- Dependencies: 261
-- Name: ReceiptNote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."ReceiptNote_id_seq"', 1, false);


--
-- TOC entry 5934 (class 0 OID 0)
-- Dependencies: 277
-- Name: Receipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Receipt_id_seq"', 1, false);


--
-- TOC entry 5935 (class 0 OID 0)
-- Dependencies: 251
-- Name: SalesItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."SalesItems_id_seq"', 1, false);


--
-- TOC entry 5936 (class 0 OID 0)
-- Dependencies: 243
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."SalesOrderItem_id_seq"', 1, false);


--
-- TOC entry 5937 (class 0 OID 0)
-- Dependencies: 241
-- Name: SalesOrder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."SalesOrder_id_seq"', 1, false);


--
-- TOC entry 5938 (class 0 OID 0)
-- Dependencies: 255
-- Name: SalesReturnItems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."SalesReturnItems_id_seq"', 1, false);


--
-- TOC entry 5939 (class 0 OID 0)
-- Dependencies: 253
-- Name: SalesReturn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."SalesReturn_id_seq"', 1, false);


--
-- TOC entry 5940 (class 0 OID 0)
-- Dependencies: 249
-- Name: Sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Sales_id_seq"', 1, false);


--
-- TOC entry 5941 (class 0 OID 0)
-- Dependencies: 289
-- Name: activityLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."activityLog_id_seq"', 1, false);


--
-- TOC entry 5942 (class 0 OID 0)
-- Dependencies: 235
-- Name: billTerm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."billTerm_id_seq"', 1, false);


--
-- TOC entry 5943 (class 0 OID 0)
-- Dependencies: 219
-- Name: generalLedger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."generalLedger_id_seq"', 35, true);


--
-- TOC entry 5944 (class 0 OID 0)
-- Dependencies: 227
-- Name: hsn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.hsn_id_seq', 1, false);


--
-- TOC entry 5945 (class 0 OID 0)
-- Dependencies: 225
-- Name: ledgerSummary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."ledgerSummary_id_seq"', 1, false);


--
-- TOC entry 5946 (class 0 OID 0)
-- Dependencies: 221
-- Name: ledger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.ledger_id_seq', 16, true);


--
-- TOC entry 5947 (class 0 OID 0)
-- Dependencies: 275
-- Name: paymentAgainst_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."paymentAgainst_id_seq"', 1, false);


--
-- TOC entry 5948 (class 0 OID 0)
-- Dependencies: 229
-- Name: productGroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."productGroup_id_seq"', 1, false);


--
-- TOC entry 5949 (class 0 OID 0)
-- Dependencies: 231
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.product_id_seq', 1, false);


--
-- TOC entry 5950 (class 0 OID 0)
-- Dependencies: 279
-- Name: receiptAgainst_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."receiptAgainst_id_seq"', 1, false);


--
-- TOC entry 5951 (class 0 OID 0)
-- Dependencies: 233
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.stock_id_seq', 1, false);


--
-- TOC entry 5952 (class 0 OID 0)
-- Dependencies: 223
-- Name: tcs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.tcs_id_seq', 1, false);


--
-- TOC entry 5953 (class 0 OID 0)
-- Dependencies: 287
-- Name: transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.transaction_id_seq', 1, false);


--
-- TOC entry 5954 (class 0 OID 0)
-- Dependencies: 239
-- Name: transport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.transport_id_seq', 1, false);


--
-- TOC entry 5955 (class 0 OID 0)
-- Dependencies: 215
-- Name: uom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.uom_id_seq', 44, true);


--
-- TOC entry 5956 (class 0 OID 0)
-- Dependencies: 217
-- Name: voucher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.voucher_id_seq', 11, true);


--
-- TOC entry 5957 (class 0 OID 0)
-- Dependencies: 237
-- Name: warehouse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.warehouse_id_seq', 1, false);


-- Completed on 2024-05-28 18:40:16

--
-- PostgreSQL database dump complete
--

