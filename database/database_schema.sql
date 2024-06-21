--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-06-06 19:06:57

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
-- TOC entry 5 (class 2615 OID 35988)
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- CREATE SCHEMA public;


-- ALTER SCHEMA public OWNER TO root;

--
-- TOC entry 959 (class 1247 OID 36524)
-- Name: Action; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."Action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'CANCEL'
);


ALTER TYPE public."Action" OWNER TO root;

--
-- TOC entry 962 (class 1247 OID 36538)
-- Name: ExpenseType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."ExpenseType" AS ENUM (
    'ROUNDOFF',
    'DISCOUNT'
);


ALTER TYPE public."ExpenseType" OWNER TO root;

--
-- TOC entry 965 (class 1247 OID 36544)
-- Name: TaxableType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."TaxableType" AS ENUM (
    'NA',
    'EXEMPT',
    'TAXABLE',
    'NILL'
);


ALTER TYPE public."TaxableType" OWNER TO root;

--
-- TOC entry 983 (class 1247 OID 37869)
-- Name: gstRegType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."gstRegType" AS ENUM (
    'Composition',
    'Regular',
    'Unregister',
    'SEZ',
    'EXPORTS',
    'Ecommerce'
);


ALTER TYPE public."gstRegType" OWNER TO root;

--
-- TOC entry 1019 (class 1247 OID 49647)
-- Name: invoiceType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."invoiceType" AS ENUM (
    'ITEM',
    'ACCOUNT'
);


ALTER TYPE public."invoiceType" OWNER TO root;

--
-- TOC entry 968 (class 1247 OID 36596)
-- Name: ledgerMode; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."ledgerMode" AS ENUM (
    'LEDGER',
    'ACCOUNT',
    'ACCOUNT_OPENING',
    'STOCK_OPENING',
    'STOCK_CLOSING',
    'GST',
    'DISCOUNT',
    'ROUNDOFF',
    'PARTICULAR',
    'CONTRA',
    'PAYMENT',
    'RECEIPT',
    'JV'
);


ALTER TYPE public."ledgerMode" OWNER TO root;

--
-- TOC entry 918 (class 1247 OID 52771)
-- Name: methodAdjustmentType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."methodAdjustmentType" AS ENUM (
    'Advance',
    'AgainstReference',
    'NewReference',
    'OnAccount'
);


ALTER TYPE public."methodAdjustmentType" OWNER TO root;

--
-- TOC entry 977 (class 1247 OID 37251)
-- Name: numberMethod; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."numberMethod" AS ENUM (
    'Automatic',
    'Automatic_Manual',
    'Manual'
);


ALTER TYPE public."numberMethod" OWNER TO root;

--
-- TOC entry 915 (class 1247 OID 50525)
-- Name: parcentageType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."parcentageType" AS ENUM (
    'FIXED',
    'PERCENTAGE'
);


ALTER TYPE public."parcentageType" OWNER TO root;

--
-- TOC entry 989 (class 1247 OID 37888)
-- Name: transportMode; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."transportMode" AS ENUM (
    'AIR',
    'ROAD',
    'RAIL',
    'SHIP'
);


ALTER TYPE public."transportMode" OWNER TO root;

--
-- TOC entry 921 (class 1247 OID 52780)
-- Name: txMode; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."txMode" AS ENUM (
    'SALES_ORDER',
    'DELIVERY_NOTE',
    'SALES',
    'PURCHASE_ORDER',
    'RECEIPT_NOTE',
    'PURCHASE',
    'CREDIT',
    'DEBIT',
    'CONTRA',
    'PAYMENT',
    'RECEIPT',
    'JOURNAL',
    'NA'
);


ALTER TYPE public."txMode" OWNER TO root;

--
-- TOC entry 971 (class 1247 OID 36644)
-- Name: txType; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."txType" AS ENUM (
    'CR',
    'DR'
);


ALTER TYPE public."txType" OWNER TO root;

--
-- TOC entry 986 (class 1247 OID 37882)
-- Name: typeOfSupply; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."typeOfSupply" AS ENUM (
    'Goods',
    'Service'
);


ALTER TYPE public."typeOfSupply" OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 282 (class 1259 OID 54764)
-- Name: Contra; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Contra" (
    id integer NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "accId" integer NOT NULL,
    "particularId" integer NOT NULL,
    date date NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "referenceNo" text,
    "referenceMode" text,
    "referenceDate" date,
    narration text,
    attachment text,
    reconciliation timestamp(3) without time zone,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Contra" OWNER TO root;

--
-- TOC entry 281 (class 1259 OID 54763)
-- Name: Contra_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Contra_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contra_id_seq" OWNER TO root;

--
-- TOC entry 5826 (class 0 OID 0)
-- Dependencies: 281
-- Name: Contra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Contra_id_seq" OWNED BY public."Contra".id;


--
-- TOC entry 246 (class 1259 OID 54332)
-- Name: DeliveryNote; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."DeliveryNote" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "brokerId" integer,
    brokerage numeric(19,2) DEFAULT 0,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."DeliveryNote" OWNER TO root;

--
-- TOC entry 248 (class 1259 OID 54351)
-- Name: DeliveryNoteItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."DeliveryNoteItems" (
    id integer NOT NULL,
    "deliveryNoteId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision DEFAULT 0 NOT NULL,
    "remainQty" double precision DEFAULT 0 NOT NULL,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "salesOrderId" integer DEFAULT 0,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."DeliveryNoteItems" OWNER TO root;

--
-- TOC entry 247 (class 1259 OID 54350)
-- Name: DeliveryNoteItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."DeliveryNoteItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DeliveryNoteItems_id_seq" OWNER TO root;

--
-- TOC entry 5827 (class 0 OID 0)
-- Dependencies: 247
-- Name: DeliveryNoteItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."DeliveryNoteItems_id_seq" OWNED BY public."DeliveryNoteItems".id;


--
-- TOC entry 245 (class 1259 OID 54331)
-- Name: DeliveryNote_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."DeliveryNote_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DeliveryNote_id_seq" OWNER TO root;

--
-- TOC entry 5828 (class 0 OID 0)
-- Dependencies: 245
-- Name: DeliveryNote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."DeliveryNote_id_seq" OWNED BY public."DeliveryNote".id;


--
-- TOC entry 286 (class 1259 OID 54791)
-- Name: JVItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."JVItems" (
    id integer NOT NULL,
    "jvId" integer NOT NULL,
    "accId" integer NOT NULL,
    "txType" public."txType",
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "methodAdjustmentType" public."methodAdjustmentType",
    reference jsonb,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."JVItems" OWNER TO root;

--
-- TOC entry 285 (class 1259 OID 54790)
-- Name: JVItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."JVItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JVItems_id_seq" OWNER TO root;

--
-- TOC entry 5829 (class 0 OID 0)
-- Dependencies: 285
-- Name: JVItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."JVItems_id_seq" OWNED BY public."JVItems".id;


--
-- TOC entry 284 (class 1259 OID 54778)
-- Name: JournalVoucher; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."JournalVoucher" (
    id integer NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    date date NOT NULL,
    narration text,
    attachment text,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."JournalVoucher" OWNER TO root;

--
-- TOC entry 283 (class 1259 OID 54777)
-- Name: JournalVoucher_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."JournalVoucher_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JournalVoucher_id_seq" OWNER TO root;

--
-- TOC entry 5830 (class 0 OID 0)
-- Dependencies: 283
-- Name: JournalVoucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."JournalVoucher_id_seq" OWNED BY public."JournalVoucher".id;


--
-- TOC entry 274 (class 1259 OID 54704)
-- Name: Payment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "accId" integer NOT NULL,
    "particularId" integer NOT NULL,
    date date NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "methodAdjustmentType" public."methodAdjustmentType" NOT NULL,
    "referenceNo" text,
    "referenceMode" text,
    "referenceDate" date,
    narration text,
    attachment text,
    reconciliation timestamp(3) without time zone,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Payment" OWNER TO root;

--
-- TOC entry 273 (class 1259 OID 54703)
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO root;

--
-- TOC entry 5831 (class 0 OID 0)
-- Dependencies: 273
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- TOC entry 266 (class 1259 OID 54601)
-- Name: Purchase; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Purchase" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    outstanding numeric(19,2) DEFAULT 0 NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO root;

--
-- TOC entry 268 (class 1259 OID 54620)
-- Name: PurchaseItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."PurchaseItems" (
    id integer NOT NULL,
    "purchaseId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "receiptNoteId" integer DEFAULT 0,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseItems" OWNER TO root;

--
-- TOC entry 267 (class 1259 OID 54619)
-- Name: PurchaseItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."PurchaseItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseItems_id_seq" OWNER TO root;

--
-- TOC entry 5832 (class 0 OID 0)
-- Dependencies: 267
-- Name: PurchaseItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."PurchaseItems_id_seq" OWNED BY public."PurchaseItems".id;


--
-- TOC entry 258 (class 1259 OID 54497)
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."PurchaseOrder" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseOrder" OWNER TO root;

--
-- TOC entry 260 (class 1259 OID 54515)
-- Name: PurchaseOrderItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."PurchaseOrderItems" (
    id integer NOT NULL,
    "purchaseOrderId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "refId" integer DEFAULT 0,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseOrderItems" OWNER TO root;

--
-- TOC entry 259 (class 1259 OID 54514)
-- Name: PurchaseOrderItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."PurchaseOrderItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseOrderItems_id_seq" OWNER TO root;

--
-- TOC entry 5833 (class 0 OID 0)
-- Dependencies: 259
-- Name: PurchaseOrderItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."PurchaseOrderItems_id_seq" OWNED BY public."PurchaseOrderItems".id;


--
-- TOC entry 257 (class 1259 OID 54496)
-- Name: PurchaseOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."PurchaseOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseOrder_id_seq" OWNER TO root;

--
-- TOC entry 5834 (class 0 OID 0)
-- Dependencies: 257
-- Name: PurchaseOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."PurchaseOrder_id_seq" OWNED BY public."PurchaseOrder".id;


--
-- TOC entry 270 (class 1259 OID 54653)
-- Name: PurchaseReturn; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."PurchaseReturn" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseReturn" OWNER TO root;

--
-- TOC entry 272 (class 1259 OID 54671)
-- Name: PurchaseReturnItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."PurchaseReturnItems" (
    id integer NOT NULL,
    "purchaseReturnId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "purchaseId" integer DEFAULT 0,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."PurchaseReturnItems" OWNER TO root;

--
-- TOC entry 271 (class 1259 OID 54670)
-- Name: PurchaseReturnItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."PurchaseReturnItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseReturnItems_id_seq" OWNER TO root;

--
-- TOC entry 5835 (class 0 OID 0)
-- Dependencies: 271
-- Name: PurchaseReturnItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."PurchaseReturnItems_id_seq" OWNED BY public."PurchaseReturnItems".id;


--
-- TOC entry 269 (class 1259 OID 54652)
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."PurchaseReturn_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseReturn_id_seq" OWNER TO root;

--
-- TOC entry 5836 (class 0 OID 0)
-- Dependencies: 269
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."PurchaseReturn_id_seq" OWNED BY public."PurchaseReturn".id;


--
-- TOC entry 265 (class 1259 OID 54600)
-- Name: Purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Purchase_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Purchase_id_seq" OWNER TO root;

--
-- TOC entry 5837 (class 0 OID 0)
-- Dependencies: 265
-- Name: Purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Purchase_id_seq" OWNED BY public."Purchase".id;


--
-- TOC entry 278 (class 1259 OID 54734)
-- Name: Receipt; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Receipt" (
    id integer NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "accId" integer NOT NULL,
    "particularId" integer NOT NULL,
    date date NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "methodAdjustmentType" public."methodAdjustmentType" NOT NULL,
    "referenceNo" text,
    "referenceMode" text,
    "referenceDate" date,
    narration text,
    attachment text,
    reconciliation timestamp(3) without time zone,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Receipt" OWNER TO root;

--
-- TOC entry 262 (class 1259 OID 54548)
-- Name: ReceiptNote; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."ReceiptNote" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ReceiptNote" OWNER TO root;

--
-- TOC entry 264 (class 1259 OID 54566)
-- Name: ReceiptNoteItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."ReceiptNoteItems" (
    id integer NOT NULL,
    "receiptNoteId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision DEFAULT 0 NOT NULL,
    "remainQty" double precision DEFAULT 0 NOT NULL,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "purchaseOrderId" integer DEFAULT 0,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ReceiptNoteItems" OWNER TO root;

--
-- TOC entry 263 (class 1259 OID 54565)
-- Name: ReceiptNoteItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."ReceiptNoteItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReceiptNoteItems_id_seq" OWNER TO root;

--
-- TOC entry 5838 (class 0 OID 0)
-- Dependencies: 263
-- Name: ReceiptNoteItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."ReceiptNoteItems_id_seq" OWNED BY public."ReceiptNoteItems".id;


--
-- TOC entry 261 (class 1259 OID 54547)
-- Name: ReceiptNote_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."ReceiptNote_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReceiptNote_id_seq" OWNER TO root;

--
-- TOC entry 5839 (class 0 OID 0)
-- Dependencies: 261
-- Name: ReceiptNote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."ReceiptNote_id_seq" OWNED BY public."ReceiptNote".id;


--
-- TOC entry 277 (class 1259 OID 54733)
-- Name: Receipt_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Receipt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Receipt_id_seq" OWNER TO root;

--
-- TOC entry 5840 (class 0 OID 0)
-- Dependencies: 277
-- Name: Receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Receipt_id_seq" OWNED BY public."Receipt".id;


--
-- TOC entry 250 (class 1259 OID 54386)
-- Name: Sales; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Sales" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "tcsLedgerId" integer DEFAULT 0 NOT NULL,
    "tcsAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "brokerId" integer,
    brokerage numeric(19,2) DEFAULT 0,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    outstanding numeric(19,2) DEFAULT 0 NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Sales" OWNER TO root;

--
-- TOC entry 252 (class 1259 OID 54410)
-- Name: SalesItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SalesItems" (
    id integer NOT NULL,
    "salesId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision DEFAULT 0 NOT NULL,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "deliveryNoteId" integer DEFAULT 0,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesItems" OWNER TO root;

--
-- TOC entry 251 (class 1259 OID 54409)
-- Name: SalesItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."SalesItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesItems_id_seq" OWNER TO root;

--
-- TOC entry 5841 (class 0 OID 0)
-- Dependencies: 251
-- Name: SalesItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."SalesItems_id_seq" OWNED BY public."SalesItems".id;


--
-- TOC entry 242 (class 1259 OID 54281)
-- Name: SalesOrder; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SalesOrder" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "brokerId" integer,
    brokerage numeric(19,2) DEFAULT 0,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesOrder" OWNER TO root;

--
-- TOC entry 244 (class 1259 OID 54300)
-- Name: SalesOrderItem; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SalesOrderItem" (
    id integer NOT NULL,
    "salesOrderId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesOrderItem" OWNER TO root;

--
-- TOC entry 243 (class 1259 OID 54299)
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."SalesOrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesOrderItem_id_seq" OWNER TO root;

--
-- TOC entry 5842 (class 0 OID 0)
-- Dependencies: 243
-- Name: SalesOrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."SalesOrderItem_id_seq" OWNED BY public."SalesOrderItem".id;


--
-- TOC entry 241 (class 1259 OID 54280)
-- Name: SalesOrder_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."SalesOrder_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesOrder_id_seq" OWNER TO root;

--
-- TOC entry 5843 (class 0 OID 0)
-- Dependencies: 241
-- Name: SalesOrder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."SalesOrder_id_seq" OWNED BY public."SalesOrder".id;


--
-- TOC entry 254 (class 1259 OID 54444)
-- Name: SalesReturn; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SalesReturn" (
    id integer NOT NULL,
    "invoiceType" public."invoiceType" NOT NULL,
    "voucherId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "invoiceDate" date NOT NULL,
    "ledgerId" integer,
    "billToId" integer NOT NULL,
    "billToName" text NOT NULL,
    "billToAddress" text NOT NULL,
    "billToState" text NOT NULL,
    "billToCity" text NOT NULL,
    "billToPincode" text NOT NULL,
    "billTogstNumber" text,
    "shipToId" integer NOT NULL,
    "shipToName" text NOT NULL,
    "shipToAddress" text NOT NULL,
    "shipToState" text NOT NULL,
    "shipToCity" text NOT NULL,
    "shipToPincode" text NOT NULL,
    "shipTogstNumber" text,
    "transportId" integer,
    "transportMode" public."transportMode",
    "warehouseId" integer,
    "taxableAmount" numeric(19,2) NOT NULL,
    "igstLedgerId" integer NOT NULL,
    "igstAmount" numeric(19,2) NOT NULL,
    "cgstLedgerId" integer NOT NULL,
    "cgstAmount" numeric(19,2) NOT NULL,
    "sgstLedgerId" integer NOT NULL,
    "sgstAmount" numeric(19,2) NOT NULL,
    "discountLedgerId" integer,
    "discountPercentage" numeric(19,2) DEFAULT 0,
    "discountAmount" numeric(19,2) DEFAULT 0,
    "discountType" public."parcentageType",
    "roundOffLedgerId" integer,
    "roundOffAmount" numeric(19,2) DEFAULT 0,
    "netAmount" numeric(19,2) NOT NULL,
    taxability public."TaxableType" NOT NULL,
    "vehicleNo" text,
    narration text,
    "lrNo" text,
    "lrDate" date,
    "dueDays" integer,
    "dueDate" date,
    "brokerId" integer,
    brokerage numeric(19,2) DEFAULT 0,
    "bankAccHolderName" text,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    terms text,
    attachment text,
    reference integer[],
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "cessLedgerId" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesReturn" OWNER TO root;

--
-- TOC entry 256 (class 1259 OID 54463)
-- Name: SalesReturnItems; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."SalesReturnItems" (
    id integer NOT NULL,
    "salesReturnId" integer NOT NULL,
    "invoiceDate" date NOT NULL,
    "taxableType" public."TaxableType" NOT NULL,
    "itemId" integer,
    hsn text,
    uom text,
    qty double precision DEFAULT 0 NOT NULL,
    "rateType" public."parcentageType",
    rate numeric(19,2) DEFAULT 0 NOT NULL,
    total numeric(19,2) DEFAULT 0 NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    "igstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "sgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "cgstAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "cessAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    discount numeric(19,2) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "discountType" public."parcentageType",
    "isInvoiceDiscount" boolean DEFAULT false NOT NULL,
    "invoiceDiscount" numeric(19,2) DEFAULT 0 NOT NULL,
    "invoiceDiscountAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "taxableAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    remark text,
    "salesId" integer DEFAULT 0,
    "isAdditional" boolean DEFAULT false NOT NULL,
    "isExpense" boolean DEFAULT false NOT NULL,
    "isCancel" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."SalesReturnItems" OWNER TO root;

--
-- TOC entry 255 (class 1259 OID 54462)
-- Name: SalesReturnItems_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."SalesReturnItems_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesReturnItems_id_seq" OWNER TO root;

--
-- TOC entry 5844 (class 0 OID 0)
-- Dependencies: 255
-- Name: SalesReturnItems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."SalesReturnItems_id_seq" OWNED BY public."SalesReturnItems".id;


--
-- TOC entry 253 (class 1259 OID 54443)
-- Name: SalesReturn_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."SalesReturn_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SalesReturn_id_seq" OWNER TO root;

--
-- TOC entry 5845 (class 0 OID 0)
-- Dependencies: 253
-- Name: SalesReturn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."SalesReturn_id_seq" OWNED BY public."SalesReturn".id;


--
-- TOC entry 249 (class 1259 OID 54385)
-- Name: Sales_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Sales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sales_id_seq" OWNER TO root;

--
-- TOC entry 5846 (class 0 OID 0)
-- Dependencies: 249
-- Name: Sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Sales_id_seq" OWNED BY public."Sales".id;


--
-- TOC entry 290 (class 1259 OID 54822)
-- Name: activityLog; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."activityLog" (
    id integer NOT NULL,
    action public."Action" NOT NULL,
    "table" text NOT NULL,
    body jsonb NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."activityLog" OWNER TO root;

--
-- TOC entry 289 (class 1259 OID 54821)
-- Name: activityLog_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."activityLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."activityLog_id_seq" OWNER TO root;

--
-- TOC entry 5847 (class 0 OID 0)
-- Dependencies: 289
-- Name: activityLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."activityLog_id_seq" OWNED BY public."activityLog".id;


--
-- TOC entry 236 (class 1259 OID 54239)
-- Name: billTerm; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."billTerm" (
    id integer NOT NULL,
    name text NOT NULL,
    term text NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."billTerm" OWNER TO root;

--
-- TOC entry 235 (class 1259 OID 54238)
-- Name: billTerm_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."billTerm_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."billTerm_id_seq" OWNER TO root;

--
-- TOC entry 5848 (class 0 OID 0)
-- Dependencies: 235
-- Name: billTerm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."billTerm_id_seq" OWNED BY public."billTerm".id;


--
-- TOC entry 220 (class 1259 OID 38600)
-- Name: generalLedger; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."generalLedger" (
    id integer NOT NULL,
    name text NOT NULL,
    parent integer,
    "isStatic" boolean DEFAULT false NOT NULL,
    "isView" boolean DEFAULT true NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."generalLedger" OWNER TO root;

--
-- TOC entry 219 (class 1259 OID 38599)
-- Name: generalLedger_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."generalLedger_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."generalLedger_id_seq" OWNER TO root;

--
-- TOC entry 5849 (class 0 OID 0)
-- Dependencies: 219
-- Name: generalLedger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."generalLedger_id_seq" OWNED BY public."generalLedger".id;


--
-- TOC entry 228 (class 1259 OID 54167)
-- Name: hsn; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.hsn (
    id integer NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.hsn OWNER TO root;

--
-- TOC entry 227 (class 1259 OID 54166)
-- Name: hsn_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.hsn_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hsn_id_seq OWNER TO root;

--
-- TOC entry 5850 (class 0 OID 0)
-- Dependencies: 227
-- Name: hsn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.hsn_id_seq OWNED BY public.hsn.id;


--
-- TOC entry 222 (class 1259 OID 38683)
-- Name: ledger; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.ledger (
    id integer NOT NULL,
    "glId" integer,
    name text NOT NULL,
    email text,
    "phoneNumber" text,
    "AltPhoneNumber" text,
    "billingName" text,
    address text,
    state text,
    city text,
    pincode integer,
    "openingBalance" numeric(19,2),
    "openingType" public."txType",
    closing jsonb,
    "dueDays" integer,
    interest numeric(19,2) DEFAULT 0,
    "isTds" boolean DEFAULT false NOT NULL,
    pancard text,
    "tdsPer" numeric(19,2) DEFAULT 0 NOT NULL,
    "gstRegType" public."gstRegType" DEFAULT 'Unregister'::public."gstRegType",
    "gstNumber" text,
    "isGstApplicable" boolean DEFAULT false NOT NULL,
    hsncode text,
    taxability public."TaxableType" DEFAULT 'NA'::public."TaxableType" NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    "typeOfSupply" public."typeOfSupply",
    "isBankEnable" boolean DEFAULT false NOT NULL,
    "bankName" text,
    "branchName" text,
    "bankAccNo" text,
    "bankIfsc" text,
    "bankSwiftCode" text,
    "isTranspoter" boolean DEFAULT false NOT NULL,
    "isStatic" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL,
    "buyerType" text,
    "isTcs" boolean DEFAULT false NOT NULL,
    "bankAccHolderName" text,
    "tcsId" integer,
    brokerage numeric(19,2) DEFAULT 0
);


ALTER TABLE public.ledger OWNER TO root;

--
-- TOC entry 226 (class 1259 OID 54152)
-- Name: ledgerSummary; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."ledgerSummary" (
    id integer NOT NULL,
    "ledgerId" integer NOT NULL,
    credit numeric(19,2) DEFAULT 0 NOT NULL,
    debit numeric(19,2) DEFAULT 0 NOT NULL,
    closing numeric(19,2) DEFAULT 0 NOT NULL,
    "transferClosing" numeric(19,2) DEFAULT 0 NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ledgerSummary" OWNER TO root;

--
-- TOC entry 225 (class 1259 OID 54151)
-- Name: ledgerSummary_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."ledgerSummary_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ledgerSummary_id_seq" OWNER TO root;

--
-- TOC entry 5851 (class 0 OID 0)
-- Dependencies: 225
-- Name: ledgerSummary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."ledgerSummary_id_seq" OWNED BY public."ledgerSummary".id;


--
-- TOC entry 221 (class 1259 OID 38682)
-- Name: ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.ledger_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ledger_id_seq OWNER TO root;

--
-- TOC entry 5852 (class 0 OID 0)
-- Dependencies: 221
-- Name: ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.ledger_id_seq OWNED BY public.ledger.id;


--
-- TOC entry 276 (class 1259 OID 54718)
-- Name: paymentAgainst; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."paymentAgainst" (
    id integer NOT NULL,
    "parentId" integer NOT NULL,
    "purchaseId" integer NOT NULL,
    "particularId" integer NOT NULL,
    "particularName" text NOT NULL,
    date date NOT NULL,
    "netAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "dueAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."paymentAgainst" OWNER TO root;

--
-- TOC entry 275 (class 1259 OID 54717)
-- Name: paymentAgainst_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."paymentAgainst_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."paymentAgainst_id_seq" OWNER TO root;

--
-- TOC entry 5853 (class 0 OID 0)
-- Dependencies: 275
-- Name: paymentAgainst_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."paymentAgainst_id_seq" OWNED BY public."paymentAgainst".id;


--
-- TOC entry 232 (class 1259 OID 54197)
-- Name: product; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.product (
    id integer NOT NULL,
    "groupId" integer,
    name text NOT NULL,
    sku text NOT NULL,
    "uomId" integer NOT NULL,
    "hsnId" integer NOT NULL,
    type public."typeOfSupply" DEFAULT 'Goods'::public."typeOfSupply",
    "isManageSales" boolean DEFAULT false NOT NULL,
    "saleRate" numeric(19,2) NOT NULL,
    "saleMinQty" integer DEFAULT 0 NOT NULL,
    "saleMaxQty" integer DEFAULT 0 NOT NULL,
    "isManagePurchase" boolean DEFAULT false NOT NULL,
    "purchaseRate" numeric(19,2) NOT NULL,
    "purchaseMinQty" integer DEFAULT 0 NOT NULL,
    "purchaseMaxQty" integer DEFAULT 0 NOT NULL,
    "StockQty" numeric(19,4) DEFAULT 0 NOT NULL,
    "PerQtyRate" numeric(19,2) DEFAULT 0 NOT NULL,
    "StockAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "isNonGst" boolean DEFAULT false NOT NULL,
    taxability public."TaxableType" DEFAULT 'NA'::public."TaxableType" NOT NULL,
    igst numeric(19,2) DEFAULT 0 NOT NULL,
    cgst numeric(19,2) DEFAULT 0 NOT NULL,
    sgst numeric(19,2) DEFAULT 0 NOT NULL,
    cess numeric(19,2) DEFAULT 0 NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.product OWNER TO root;

--
-- TOC entry 230 (class 1259 OID 54184)
-- Name: productGroup; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."productGroup" (
    id integer NOT NULL,
    name text NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."productGroup" OWNER TO root;

--
-- TOC entry 229 (class 1259 OID 54183)
-- Name: productGroup_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."productGroup_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."productGroup_id_seq" OWNER TO root;

--
-- TOC entry 5854 (class 0 OID 0)
-- Dependencies: 229
-- Name: productGroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."productGroup_id_seq" OWNED BY public."productGroup".id;


--
-- TOC entry 231 (class 1259 OID 54196)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO root;

--
-- TOC entry 5855 (class 0 OID 0)
-- Dependencies: 231
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- TOC entry 280 (class 1259 OID 54748)
-- Name: receiptAgainst; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."receiptAgainst" (
    id integer NOT NULL,
    "parentId" integer NOT NULL,
    "salesId" integer NOT NULL,
    "particularId" integer NOT NULL,
    "particularName" text NOT NULL,
    date date NOT NULL,
    "netAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    "dueAmount" numeric(19,2) DEFAULT 0 NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."receiptAgainst" OWNER TO root;

--
-- TOC entry 279 (class 1259 OID 54747)
-- Name: receiptAgainst_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."receiptAgainst_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."receiptAgainst_id_seq" OWNER TO root;

--
-- TOC entry 5856 (class 0 OID 0)
-- Dependencies: 279
-- Name: receiptAgainst_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."receiptAgainst_id_seq" OWNED BY public."receiptAgainst".id;


--
-- TOC entry 234 (class 1259 OID 54226)
-- Name: stock; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    "currentQty" numeric(65,30) NOT NULL,
    "currentAmount" numeric(19,2) NOT NULL,
    "transferedQty" numeric(65,30) DEFAULT 0 NOT NULL,
    "transferedAmount" numeric(19,2) NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.stock OWNER TO root;

--
-- TOC entry 233 (class 1259 OID 54225)
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_id_seq OWNER TO root;

--
-- TOC entry 5857 (class 0 OID 0)
-- Dependencies: 233
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- TOC entry 224 (class 1259 OID 54135)
-- Name: tcs; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tcs (
    id integer NOT NULL,
    name text NOT NULL,
    "withoutPan" numeric(19,2) DEFAULT 0 NOT NULL,
    "withPan" numeric(19,2) DEFAULT 0 NOT NULL,
    "thresholdAmt" numeric(19,2) DEFAULT 0 NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tcs OWNER TO root;

--
-- TOC entry 223 (class 1259 OID 54134)
-- Name: tcs_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tcs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tcs_id_seq OWNER TO root;

--
-- TOC entry 5858 (class 0 OID 0)
-- Dependencies: 223
-- Name: tcs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tcs_id_seq OWNED BY public.tcs.id;


--
-- TOC entry 288 (class 1259 OID 54805)
-- Name: transaction; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.transaction (
    id integer NOT NULL,
    "txMode" public."txMode" DEFAULT 'NA'::public."txMode" NOT NULL,
    "voucherId" integer DEFAULT 0,
    "ledgerId" integer NOT NULL,
    "groupId" integer NOT NULL,
    "refId" integer DEFAULT 0 NOT NULL,
    "ledgerMode" public."ledgerMode" NOT NULL,
    date date NOT NULL,
    amount numeric(19,2) DEFAULT 0 NOT NULL,
    "txType" public."txType" NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "isInvoicePending" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.transaction OWNER TO root;

--
-- TOC entry 287 (class 1259 OID 54804)
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_id_seq OWNER TO root;

--
-- TOC entry 5859 (class 0 OID 0)
-- Dependencies: 287
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;


--
-- TOC entry 240 (class 1259 OID 54267)
-- Name: transport; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.transport (
    id integer NOT NULL,
    name text NOT NULL,
    "phoneNumber" text NOT NULL,
    "AltPhoneNumber" text NOT NULL,
    address text NOT NULL,
    pincode text NOT NULL,
    state text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    "gstNo" text NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.transport OWNER TO root;

--
-- TOC entry 239 (class 1259 OID 54266)
-- Name: transport_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.transport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_id_seq OWNER TO root;

--
-- TOC entry 5860 (class 0 OID 0)
-- Dependencies: 239
-- Name: transport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.transport_id_seq OWNED BY public.transport.id;


--
-- TOC entry 216 (class 1259 OID 36719)
-- Name: uom; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.uom (
    id integer NOT NULL,
    name text NOT NULL,
    shortname text NOT NULL,
    "decimalNumber" integer NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.uom OWNER TO root;

--
-- TOC entry 215 (class 1259 OID 36718)
-- Name: uom_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.uom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.uom_id_seq OWNER TO root;

--
-- TOC entry 5861 (class 0 OID 0)
-- Dependencies: 215
-- Name: uom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.uom_id_seq OWNED BY public.uom.id;


--
-- TOC entry 218 (class 1259 OID 37268)
-- Name: voucher; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.voucher (
    id integer NOT NULL,
    name text NOT NULL,
    parent integer,
    "numberMethod" public."numberMethod" NOT NULL,
    duplicate boolean DEFAULT false NOT NULL,
    prefix text,
    "isBank" boolean DEFAULT false NOT NULL,
    "bankLedgerId" integer,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.voucher OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 37267)
-- Name: voucher_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.voucher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.voucher_id_seq OWNER TO root;

--
-- TOC entry 5862 (class 0 OID 0)
-- Dependencies: 217
-- Name: voucher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.voucher_id_seq OWNED BY public.voucher.id;


--
-- TOC entry 238 (class 1259 OID 54253)
-- Name: warehouse; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.warehouse (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    pincode integer NOT NULL,
    state text NOT NULL,
    city text NOT NULL,
    area text NOT NULL,
    "phoneNumber" text NOT NULL,
    "AltPhoneNumber" text NOT NULL,
    email text NOT NULL,
    "isDelete" boolean DEFAULT false NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" integer DEFAULT 0 NOT NULL,
    "updateAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateBy" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.warehouse OWNER TO root;

--
-- TOC entry 237 (class 1259 OID 54252)
-- Name: warehouse_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.warehouse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouse_id_seq OWNER TO root;

--
-- TOC entry 5863 (class 0 OID 0)
-- Dependencies: 237
-- Name: warehouse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.warehouse_id_seq OWNED BY public.warehouse.id;


--
-- TOC entry 5370 (class 2604 OID 54767)
-- Name: Contra id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contra" ALTER COLUMN id SET DEFAULT nextval('public."Contra_id_seq"'::regclass);


--
-- TOC entry 5070 (class 2604 OID 54335)
-- Name: DeliveryNote id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote" ALTER COLUMN id SET DEFAULT nextval('public."DeliveryNote_id_seq"'::regclass);


--
-- TOC entry 5083 (class 2604 OID 54354)
-- Name: DeliveryNoteItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNoteItems" ALTER COLUMN id SET DEFAULT nextval('public."DeliveryNoteItems_id_seq"'::regclass);


--
-- TOC entry 5381 (class 2604 OID 54794)
-- Name: JVItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JVItems" ALTER COLUMN id SET DEFAULT nextval('public."JVItems_id_seq"'::regclass);


--
-- TOC entry 5376 (class 2604 OID 54781)
-- Name: JournalVoucher id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JournalVoucher" ALTER COLUMN id SET DEFAULT nextval('public."JournalVoucher_id_seq"'::regclass);


--
-- TOC entry 5342 (class 2604 OID 54707)
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- TOC entry 5267 (class 2604 OID 54604)
-- Name: Purchase id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase" ALTER COLUMN id SET DEFAULT nextval('public."Purchase_id_seq"'::regclass);


--
-- TOC entry 5280 (class 2604 OID 54623)
-- Name: PurchaseItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseItems" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseItems_id_seq"'::regclass);


--
-- TOC entry 5191 (class 2604 OID 54500)
-- Name: PurchaseOrder id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseOrder_id_seq"'::regclass);


--
-- TOC entry 5203 (class 2604 OID 54518)
-- Name: PurchaseOrderItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrderItems" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseOrderItems_id_seq"'::regclass);


--
-- TOC entry 5305 (class 2604 OID 54656)
-- Name: PurchaseReturn id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseReturn_id_seq"'::regclass);


--
-- TOC entry 5317 (class 2604 OID 54674)
-- Name: PurchaseReturnItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturnItems" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseReturnItems_id_seq"'::regclass);


--
-- TOC entry 5356 (class 2604 OID 54737)
-- Name: Receipt id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Receipt" ALTER COLUMN id SET DEFAULT nextval('public."Receipt_id_seq"'::regclass);


--
-- TOC entry 5228 (class 2604 OID 54551)
-- Name: ReceiptNote id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote" ALTER COLUMN id SET DEFAULT nextval('public."ReceiptNote_id_seq"'::regclass);


--
-- TOC entry 5240 (class 2604 OID 54569)
-- Name: ReceiptNoteItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNoteItems" ALTER COLUMN id SET DEFAULT nextval('public."ReceiptNoteItems_id_seq"'::regclass);


--
-- TOC entry 5110 (class 2604 OID 54389)
-- Name: Sales id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales" ALTER COLUMN id SET DEFAULT nextval('public."Sales_id_seq"'::regclass);


--
-- TOC entry 5126 (class 2604 OID 54413)
-- Name: SalesItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesItems" ALTER COLUMN id SET DEFAULT nextval('public."SalesItems_id_seq"'::regclass);


--
-- TOC entry 5033 (class 2604 OID 54284)
-- Name: SalesOrder id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder" ALTER COLUMN id SET DEFAULT nextval('public."SalesOrder_id_seq"'::regclass);


--
-- TOC entry 5046 (class 2604 OID 54303)
-- Name: SalesOrderItem id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrderItem" ALTER COLUMN id SET DEFAULT nextval('public."SalesOrderItem_id_seq"'::regclass);


--
-- TOC entry 5152 (class 2604 OID 54447)
-- Name: SalesReturn id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn" ALTER COLUMN id SET DEFAULT nextval('public."SalesReturn_id_seq"'::regclass);


--
-- TOC entry 5165 (class 2604 OID 54466)
-- Name: SalesReturnItems id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturnItems" ALTER COLUMN id SET DEFAULT nextval('public."SalesReturnItems_id_seq"'::regclass);


--
-- TOC entry 5398 (class 2604 OID 54825)
-- Name: activityLog id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."activityLog" ALTER COLUMN id SET DEFAULT nextval('public."activityLog_id_seq"'::regclass);


--
-- TOC entry 5015 (class 2604 OID 54242)
-- Name: billTerm id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."billTerm" ALTER COLUMN id SET DEFAULT nextval('public."billTerm_id_seq"'::regclass);


--
-- TOC entry 4927 (class 2604 OID 38603)
-- Name: generalLedger id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."generalLedger" ALTER COLUMN id SET DEFAULT nextval('public."generalLedger_id_seq"'::regclass);


--
-- TOC entry 4973 (class 2604 OID 54170)
-- Name: hsn id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hsn ALTER COLUMN id SET DEFAULT nextval('public.hsn_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 38686)
-- Name: ledger id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.ledger ALTER COLUMN id SET DEFAULT nextval('public.ledger_id_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 54155)
-- Name: ledgerSummary id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ledgerSummary" ALTER COLUMN id SET DEFAULT nextval('public."ledgerSummary_id_seq"'::regclass);


--
-- TOC entry 5348 (class 2604 OID 54721)
-- Name: paymentAgainst id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."paymentAgainst" ALTER COLUMN id SET DEFAULT nextval('public."paymentAgainst_id_seq"'::regclass);


--
-- TOC entry 4987 (class 2604 OID 54200)
-- Name: product id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- TOC entry 4982 (class 2604 OID 54187)
-- Name: productGroup id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."productGroup" ALTER COLUMN id SET DEFAULT nextval('public."productGroup_id_seq"'::regclass);


--
-- TOC entry 5362 (class 2604 OID 54751)
-- Name: receiptAgainst id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."receiptAgainst" ALTER COLUMN id SET DEFAULT nextval('public."receiptAgainst_id_seq"'::regclass);


--
-- TOC entry 5008 (class 2604 OID 54229)
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 54138)
-- Name: tcs id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tcs ALTER COLUMN id SET DEFAULT nextval('public.tcs_id_seq'::regclass);


--
-- TOC entry 5387 (class 2604 OID 54808)
-- Name: transaction id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);


--
-- TOC entry 5027 (class 2604 OID 54270)
-- Name: transport id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transport ALTER COLUMN id SET DEFAULT nextval('public.transport_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 36722)
-- Name: uom id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.uom ALTER COLUMN id SET DEFAULT nextval('public.uom_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 37271)
-- Name: voucher id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.voucher ALTER COLUMN id SET DEFAULT nextval('public.voucher_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 54256)
-- Name: warehouse id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.warehouse ALTER COLUMN id SET DEFAULT nextval('public.warehouse_id_seq'::regclass);


--
-- TOC entry 5555 (class 2606 OID 54776)
-- Name: Contra Contra_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contra"
    ADD CONSTRAINT "Contra_pkey" PRIMARY KEY (id);


--
-- TOC entry 5473 (class 2606 OID 54384)
-- Name: DeliveryNoteItems DeliveryNoteItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNoteItems"
    ADD CONSTRAINT "DeliveryNoteItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5467 (class 2606 OID 54349)
-- Name: DeliveryNote DeliveryNote_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_pkey" PRIMARY KEY (id);


--
-- TOC entry 5564 (class 2606 OID 54803)
-- Name: JVItems JVItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JVItems"
    ADD CONSTRAINT "JVItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5558 (class 2606 OID 54789)
-- Name: JournalVoucher JournalVoucher_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JournalVoucher"
    ADD CONSTRAINT "JournalVoucher_pkey" PRIMARY KEY (id);


--
-- TOC entry 5547 (class 2606 OID 54716)
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- TOC entry 5532 (class 2606 OID 54651)
-- Name: PurchaseItems PurchaseItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseItems"
    ADD CONSTRAINT "PurchaseItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5507 (class 2606 OID 54546)
-- Name: PurchaseOrderItems PurchaseOrderItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5502 (class 2606 OID 54513)
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- TOC entry 5544 (class 2606 OID 54702)
-- Name: PurchaseReturnItems PurchaseReturnItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturnItems"
    ADD CONSTRAINT "PurchaseReturnItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5538 (class 2606 OID 54669)
-- Name: PurchaseReturn PurchaseReturn_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_pkey" PRIMARY KEY (id);


--
-- TOC entry 5526 (class 2606 OID 54618)
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- TOC entry 5519 (class 2606 OID 54599)
-- Name: ReceiptNoteItems ReceiptNoteItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNoteItems"
    ADD CONSTRAINT "ReceiptNoteItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5513 (class 2606 OID 54564)
-- Name: ReceiptNote ReceiptNote_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_pkey" PRIMARY KEY (id);


--
-- TOC entry 5551 (class 2606 OID 54746)
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- TOC entry 5484 (class 2606 OID 54442)
-- Name: SalesItems SalesItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesItems"
    ADD CONSTRAINT "SalesItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5461 (class 2606 OID 54330)
-- Name: SalesOrderItem SalesOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_pkey" PRIMARY KEY (id);


--
-- TOC entry 5455 (class 2606 OID 54298)
-- Name: SalesOrder SalesOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_pkey" PRIMARY KEY (id);


--
-- TOC entry 5496 (class 2606 OID 54495)
-- Name: SalesReturnItems SalesReturnItems_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturnItems"
    ADD CONSTRAINT "SalesReturnItems_pkey" PRIMARY KEY (id);


--
-- TOC entry 5490 (class 2606 OID 54461)
-- Name: SalesReturn SalesReturn_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_pkey" PRIMARY KEY (id);


--
-- TOC entry 5479 (class 2606 OID 54408)
-- Name: Sales Sales_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_pkey" PRIMARY KEY (id);


--
-- TOC entry 5581 (class 2606 OID 54831)
-- Name: activityLog activityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."activityLog"
    ADD CONSTRAINT "activityLog_pkey" PRIMARY KEY (id);


--
-- TOC entry 5442 (class 2606 OID 54251)
-- Name: billTerm billTerm_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."billTerm"
    ADD CONSTRAINT "billTerm_pkey" PRIMARY KEY (id);


--
-- TOC entry 5413 (class 2606 OID 38614)
-- Name: generalLedger generalLedger_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."generalLedger"
    ADD CONSTRAINT "generalLedger_pkey" PRIMARY KEY (id);


--
-- TOC entry 5430 (class 2606 OID 54182)
-- Name: hsn hsn_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.hsn
    ADD CONSTRAINT hsn_pkey PRIMARY KEY (id);


--
-- TOC entry 5426 (class 2606 OID 54165)
-- Name: ledgerSummary ledgerSummary_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ledgerSummary"
    ADD CONSTRAINT "ledgerSummary_pkey" PRIMARY KEY (id);


--
-- TOC entry 5419 (class 2606 OID 38705)
-- Name: ledger ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.ledger
    ADD CONSTRAINT ledger_pkey PRIMARY KEY (id);


--
-- TOC entry 5549 (class 2606 OID 54732)
-- Name: paymentAgainst paymentAgainst_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."paymentAgainst"
    ADD CONSTRAINT "paymentAgainst_pkey" PRIMARY KEY (id);


--
-- TOC entry 5433 (class 2606 OID 54195)
-- Name: productGroup productGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."productGroup"
    ADD CONSTRAINT "productGroup_pkey" PRIMARY KEY (id);


--
-- TOC entry 5436 (class 2606 OID 54224)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 5553 (class 2606 OID 54762)
-- Name: receiptAgainst receiptAgainst_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."receiptAgainst"
    ADD CONSTRAINT "receiptAgainst_pkey" PRIMARY KEY (id);


--
-- TOC entry 5438 (class 2606 OID 54237)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- TOC entry 5422 (class 2606 OID 54150)
-- Name: tcs tcs_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tcs
    ADD CONSTRAINT tcs_pkey PRIMARY KEY (id);


--
-- TOC entry 5571 (class 2606 OID 54820)
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- TOC entry 5450 (class 2606 OID 54279)
-- Name: transport transport_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transport
    ADD CONSTRAINT transport_pkey PRIMARY KEY (id);


--
-- TOC entry 5402 (class 2606 OID 36731)
-- Name: uom uom_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_pkey PRIMARY KEY (id);


--
-- TOC entry 5408 (class 2606 OID 37282)
-- Name: voucher voucher_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (id);


--
-- TOC entry 5446 (class 2606 OID 54265)
-- Name: warehouse warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);


--
-- TOC entry 5468 (class 1259 OID 54856)
-- Name: DeliveryNoteItems_deliveryNoteId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNoteItems_deliveryNoteId_idx" ON public."DeliveryNoteItems" USING btree ("deliveryNoteId");


--
-- TOC entry 5469 (class 1259 OID 54858)
-- Name: DeliveryNoteItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNoteItems_invoiceDate_idx" ON public."DeliveryNoteItems" USING btree ("invoiceDate");


--
-- TOC entry 5470 (class 1259 OID 54860)
-- Name: DeliveryNoteItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNoteItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."DeliveryNoteItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5471 (class 1259 OID 54859)
-- Name: DeliveryNoteItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNoteItems_isExpense_idx" ON public."DeliveryNoteItems" USING btree ("isExpense");


--
-- TOC entry 5474 (class 1259 OID 54857)
-- Name: DeliveryNoteItems_remainQty_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNoteItems_remainQty_idx" ON public."DeliveryNoteItems" USING btree ("remainQty");


--
-- TOC entry 5463 (class 1259 OID 54855)
-- Name: DeliveryNote_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNote_invoiceDate_idx" ON public."DeliveryNote" USING btree ("invoiceDate");


--
-- TOC entry 5464 (class 1259 OID 54853)
-- Name: DeliveryNote_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNote_invoiceNo_idx" ON public."DeliveryNote" USING btree ("invoiceNo");


--
-- TOC entry 5465 (class 1259 OID 54854)
-- Name: DeliveryNote_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "DeliveryNote_ledgerId_idx" ON public."DeliveryNote" USING btree ("ledgerId");


--
-- TOC entry 5560 (class 1259 OID 54911)
-- Name: JVItems_accId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "JVItems_accId_idx" ON public."JVItems" USING btree ("accId");


--
-- TOC entry 5561 (class 1259 OID 54910)
-- Name: JVItems_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "JVItems_id_idx" ON public."JVItems" USING btree (id);


--
-- TOC entry 5562 (class 1259 OID 54912)
-- Name: JVItems_jvId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "JVItems_jvId_idx" ON public."JVItems" USING btree ("jvId");


--
-- TOC entry 5556 (class 1259 OID 54908)
-- Name: JournalVoucher_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "JournalVoucher_id_idx" ON public."JournalVoucher" USING btree (id);


--
-- TOC entry 5559 (class 1259 OID 54909)
-- Name: JournalVoucher_voucherId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "JournalVoucher_voucherId_idx" ON public."JournalVoucher" USING btree ("voucherId");


--
-- TOC entry 5527 (class 1259 OID 54896)
-- Name: PurchaseItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseItems_invoiceDate_idx" ON public."PurchaseItems" USING btree ("invoiceDate");


--
-- TOC entry 5528 (class 1259 OID 54898)
-- Name: PurchaseItems_isDelete_isCancel_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseItems_isDelete_isCancel_idx" ON public."PurchaseItems" USING btree ("isDelete", "isCancel");


--
-- TOC entry 5529 (class 1259 OID 54899)
-- Name: PurchaseItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."PurchaseItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5530 (class 1259 OID 54897)
-- Name: PurchaseItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseItems_isExpense_idx" ON public."PurchaseItems" USING btree ("isExpense");


--
-- TOC entry 5533 (class 1259 OID 54895)
-- Name: PurchaseItems_purchaseId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseItems_purchaseId_idx" ON public."PurchaseItems" USING btree ("purchaseId");


--
-- TOC entry 5503 (class 1259 OID 54880)
-- Name: PurchaseOrderItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrderItems_invoiceDate_idx" ON public."PurchaseOrderItems" USING btree ("invoiceDate");


--
-- TOC entry 5504 (class 1259 OID 54882)
-- Name: PurchaseOrderItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrderItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."PurchaseOrderItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5505 (class 1259 OID 54881)
-- Name: PurchaseOrderItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrderItems_isExpense_idx" ON public."PurchaseOrderItems" USING btree ("isExpense");


--
-- TOC entry 5508 (class 1259 OID 54879)
-- Name: PurchaseOrderItems_purchaseOrderId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrderItems_purchaseOrderId_idx" ON public."PurchaseOrderItems" USING btree ("purchaseOrderId");


--
-- TOC entry 5498 (class 1259 OID 54878)
-- Name: PurchaseOrder_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrder_invoiceDate_idx" ON public."PurchaseOrder" USING btree ("invoiceDate");


--
-- TOC entry 5499 (class 1259 OID 54876)
-- Name: PurchaseOrder_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrder_invoiceNo_idx" ON public."PurchaseOrder" USING btree ("invoiceNo");


--
-- TOC entry 5500 (class 1259 OID 54877)
-- Name: PurchaseOrder_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseOrder_ledgerId_idx" ON public."PurchaseOrder" USING btree ("ledgerId");


--
-- TOC entry 5539 (class 1259 OID 54904)
-- Name: PurchaseReturnItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturnItems_invoiceDate_idx" ON public."PurchaseReturnItems" USING btree ("invoiceDate");


--
-- TOC entry 5540 (class 1259 OID 54906)
-- Name: PurchaseReturnItems_isDelete_isCancel_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturnItems_isDelete_isCancel_idx" ON public."PurchaseReturnItems" USING btree ("isDelete", "isCancel");


--
-- TOC entry 5541 (class 1259 OID 54907)
-- Name: PurchaseReturnItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturnItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."PurchaseReturnItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5542 (class 1259 OID 54905)
-- Name: PurchaseReturnItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturnItems_isExpense_idx" ON public."PurchaseReturnItems" USING btree ("isExpense");


--
-- TOC entry 5545 (class 1259 OID 54903)
-- Name: PurchaseReturnItems_purchaseReturnId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturnItems_purchaseReturnId_idx" ON public."PurchaseReturnItems" USING btree ("purchaseReturnId");


--
-- TOC entry 5534 (class 1259 OID 54902)
-- Name: PurchaseReturn_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturn_invoiceDate_idx" ON public."PurchaseReturn" USING btree ("invoiceDate");


--
-- TOC entry 5535 (class 1259 OID 54900)
-- Name: PurchaseReturn_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturn_invoiceNo_idx" ON public."PurchaseReturn" USING btree ("invoiceNo");


--
-- TOC entry 5536 (class 1259 OID 54901)
-- Name: PurchaseReturn_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "PurchaseReturn_ledgerId_idx" ON public."PurchaseReturn" USING btree ("ledgerId");


--
-- TOC entry 5522 (class 1259 OID 54894)
-- Name: Purchase_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Purchase_invoiceDate_idx" ON public."Purchase" USING btree ("invoiceDate");


--
-- TOC entry 5523 (class 1259 OID 54892)
-- Name: Purchase_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Purchase_invoiceNo_idx" ON public."Purchase" USING btree ("invoiceNo");


--
-- TOC entry 5524 (class 1259 OID 54893)
-- Name: Purchase_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Purchase_ledgerId_idx" ON public."Purchase" USING btree ("ledgerId");


--
-- TOC entry 5514 (class 1259 OID 54888)
-- Name: ReceiptNoteItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_invoiceDate_idx" ON public."ReceiptNoteItems" USING btree ("invoiceDate");


--
-- TOC entry 5515 (class 1259 OID 54890)
-- Name: ReceiptNoteItems_isDelete_isCancel_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_isDelete_isCancel_idx" ON public."ReceiptNoteItems" USING btree ("isDelete", "isCancel");


--
-- TOC entry 5516 (class 1259 OID 54891)
-- Name: ReceiptNoteItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."ReceiptNoteItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5517 (class 1259 OID 54889)
-- Name: ReceiptNoteItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_isExpense_idx" ON public."ReceiptNoteItems" USING btree ("isExpense");


--
-- TOC entry 5520 (class 1259 OID 54886)
-- Name: ReceiptNoteItems_receiptNoteId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_receiptNoteId_idx" ON public."ReceiptNoteItems" USING btree ("receiptNoteId");


--
-- TOC entry 5521 (class 1259 OID 54887)
-- Name: ReceiptNoteItems_remainQty_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNoteItems_remainQty_idx" ON public."ReceiptNoteItems" USING btree ("remainQty");


--
-- TOC entry 5509 (class 1259 OID 54885)
-- Name: ReceiptNote_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNote_invoiceDate_idx" ON public."ReceiptNote" USING btree ("invoiceDate");


--
-- TOC entry 5510 (class 1259 OID 54883)
-- Name: ReceiptNote_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNote_invoiceNo_idx" ON public."ReceiptNote" USING btree ("invoiceNo");


--
-- TOC entry 5511 (class 1259 OID 54884)
-- Name: ReceiptNote_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ReceiptNote_ledgerId_idx" ON public."ReceiptNote" USING btree ("ledgerId");


--
-- TOC entry 5480 (class 1259 OID 54865)
-- Name: SalesItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesItems_invoiceDate_idx" ON public."SalesItems" USING btree ("invoiceDate");


--
-- TOC entry 5481 (class 1259 OID 54867)
-- Name: SalesItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."SalesItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5482 (class 1259 OID 54866)
-- Name: SalesItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesItems_isExpense_idx" ON public."SalesItems" USING btree ("isExpense");


--
-- TOC entry 5485 (class 1259 OID 54864)
-- Name: SalesItems_salesId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesItems_salesId_idx" ON public."SalesItems" USING btree ("salesId");


--
-- TOC entry 5456 (class 1259 OID 54849)
-- Name: SalesOrderItem_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrderItem_invoiceDate_idx" ON public."SalesOrderItem" USING btree ("invoiceDate");


--
-- TOC entry 5457 (class 1259 OID 54851)
-- Name: SalesOrderItem_isDelete_isCancel_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrderItem_isDelete_isCancel_idx" ON public."SalesOrderItem" USING btree ("isDelete", "isCancel");


--
-- TOC entry 5458 (class 1259 OID 54852)
-- Name: SalesOrderItem_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrderItem_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."SalesOrderItem" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5459 (class 1259 OID 54850)
-- Name: SalesOrderItem_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrderItem_isExpense_idx" ON public."SalesOrderItem" USING btree ("isExpense");


--
-- TOC entry 5462 (class 1259 OID 54848)
-- Name: SalesOrderItem_salesOrderId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrderItem_salesOrderId_idx" ON public."SalesOrderItem" USING btree ("salesOrderId");


--
-- TOC entry 5451 (class 1259 OID 54847)
-- Name: SalesOrder_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrder_invoiceDate_idx" ON public."SalesOrder" USING btree ("invoiceDate");


--
-- TOC entry 5452 (class 1259 OID 54845)
-- Name: SalesOrder_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrder_invoiceNo_idx" ON public."SalesOrder" USING btree ("invoiceNo");


--
-- TOC entry 5453 (class 1259 OID 54846)
-- Name: SalesOrder_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesOrder_ledgerId_idx" ON public."SalesOrder" USING btree ("ledgerId");


--
-- TOC entry 5491 (class 1259 OID 54872)
-- Name: SalesReturnItems_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturnItems_invoiceDate_idx" ON public."SalesReturnItems" USING btree ("invoiceDate");


--
-- TOC entry 5492 (class 1259 OID 54874)
-- Name: SalesReturnItems_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturnItems_isDelete_idx" ON public."SalesReturnItems" USING btree ("isDelete");


--
-- TOC entry 5493 (class 1259 OID 54875)
-- Name: SalesReturnItems_isDelete_isExpense_isCancel_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturnItems_isDelete_isExpense_isCancel_invoiceDate_idx" ON public."SalesReturnItems" USING btree ("isDelete", "isExpense", "isCancel", "invoiceDate");


--
-- TOC entry 5494 (class 1259 OID 54873)
-- Name: SalesReturnItems_isExpense_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturnItems_isExpense_idx" ON public."SalesReturnItems" USING btree ("isExpense");


--
-- TOC entry 5497 (class 1259 OID 54871)
-- Name: SalesReturnItems_salesReturnId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturnItems_salesReturnId_idx" ON public."SalesReturnItems" USING btree ("salesReturnId");


--
-- TOC entry 5486 (class 1259 OID 54870)
-- Name: SalesReturn_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturn_invoiceDate_idx" ON public."SalesReturn" USING btree ("invoiceDate");


--
-- TOC entry 5487 (class 1259 OID 54868)
-- Name: SalesReturn_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturn_invoiceNo_idx" ON public."SalesReturn" USING btree ("invoiceNo");


--
-- TOC entry 5488 (class 1259 OID 54869)
-- Name: SalesReturn_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "SalesReturn_ledgerId_idx" ON public."SalesReturn" USING btree ("ledgerId");


--
-- TOC entry 5475 (class 1259 OID 54863)
-- Name: Sales_invoiceDate_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Sales_invoiceDate_idx" ON public."Sales" USING btree ("invoiceDate");


--
-- TOC entry 5476 (class 1259 OID 54861)
-- Name: Sales_invoiceNo_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Sales_invoiceNo_idx" ON public."Sales" USING btree ("invoiceNo");


--
-- TOC entry 5477 (class 1259 OID 54862)
-- Name: Sales_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "Sales_ledgerId_idx" ON public."Sales" USING btree ("ledgerId");


--
-- TOC entry 5578 (class 1259 OID 54924)
-- Name: activityLog_action_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "activityLog_action_idx" ON public."activityLog" USING btree (action);


--
-- TOC entry 5579 (class 1259 OID 54925)
-- Name: activityLog_createBy_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "activityLog_createBy_idx" ON public."activityLog" USING btree ("createBy");


--
-- TOC entry 5439 (class 1259 OID 54839)
-- Name: billTerm_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "billTerm_name_idx" ON public."billTerm" USING btree (name);


--
-- TOC entry 5440 (class 1259 OID 54840)
-- Name: billTerm_name_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "billTerm_name_isDelete_idx" ON public."billTerm" USING btree (name, "isDelete");


--
-- TOC entry 5409 (class 1259 OID 38645)
-- Name: generalLedger_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "generalLedger_isDelete_idx" ON public."generalLedger" USING btree ("isDelete");


--
-- TOC entry 5410 (class 1259 OID 38646)
-- Name: generalLedger_name_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "generalLedger_name_isDelete_idx" ON public."generalLedger" USING btree (name, "isDelete");


--
-- TOC entry 5411 (class 1259 OID 38644)
-- Name: generalLedger_parent_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "generalLedger_parent_idx" ON public."generalLedger" USING btree (parent);


--
-- TOC entry 5427 (class 1259 OID 54835)
-- Name: hsn_code_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX hsn_code_idx ON public.hsn USING btree (code);


--
-- TOC entry 5428 (class 1259 OID 54836)
-- Name: hsn_code_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "hsn_code_isDelete_idx" ON public.hsn USING btree (code, "isDelete");


--
-- TOC entry 5423 (class 1259 OID 54833)
-- Name: ledgerSummary_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ledgerSummary_ledgerId_idx" ON public."ledgerSummary" USING btree ("ledgerId");


--
-- TOC entry 5424 (class 1259 OID 54834)
-- Name: ledgerSummary_ledgerId_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "ledgerSummary_ledgerId_key" ON public."ledgerSummary" USING btree ("ledgerId");


--
-- TOC entry 5414 (class 1259 OID 38708)
-- Name: ledger_glId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ledger_glId_idx" ON public.ledger USING btree ("glId");


--
-- TOC entry 5415 (class 1259 OID 38707)
-- Name: ledger_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX ledger_id_idx ON public.ledger USING btree (id);


--
-- TOC entry 5416 (class 1259 OID 38710)
-- Name: ledger_id_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ledger_id_isDelete_idx" ON public.ledger USING btree (id, "isDelete");


--
-- TOC entry 5417 (class 1259 OID 38709)
-- Name: ledger_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "ledger_isDelete_idx" ON public.ledger USING btree ("isDelete");


--
-- TOC entry 5431 (class 1259 OID 54837)
-- Name: productGroup_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "productGroup_id_idx" ON public."productGroup" USING btree (id);


--
-- TOC entry 5434 (class 1259 OID 54838)
-- Name: product_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX product_id_idx ON public.product USING btree (id);


--
-- TOC entry 5420 (class 1259 OID 54832)
-- Name: tcs_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX tcs_name_idx ON public.tcs USING btree (name);


--
-- TOC entry 5565 (class 1259 OID 54919)
-- Name: transaction_groupId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_groupId_idx" ON public.transaction USING btree ("groupId");


--
-- TOC entry 5566 (class 1259 OID 54918)
-- Name: transaction_ledgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_ledgerId_idx" ON public.transaction USING btree ("ledgerId");


--
-- TOC entry 5567 (class 1259 OID 54915)
-- Name: transaction_ledgerMode_groupId_date_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_ledgerMode_groupId_date_isDelete_idx" ON public.transaction USING btree ("ledgerMode", "groupId", date, "isDelete");


--
-- TOC entry 5568 (class 1259 OID 54921)
-- Name: transaction_ledgerMode_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_ledgerMode_idx" ON public.transaction USING btree ("ledgerMode");


--
-- TOC entry 5569 (class 1259 OID 54916)
-- Name: transaction_ledgerMode_ledgerId_date_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_ledgerMode_ledgerId_date_isDelete_idx" ON public.transaction USING btree ("ledgerMode", "ledgerId", date, "isDelete");


--
-- TOC entry 5572 (class 1259 OID 54920)
-- Name: transaction_refId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_refId_idx" ON public.transaction USING btree ("refId");


--
-- TOC entry 5573 (class 1259 OID 54923)
-- Name: transaction_txMode_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_txMode_idx" ON public.transaction USING btree ("txMode");


--
-- TOC entry 5574 (class 1259 OID 54914)
-- Name: transaction_txMode_refId_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_txMode_refId_isDelete_idx" ON public.transaction USING btree ("txMode", "refId", "isDelete");


--
-- TOC entry 5575 (class 1259 OID 54913)
-- Name: transaction_txMode_refId_ledgerId_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_txMode_refId_ledgerId_isDelete_idx" ON public.transaction USING btree ("txMode", "refId", "ledgerId", "isDelete");


--
-- TOC entry 5576 (class 1259 OID 54922)
-- Name: transaction_txType_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_txType_idx" ON public.transaction USING btree ("txType");


--
-- TOC entry 5577 (class 1259 OID 54917)
-- Name: transaction_voucherId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transaction_voucherId_idx" ON public.transaction USING btree ("voucherId");


--
-- TOC entry 5447 (class 1259 OID 54843)
-- Name: transport_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX transport_name_idx ON public.transport USING btree (name);


--
-- TOC entry 5448 (class 1259 OID 54844)
-- Name: transport_name_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "transport_name_isDelete_idx" ON public.transport USING btree (name, "isDelete");


--
-- TOC entry 5403 (class 1259 OID 37305)
-- Name: voucher_bankLedgerId_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "voucher_bankLedgerId_idx" ON public.voucher USING btree ("bankLedgerId");


--
-- TOC entry 5404 (class 1259 OID 37284)
-- Name: voucher_id_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX voucher_id_idx ON public.voucher USING btree (id);


--
-- TOC entry 5405 (class 1259 OID 37304)
-- Name: voucher_isBank_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "voucher_isBank_idx" ON public.voucher USING btree ("isBank");


--
-- TOC entry 5406 (class 1259 OID 37303)
-- Name: voucher_parent_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX voucher_parent_idx ON public.voucher USING btree (parent);


--
-- TOC entry 5443 (class 1259 OID 54841)
-- Name: warehouse_name_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX warehouse_name_idx ON public.warehouse USING btree (name);


--
-- TOC entry 5444 (class 1259 OID 54842)
-- Name: warehouse_name_isDelete_idx; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "warehouse_name_isDelete_idx" ON public.warehouse USING btree (name, "isDelete");


--
-- TOC entry 5668 (class 2606 OID 55311)
-- Name: Contra Contra_accId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contra"
    ADD CONSTRAINT "Contra_accId_fkey" FOREIGN KEY ("accId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5669 (class 2606 OID 55316)
-- Name: Contra Contra_particularId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contra"
    ADD CONSTRAINT "Contra_particularId_fkey" FOREIGN KEY ("particularId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5670 (class 2606 OID 55306)
-- Name: Contra Contra_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contra"
    ADD CONSTRAINT "Contra_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5607 (class 2606 OID 55031)
-- Name: DeliveryNoteItems DeliveryNoteItems_deliveryNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNoteItems"
    ADD CONSTRAINT "DeliveryNoteItems_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES public."DeliveryNote"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5608 (class 2606 OID 55367)
-- Name: DeliveryNoteItems DeliveryNoteItems_salesOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNoteItems"
    ADD CONSTRAINT "DeliveryNoteItems_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES public."SalesOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5600 (class 2606 OID 55006)
-- Name: DeliveryNote DeliveryNote_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5601 (class 2606 OID 55026)
-- Name: DeliveryNote DeliveryNote_brokerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5602 (class 2606 OID 55001)
-- Name: DeliveryNote DeliveryNote_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5603 (class 2606 OID 55011)
-- Name: DeliveryNote DeliveryNote_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5604 (class 2606 OID 55016)
-- Name: DeliveryNote DeliveryNote_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5605 (class 2606 OID 54996)
-- Name: DeliveryNote DeliveryNote_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5606 (class 2606 OID 55021)
-- Name: DeliveryNote DeliveryNote_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DeliveryNote"
    ADD CONSTRAINT "DeliveryNote_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5672 (class 2606 OID 55331)
-- Name: JVItems JVItems_accId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JVItems"
    ADD CONSTRAINT "JVItems_accId_fkey" FOREIGN KEY ("accId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5673 (class 2606 OID 55326)
-- Name: JVItems JVItems_jvId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JVItems"
    ADD CONSTRAINT "JVItems_jvId_fkey" FOREIGN KEY ("jvId") REFERENCES public."JournalVoucher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5671 (class 2606 OID 55321)
-- Name: JournalVoucher JournalVoucher_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."JournalVoucher"
    ADD CONSTRAINT "JournalVoucher_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5658 (class 2606 OID 55261)
-- Name: Payment Payment_accId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_accId_fkey" FOREIGN KEY ("accId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5659 (class 2606 OID 55266)
-- Name: Payment Payment_particularId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_particularId_fkey" FOREIGN KEY ("particularId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5660 (class 2606 OID 55256)
-- Name: Payment Payment_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5648 (class 2606 OID 55216)
-- Name: PurchaseItems PurchaseItems_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseItems"
    ADD CONSTRAINT "PurchaseItems_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5649 (class 2606 OID 55387)
-- Name: PurchaseItems PurchaseItems_receiptNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseItems"
    ADD CONSTRAINT "PurchaseItems_receiptNoteId_fkey" FOREIGN KEY ("receiptNoteId") REFERENCES public."ReceiptNote"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5633 (class 2606 OID 55146)
-- Name: PurchaseOrderItems PurchaseOrderItems_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrderItems"
    ADD CONSTRAINT "PurchaseOrderItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5627 (class 2606 OID 55126)
-- Name: PurchaseOrder PurchaseOrder_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5628 (class 2606 OID 55121)
-- Name: PurchaseOrder PurchaseOrder_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5629 (class 2606 OID 55131)
-- Name: PurchaseOrder PurchaseOrder_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5630 (class 2606 OID 55136)
-- Name: PurchaseOrder PurchaseOrder_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5631 (class 2606 OID 55116)
-- Name: PurchaseOrder PurchaseOrder_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5632 (class 2606 OID 55141)
-- Name: PurchaseOrder PurchaseOrder_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5656 (class 2606 OID 55392)
-- Name: PurchaseReturnItems PurchaseReturnItems_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturnItems"
    ADD CONSTRAINT "PurchaseReturnItems_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5657 (class 2606 OID 55251)
-- Name: PurchaseReturnItems PurchaseReturnItems_purchaseReturnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturnItems"
    ADD CONSTRAINT "PurchaseReturnItems_purchaseReturnId_fkey" FOREIGN KEY ("purchaseReturnId") REFERENCES public."PurchaseReturn"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5650 (class 2606 OID 55231)
-- Name: PurchaseReturn PurchaseReturn_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5651 (class 2606 OID 55226)
-- Name: PurchaseReturn PurchaseReturn_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5652 (class 2606 OID 55236)
-- Name: PurchaseReturn PurchaseReturn_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5653 (class 2606 OID 55241)
-- Name: PurchaseReturn PurchaseReturn_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5654 (class 2606 OID 55221)
-- Name: PurchaseReturn PurchaseReturn_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5655 (class 2606 OID 55246)
-- Name: PurchaseReturn PurchaseReturn_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5642 (class 2606 OID 55196)
-- Name: Purchase Purchase_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5643 (class 2606 OID 55191)
-- Name: Purchase Purchase_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5644 (class 2606 OID 55201)
-- Name: Purchase Purchase_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5645 (class 2606 OID 55206)
-- Name: Purchase Purchase_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5646 (class 2606 OID 55186)
-- Name: Purchase Purchase_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5647 (class 2606 OID 55211)
-- Name: Purchase Purchase_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5640 (class 2606 OID 55382)
-- Name: ReceiptNoteItems ReceiptNoteItems_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNoteItems"
    ADD CONSTRAINT "ReceiptNoteItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5641 (class 2606 OID 55181)
-- Name: ReceiptNoteItems ReceiptNoteItems_receiptNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNoteItems"
    ADD CONSTRAINT "ReceiptNoteItems_receiptNoteId_fkey" FOREIGN KEY ("receiptNoteId") REFERENCES public."ReceiptNote"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5634 (class 2606 OID 55161)
-- Name: ReceiptNote ReceiptNote_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5635 (class 2606 OID 55156)
-- Name: ReceiptNote ReceiptNote_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5636 (class 2606 OID 55166)
-- Name: ReceiptNote ReceiptNote_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5637 (class 2606 OID 55171)
-- Name: ReceiptNote ReceiptNote_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5638 (class 2606 OID 55151)
-- Name: ReceiptNote ReceiptNote_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5639 (class 2606 OID 55176)
-- Name: ReceiptNote ReceiptNote_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ReceiptNote"
    ADD CONSTRAINT "ReceiptNote_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5663 (class 2606 OID 55286)
-- Name: Receipt Receipt_accId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_accId_fkey" FOREIGN KEY ("accId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5664 (class 2606 OID 55291)
-- Name: Receipt Receipt_particularId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_particularId_fkey" FOREIGN KEY ("particularId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5665 (class 2606 OID 55281)
-- Name: Receipt Receipt_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5616 (class 2606 OID 55372)
-- Name: SalesItems SalesItems_deliveryNoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesItems"
    ADD CONSTRAINT "SalesItems_deliveryNoteId_fkey" FOREIGN KEY ("deliveryNoteId") REFERENCES public."DeliveryNote"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5617 (class 2606 OID 55071)
-- Name: SalesItems SalesItems_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesItems"
    ADD CONSTRAINT "SalesItems_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES public."Sales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5599 (class 2606 OID 54991)
-- Name: SalesOrderItem SalesOrderItem_salesOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrderItem"
    ADD CONSTRAINT "SalesOrderItem_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES public."SalesOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5592 (class 2606 OID 54966)
-- Name: SalesOrder SalesOrder_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5593 (class 2606 OID 54986)
-- Name: SalesOrder SalesOrder_brokerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5594 (class 2606 OID 54961)
-- Name: SalesOrder SalesOrder_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5595 (class 2606 OID 54971)
-- Name: SalesOrder SalesOrder_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5596 (class 2606 OID 54976)
-- Name: SalesOrder SalesOrder_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5597 (class 2606 OID 54956)
-- Name: SalesOrder SalesOrder_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5598 (class 2606 OID 54981)
-- Name: SalesOrder SalesOrder_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesOrder"
    ADD CONSTRAINT "SalesOrder_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5625 (class 2606 OID 55377)
-- Name: SalesReturnItems SalesReturnItems_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturnItems"
    ADD CONSTRAINT "SalesReturnItems_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES public."Sales"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5626 (class 2606 OID 55111)
-- Name: SalesReturnItems SalesReturnItems_salesReturnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturnItems"
    ADD CONSTRAINT "SalesReturnItems_salesReturnId_fkey" FOREIGN KEY ("salesReturnId") REFERENCES public."SalesReturn"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5618 (class 2606 OID 55086)
-- Name: SalesReturn SalesReturn_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5619 (class 2606 OID 55106)
-- Name: SalesReturn SalesReturn_brokerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5620 (class 2606 OID 55081)
-- Name: SalesReturn SalesReturn_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5621 (class 2606 OID 55091)
-- Name: SalesReturn SalesReturn_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5622 (class 2606 OID 55096)
-- Name: SalesReturn SalesReturn_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5623 (class 2606 OID 55076)
-- Name: SalesReturn SalesReturn_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5624 (class 2606 OID 55101)
-- Name: SalesReturn SalesReturn_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."SalesReturn"
    ADD CONSTRAINT "SalesReturn_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5609 (class 2606 OID 55046)
-- Name: Sales Sales_billToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_billToId_fkey" FOREIGN KEY ("billToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5610 (class 2606 OID 55066)
-- Name: Sales Sales_brokerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5611 (class 2606 OID 55041)
-- Name: Sales Sales_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5612 (class 2606 OID 55051)
-- Name: Sales Sales_shipToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_shipToId_fkey" FOREIGN KEY ("shipToId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5613 (class 2606 OID 55056)
-- Name: Sales Sales_transportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES public.transport(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5614 (class 2606 OID 55036)
-- Name: Sales Sales_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5615 (class 2606 OID 55061)
-- Name: Sales Sales_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Sales"
    ADD CONSTRAINT "Sales_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouse(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5584 (class 2606 OID 38666)
-- Name: generalLedger generalLedger_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."generalLedger"
    ADD CONSTRAINT "generalLedger_parent_fkey" FOREIGN KEY (parent) REFERENCES public."generalLedger"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5587 (class 2606 OID 54931)
-- Name: ledgerSummary ledgerSummary_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."ledgerSummary"
    ADD CONSTRAINT "ledgerSummary_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5585 (class 2606 OID 38711)
-- Name: ledger ledger_glId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.ledger
    ADD CONSTRAINT "ledger_glId_fkey" FOREIGN KEY ("glId") REFERENCES public."generalLedger"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5586 (class 2606 OID 54926)
-- Name: ledger ledger_tcsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.ledger
    ADD CONSTRAINT "ledger_tcsId_fkey" FOREIGN KEY ("tcsId") REFERENCES public.tcs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5661 (class 2606 OID 55271)
-- Name: paymentAgainst paymentAgainst_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."paymentAgainst"
    ADD CONSTRAINT "paymentAgainst_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Payment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5662 (class 2606 OID 55276)
-- Name: paymentAgainst paymentAgainst_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."paymentAgainst"
    ADD CONSTRAINT "paymentAgainst_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5588 (class 2606 OID 54936)
-- Name: product product_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."productGroup"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5589 (class 2606 OID 54946)
-- Name: product product_hsnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_hsnId_fkey" FOREIGN KEY ("hsnId") REFERENCES public.hsn(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5590 (class 2606 OID 54941)
-- Name: product product_uomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "product_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES public.uom(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5666 (class 2606 OID 55296)
-- Name: receiptAgainst receiptAgainst_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."receiptAgainst"
    ADD CONSTRAINT "receiptAgainst_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Receipt"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5667 (class 2606 OID 55301)
-- Name: receiptAgainst receiptAgainst_salesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."receiptAgainst"
    ADD CONSTRAINT "receiptAgainst_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES public."Sales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5591 (class 2606 OID 54951)
-- Name: stock stock_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT "stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5674 (class 2606 OID 55346)
-- Name: transaction transaction_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."generalLedger"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5675 (class 2606 OID 55341)
-- Name: transaction transaction_ledgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "transaction_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5676 (class 2606 OID 55336)
-- Name: transaction transaction_voucherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "transaction_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5582 (class 2606 OID 38716)
-- Name: voucher voucher_bankLedgerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT "voucher_bankLedgerId_fkey" FOREIGN KEY ("bankLedgerId") REFERENCES public.ledger(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5583 (class 2606 OID 38042)
-- Name: voucher voucher_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_parent_fkey FOREIGN KEY (parent) REFERENCES public.voucher(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5825 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-06-06 19:06:57

--
-- PostgreSQL database dump complete
--

