
import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from 'http-status-codes';
import { activityLog, getCompanyByDbName, getVoucher, nextInvoice, checkInvoiceNo, getTransport, getWarehouse, getLedger, getSate } from '../../helpers/general';
import { differenceBy, sumBy } from "lodash";
import { getInWord, getPdfSetting } from '../../utils';
import moment from "moment";
import puppeteer from "puppeteer";
import { renderFile } from "ejs";

export const getInvoiceNumber = async (req: Request, res: Response) => {
    try {
        const voucher = await getVoucher(req.body.db_name, req.body.voucherId)
        if (voucher) {
            const invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, "SALES_ORDER");
            return res.json({ st: true, statusCode: StatusCodes.OK, invoiceNo: invoiceNo });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid voucher id' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};

export const insert = async (req: Request, res: Response) => {
    try {
        let { db_name, items } = req.body;
        const userId = req.cookies.id;
        if (items.length === 0) {
            return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'Invalid sale order item data' });
        }

        const companyInfo = await getCompanyByDbName(db_name);
        if (!companyInfo) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid company' });
        }

        const voucher = await getVoucher(req.body.db_name, req.body.voucherId)
        if (!voucher) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid voucherId' });
        }

        const prisma = getPrismaClient(db_name);
        let invoiceNo = req.body.invoiceNo;
        if (voucher.numberMethod === 'Manual') {
            // validate invoiceNumber duplication
            const SalesOrder = await checkInvoiceNo(db_name, "SALES_ORDER", req.body.invoiceNo);
            if (SalesOrder) {
                return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invoice number already exists' });
            }
        } else {
            invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, "SALES_ORDER");
        }

        let data: any = {
            invoiceType: req.body.invoiceType,
            voucherId: req.body.voucherId,
            invoiceNo: invoiceNo,
            invoiceDate: new Date(req.body.invoiceDate),
            ledgerId: req.body.ledgerId,
            billToId: req.body.billToId,
            billToName: req.body.billToName,
            billToAddress: req.body.billToAddress,
            billToState: req.body.billToState,
            billToCity: req.body.billToCity,
            billToPincode: req.body.billToPincode,
            billTogstNumber: req.body.billTogstNumber,
            shipToId: req.body.shipToId,
            shipToName: req.body.shipToName,
            shipToAddress: req.body.shipToAddress,
            shipToState: req.body.shipToState,
            shipToCity: req.body.shipToCity,
            shipToPincode: req.body.shipToPincode,
            shipTogstNumber: req.body.shipTogstNumber,
            transportId: req.body?.transportId,
            transportMode: req.body?.transportMode,
            warehouseId: req.body?.warehouseId,
            vehicleNo: req.body?.vehicleNo,
            narration: req.body?.narration,
            lrNo: req.body?.lrNo,
            terms: req.body?.terms,
            dueDays: req.body?.dueDays || null,
            dueDate: req.body?.dueDays > 0 ? moment(new Date(req.body.invoiceDate)).add(req.body?.dueDays, 'days').toDate() : null,
            lrDate: req.body?.lrDate ? new Date(req.body?.lrDate) : null,
        }

        if (voucher.isBank) {
            data.bankAccHolderName = voucher.bankLedger?.bankAccHolderName;
            data.bankName = voucher.bankLedger?.bankName;
            data.branchName = voucher.bankLedger?.branchName;
            data.bankAccNo = voucher.bankLedger?.bankAccNo;
            data.bankIfsc = voucher.bankLedger?.bankIfsc;
            data.bankSwiftCode = voucher.bankLedger?.bankSwiftCode;
        }

        let itemTotal = sumBy(items, (item: any) => {
            if (item.isExpense) {
                return 0;
            } else {
                let discountAmount = 0;
                const totalAmount = item.rate * item.qty;
                if (item.discount != 0) {
                    if (item.discountType === "PERCENTAGE") {
                        discountAmount = totalAmount * (item.discount / 100);
                    } else {
                        discountAmount = item.discount;
                    }
                }
                const taxable = totalAmount - discountAmount;
                return taxable;
            }
        });
        let invoiceDiscAmt = 0;
        if (req.body.discount > 0) {
            if (req.body.discountType === "PERCENTAGE") {
                invoiceDiscAmt = itemTotal * (req.body.discount / 100);
            } else {
                invoiceDiscAmt = req.body.discount;
            }
        }

        let taxableTotal = 0;
        let cessTotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;
        let igstTotal = 0;
        let netAmount = 0;

        let itemData: any = [];
        let taxability: any = []
        for (let x in items) {
            taxability.push(items[x].taxableType)
            if (items[x].isExpense) {
                // particular calculation
                let total = items[x].rate;
                if (req.body.invoiceType === 'ITEM') {
                    if (items[x].rateType === "PERCENTAGE") {
                        total = itemTotal * (items[x].rate / 100);
                    }
                }
                taxableTotal += total;
                const igstAmount = total * (items[x].igst / 100);
                igstTotal += igstAmount;
                const sgstAmount = total * (items[x].sgst / 100);
                sgstTotal += sgstAmount;
                const cgstAmount = total * (items[x].cgst / 100);
                cgstTotal += cgstAmount;


                itemData.push({
                    invoiceDate: new Date(req.body.invoiceDate),
                    taxableType: items[x].taxableType,
                    itemId: items[x].itemId,
                    hsn: items[x].hsn,
                    rateType: items[x].rateType,
                    rate: items[x].rate,
                    total: total,
                    igst: items[x].igst,
                    igstAmount: igstAmount,
                    sgst: items[x].sgst,
                    sgstAmount: sgstAmount,
                    cgst: items[x].cgst,
                    cgstAmount: cgstAmount,
                    taxableAmount: total,
                    remark: items[x].remark,
                    isExpense: items[x].isExpense,
                    isAdditional: items[x].isAdditional,
                    createBy: userId
                });
            } else {
                // item calculation
                const totalAmount = items[x].rate * items[x].qty;
                let discount = 0;
                let discountAmount = 0;
                if (items[x].discount != 0) {
                    if (items[x].discountType === "PERCENTAGE") {
                        discount = items[x].discount;
                        discountAmount = totalAmount * (items[x].discount / 100);
                    } else {
                        discount = (items[x].discount * 100) / totalAmount;
                        discountAmount = items[x].discount;
                    }
                }
                const taxable = (items[x].rate * items[x].qty) - discountAmount;

                let invoiceDiscount = 0;
                let invoiceDiscountAmount = 0;
                if (req.body.discount > 0) {
                    if (req.body.discountType === "PERCENTAGE") {
                        invoiceDiscount = (taxable * 100) / itemTotal;
                        invoiceDiscountAmount = (invoiceDiscount / 100) * invoiceDiscAmt;
                    } else {
                        invoiceDiscount = (taxable * 100) / itemTotal;
                        invoiceDiscountAmount = (invoiceDiscount / 100) * req.body.discount;
                    }
                }
                taxableTotal += taxable - invoiceDiscountAmount;

                const cessAmount = (taxable - invoiceDiscountAmount) * (items[x].cess / 100);
                cessTotal += cessAmount;
                const igstAmount = (taxable - invoiceDiscountAmount) * (items[x].igst / 100);
                igstTotal += igstAmount;
                const sgstAmount = (taxable - invoiceDiscountAmount) * (items[x].sgst / 100);
                sgstTotal += sgstAmount;
                const cgstAmount = (taxable - invoiceDiscountAmount) * (items[x].cgst / 100);
                cgstTotal += cgstAmount;

                itemData.push({
                    invoiceDate: new Date(req.body.invoiceDate),
                    taxableType: items[x].taxableType,
                    itemId: items[x].itemId,
                    hsn: items[x].hsn,
                    uom: items[x].uom,
                    qty: items[x].qty,
                    rate: items[x].rate,
                    total: totalAmount,
                    igst: items[x].igst,
                    igstAmount: igstAmount,
                    sgst: items[x].sgst,
                    sgstAmount: sgstAmount,
                    cgst: items[x].cgst,
                    cgstAmount: cgstAmount,
                    cess: items[x].cess,
                    cessAmount: cessAmount,
                    discount: discount,
                    discountAmount: discountAmount,
                    discountType: items[x].discountType,
                    isInvoiceDiscount: req.body.discount > 0,
                    invoiceDiscount: invoiceDiscount,
                    invoiceDiscountAmount: invoiceDiscountAmount,
                    taxableAmount: taxable - invoiceDiscountAmount,
                    isExpense: items[x].isExpense,
                    createBy: userId
                });
            }
        }
        let netAmt = parseFloat(taxableTotal.toFixed(2)) + parseFloat(igstTotal.toFixed(2)) + parseFloat(cessTotal.toFixed()) + (parseFloat(req.body?.roundOffAmount) || 0);
        netAmount = parseFloat(netAmt.toFixed(2));

        data.cessLedgerId = 11;
        data.cessAmount = cessTotal;
        data.igstLedgerId = 3;
        data.igstAmount = igstTotal;
        data.sgstLedgerId = 5;
        data.sgstAmount = sgstTotal;
        data.cgstLedgerId = 7;
        data.cgstAmount = cgstTotal;
        data.taxableAmount = taxableTotal;
        data.discountLedgerId = 12;
        data.discountPercentage = req.body.discount;
        data.discountAmount = invoiceDiscAmt;
        data.discountType = req.body.discountType;
        data.roundOffLedgerId = 13;
        data.roundOffAmount = req.body.roundOffAmount;
        data.netAmount = netAmount;
        data.createBy = userId

        const billTo = await prisma.ledger.findFirst({ where: { id: req.body.billToId }, select: { id: true, glId: true, state: true, taxability: true, gstNumber: true } });
        const TAXABLE = taxability.includes('TAXABLE')
        const EXEMPT = taxability.includes('EXEMPT')
        const NILL = taxability.includes('NILL')
        // const NA = taxability.includes('NA')

        if (billTo?.gstNumber) {
            if (TAXABLE) {
                data.taxability = "TAXABLE"
            } else if (!TAXABLE && NILL && EXEMPT) {
                data.taxability = "EXEMPT"
            } else if (!TAXABLE && NILL) {
                data.taxability = "NILL"
            } else if (!TAXABLE && EXEMPT) {
                data.taxability = "EXEMPT"
            } else {
                data.taxability = "NA"
            }
        } else {
            if (EXEMPT) {
                data.taxability = "EXEMPT"
            } else if (TAXABLE && !NILL && !EXEMPT) {
                data.taxability = "TAXABLE"
            } else if (TAXABLE && NILL && !EXEMPT) {
                data.taxability = "NILL"
            } else {
                data.taxability = "NA"
            }
        }

        const salesOrder = await prisma.salesOrder.create({ data: data });
        if (salesOrder) {
            const itData = itemData.map((i: any) => { i.salesOrderId = salesOrder.id; return i; });
            await prisma.salesOrderItem.createMany({ data: itData });
            await activityLog(db_name, "INSERT", "SalesOrder", req.body, req.cookies.id);
            res.json({ st: true, statusCode: StatusCodes.OK, msg: "sales order created successfully" });
        } else {
            res.json({ st: false, statusCode: StatusCodes.OK, msg: "internal server error" });
        }
    } catch (e: any) {
        console.log(e);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        let { db_name, items } = req.body;
        const userId = req.cookies.id;

        if (items.length === 0) {
            return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'Invalid sale order item data' });
        }

        const prisma = getPrismaClient(db_name);
        const salesOrder = await prisma.salesOrder.findFirst({ where: { id: req.body.id }, include: { items: { where: { isDelete: false } } } })
        if (!salesOrder) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid sales order id" });
        }

        const companyInfo = await getCompanyByDbName(db_name);
        if (!companyInfo) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid company' });
        }

        const voucher = await getVoucher(req.body.db_name, req.body.voucherId)
        if (!voucher) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid voucherId' });
        }

        let data: any = {
            invoiceDate: new Date(req.body.invoiceDate),
            ledgerId: req.body.ledgerId,
            billToId: req.body.billToId,
            billToName: req.body.billToName,
            billToAddress: req.body.billToAddress,
            billToState: req.body.billToState,
            billToCity: req.body.billToCity,
            billToPincode: req.body.billToPincode,
            billTogstNumber: req.body.billTogstNumber,
            shipToId: req.body.shipToId,
            shipToName: req.body.shipToName,
            shipToAddress: req.body.shipToAddress,
            shipToState: req.body.shipToState,
            shipToCity: req.body.shipToCity,
            shipToPincode: req.body.shipToPincode,
            shipTogstNumber: req.body.shipTogstNumber,
            transportId: req.body?.transportId,
            transportMode: req.body?.transportMode,
            warehouseId: req.body?.warehouseId,
            vehicleNo: req.body?.vehicleNo,
            narration: req.body?.narration,
            lrNo: req.body?.lrNo,
            terms: req.body?.terms,
            dueDays: req.body?.dueDays || null,
            dueDate: req.body?.dueDays > 0 ? moment(new Date(req.body.invoiceDate)).add(req.body?.dueDays, 'days').toDate() : null,
            lrDate: req.body?.lrDate ? new Date(req.body?.lrDate) : null,
            updateBy: userId
        }

        if (voucher.isBank) {
            data.bankAccHolderName = voucher.bankLedger?.bankAccHolderName;
            data.bankName = voucher.bankLedger?.bankName;
            data.branchName = voucher.bankLedger?.branchName;
            data.bankAccNo = voucher.bankLedger?.bankAccNo;
            data.bankIfsc = voucher.bankLedger?.bankIfsc;
            data.bankSwiftCode = voucher.bankLedger?.bankSwiftCode;
        }

        let itemTotal = sumBy(items, (item: any) => {
            if (item.isExpense) {
                return 0;
            } else {
                let discountAmount = 0;
                const totalAmount = item.rate * item.qty;
                if (item.discount != 0) {
                    if (item.discountType === "PERCENTAGE") {
                        discountAmount = totalAmount * (item.discount / 100);
                    } else {
                        discountAmount = item.discount;
                    }
                }
                const taxable = totalAmount - discountAmount;
                return taxable;
            }
        });

        let invoiceDiscAmt = 0;
        if (req.body.discount > 0) {
            if (req.body.discountType === "PERCENTAGE") {
                invoiceDiscAmt = itemTotal * (req.body.discount / 100);
            } else {
                invoiceDiscAmt = req.body.discount;
            }
        }

        let taxableTotal = 0;
        let cessTotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;
        let igstTotal = 0;
        let netAmount = 0;

        let itemData: any = [];
        let taxability: any = []
        for (let x in items) {
            taxability.push(items[x].taxableType)
            if (items[x].isExpense) {
                // particular calculation
                let total = items[x].rate;
                if (req.body.invoiceType === 'ITEM') {
                    if (items[x].rateType === "PERCENTAGE") {
                        total = itemTotal * (items[x].rate / 100);
                    }
                }

                taxableTotal += total;
                const igstAmount = total * (items[x].igst / 100);
                igstTotal += igstAmount;
                const sgstAmount = total * (items[x].sgst / 100);
                sgstTotal += sgstAmount;
                const cgstAmount = total * (items[x].cgst / 100);
                cgstTotal += cgstAmount;

                itemData.push({
                    id: items[x].id,
                    invoiceDate: new Date(req.body.invoiceDate),
                    taxableType: items[x].taxableType,
                    itemId: items[x].itemId,
                    hsn: items[x].hsn,
                    rateType: items[x].rateType,
                    rate: items[x].rate,
                    total: total,
                    igst: items[x].igst,
                    igstAmount: igstAmount,
                    sgst: items[x].sgst,
                    sgstAmount: sgstAmount,
                    cgst: items[x].cgst,
                    cgstAmount: cgstAmount,
                    taxableAmount: total,
                    remark: items[x].remark,
                    isExpense: items[x].isExpense,
                    isAdditional: items[x].isAdditional,
                    updateBy: userId
                });
            } else {
                // item calculation
                const totalAmount = items[x].rate * items[x].qty;
                let discount = 0;
                let discountAmount = 0;
                if (items[x].discount != 0) {
                    if (items[x].discountType === "PERCENTAGE") {
                        discount = items[x].discount;
                        discountAmount = totalAmount * (items[x].discount / 100);
                    } else {
                        discount = (items[x].discount * 100) / totalAmount;
                        discountAmount = items[x].discount;
                    }
                }
                const taxable = (items[x].rate * items[x].qty) - discountAmount;
                let invoiceDiscount = 0;
                let invoiceDiscountAmount = 0;
                if (req.body.discount > 0) {
                    if (req.body.discountType === "PERCENTAGE") {

                        invoiceDiscount = (taxable * 100) / itemTotal;
                        invoiceDiscountAmount = (invoiceDiscount / 100) * invoiceDiscAmt;
                    } else {
                        invoiceDiscount = (taxable * 100) / itemTotal;
                        invoiceDiscountAmount = (invoiceDiscount / 100) * req.body.discount;
                    }
                }
                taxableTotal += taxable - invoiceDiscountAmount;

                const cessAmount = (taxable - invoiceDiscountAmount) * (items[x].cess / 100);
                cessTotal += cessAmount;
                const igstAmount = (taxable - invoiceDiscountAmount) * (items[x].igst / 100);
                igstTotal += igstAmount;
                const sgstAmount = (taxable - invoiceDiscountAmount) * (items[x].sgst / 100);
                sgstTotal += sgstAmount;
                const cgstAmount = (taxable - invoiceDiscountAmount) * (items[x].cgst / 100);
                cgstTotal += cgstAmount;

                itemData.push({
                    id: items[x].id,
                    invoiceDate: new Date(req.body.invoiceDate),
                    taxableType: items[x].taxableType,
                    itemId: items[x].itemId,
                    hsn: items[x].hsn,
                    uom: items[x].uom,
                    qty: items[x].qty,
                    rate: items[x].rate,
                    total: totalAmount,
                    igst: items[x].igst,
                    igstAmount: igstAmount,
                    sgst: items[x].sgst,
                    sgstAmount: sgstAmount,
                    cgst: items[x].cgst,
                    cgstAmount: cgstAmount,
                    cess: items[x].cess,
                    cessAmount: cessAmount,
                    discount: discount,
                    discountAmount: discountAmount,
                    discountType: items[x].discountType,
                    isInvoiceDiscount: req.body.discount > 0,
                    invoiceDiscount: invoiceDiscount,
                    invoiceDiscountAmount: invoiceDiscountAmount,
                    taxableAmount: taxable - invoiceDiscountAmount,
                    isExpense: items[x].isExpense,
                    updateBy: userId
                });
            }
        }
        let netAmt = parseFloat(taxableTotal.toFixed(2)) + parseFloat(igstTotal.toFixed(2)) + parseFloat(cessTotal.toFixed()) + (parseFloat(req.body?.roundOffAmount) || 0);
        netAmount = parseFloat(netAmt.toFixed(2));
        data.cessLedgerId = 11;
        data.cessAmount = cessTotal;
        data.igstLedgerId = 3;
        data.igstAmount = igstTotal;
        data.sgstLedgerId = 5;
        data.sgstAmount = sgstTotal;
        data.cgstLedgerId = 7;
        data.cgstAmount = cgstTotal;
        data.taxableAmount = taxableTotal;
        data.discountLedgerId = 12;
        data.discountPercentage = req.body.discount;
        data.discountAmount = invoiceDiscAmt;
        data.discountType = req.body.discountType;
        data.roundOffLedgerId = 13;
        data.roundOffAmount = req.body.roundOffAmount;
        data.netAmount = netAmount;

        const billTo = await prisma.ledger.findFirst({ where: { id: req.body.billToId }, select: { id: true, glId: true, state: true, taxability: true, gstNumber: true } });

        const TAXABLE = taxability.includes('TAXABLE')
        const EXEMPT = taxability.includes('EXEMPT')
        const NILL = taxability.includes('NILL')
        // const NA = taxability.includes('NA')

        if (billTo?.gstNumber) {
            if (TAXABLE) {
                data.taxability = "TAXABLE"
            } else if (!TAXABLE && NILL && EXEMPT) {
                data.taxability = "EXEMPT"
            } else if (!TAXABLE && NILL) {
                data.taxability = "NILL"
            } else if (!TAXABLE && EXEMPT) {
                data.taxability = "EXEMPT"
            } else {
                data.taxability = "NA"
            }
        } else {
            if (EXEMPT) {
                data.taxability = "EXEMPT"
            } else if (TAXABLE && !NILL && !EXEMPT) {
                data.taxability = "TAXABLE"
            } else if (TAXABLE && NILL && !EXEMPT) {
                data.taxability = "NILL"
            } else {
                data.taxability = "NA"
            }
        }

        const salesOrderUpdate = await prisma.salesOrder.update({ where: { id: req.body.id }, data });
        if (salesOrderUpdate) {
            const oldItemId = salesOrder?.items;
            const newItemId = itemData.filter((row: any) => row?.id && row?.id != 0);
            const diff = differenceBy(oldItemId, newItemId, 'id');
            if (diff.length > 0) {
                const deleteItemIds = diff.map((row: any) => row.id);
                await prisma.salesOrderItem.updateMany({
                    where: { salesOrderId: req.body.id, id: { in: deleteItemIds } },
                    data: { isDelete: true }
                });
            }
            const itData = itemData.map((i: any) => { i.salesOrderId = salesOrder.id; return i; });
            for (let i in itData) {
                if (!itData[i]?.id && itData[i]?.id === 0) {
                    let dt: any = itData[i];
                    delete dt['id'];
                    await prisma.salesOrderItem.create({
                        data: dt
                    });
                } else {
                    await prisma.salesOrderItem.update({
                        where: { id: itData[i]?.id },
                        data: itData[i],
                    });
                }
            };
            await activityLog(db_name, "UPDATE", "SalesOrder", req.body, req.cookies.id);
            res.json({ st: true, statusCode: StatusCodes.OK, msg: "sales order updated successfully" });
        } else {
            res.json({ st: false, statusCode: StatusCodes.OK, msg: "internal server error" });
        }
    } catch (e: any) {
        console.log(e)
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data: any = await prisma.salesOrder.findFirst({ where: { id: req.body.id }, include: { items: { where: { isDelete: false } } } });
        if (data) {
            let items = [];
            for (let row of data.items) {
                if (row.isExpense) {
                    const ledger = await prisma.ledger.findFirst({ where: { id: row.itemId as number }, select: { id: true, name: true } });
                    if (ledger) {
                        row.name = ledger.name;
                    }
                } else {
                    const ledger = await prisma.product.findFirst({ where: { id: row.itemId as number }, select: { id: true, name: true } });
                    if (ledger) {
                        row.name = ledger.name;
                    }
                }
                items.push(row)
            }
            data.items = items;
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid sale order id" });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const get = async (req: Request, res: Response) => {
    try {

        const { db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.invoiceNo = { contains: req.body.term, mode: "insensitive" }
        }
        const total = await prisma.salesOrder.count({
            where: where
        });

        const results = await prisma.salesOrder.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where,
            include: { items: { where: { isDelete: false } } }
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies.id;
        const prisma = getPrismaClient(req.body.db_name);
        const id = req.body.id;

        const lastInvoice = await prisma.salesOrder.findFirst({ where: { isDelete: false }, orderBy: { id: 'desc' } });
        let lasInvoiceId = 1;
        if (lastInvoice) {
            lasInvoiceId = lastInvoice.id;
        }

        if (lasInvoiceId < id) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "only last salesOrder delete" });
        }

        const deleted = await prisma.salesOrder.update({
            where: {
                id: id
            },
            data: {
                isDelete: true,
                updateBy: userId,
                items: {
                    updateMany: {
                        where: {
                            salesOrderId: id
                        },
                        data: {
                            isDelete: true,
                            updateBy: userId
                        }
                    }
                }
            }
        });
        if (deleted) {
            await activityLog(req.body.db_name, "DELETE", "salesOrder", req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: "salesOrder deleted successfully" });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid salesOrder id" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const cancel = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies.id;
        const prisma = getPrismaClient(req.body.db_name);
        const id = req.body.id;

        const deleted = await prisma.salesOrder.update({
            where: {
                id: id
            },
            data: {
                isCancel: true,
                updateBy: userId,
                items: {
                    updateMany: {
                        where: {
                            salesOrderId: id
                        },
                        data: {
                            isCancel: true,
                            updateBy: userId
                        }
                    }
                }
            }
        });
        if (deleted) {
            await activityLog(req.body.db_name, "CANCEL", "salesOrder", req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: "salesOrder cancel successfully" });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid salesOrder id" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const search = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        let where: any = { billToId: req.body.billToId, isDelete: false, isCancel: false };
        if (req.body.term !== "") {
            where.invoiceNo = { contains: req.body.term, mode: "insensitive" }
        }

        const sales = await prisma.salesOrder.findMany({
            where: where,
            include: {
                items: {
                    where: {
                        isDelete: false
                    }
                }
            },
            take: 10
        });


        return res.json({ st: true, statusCode: StatusCodes.OK, data: sales });

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const download = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data: any = await prisma.salesOrder.findFirst({ where: { id: req.body.id }, include: { items: { where: { isDelete: false } } } });
        if (data) {
            let items = [];
            let qtyTotle = 0;
            for (let row of data.items) {
                if (row.isExpense) {
                    const ledger = await prisma.ledger.findFirst({ where: { id: row.itemId as number }, select: { id: true, name: true } });
                    if (ledger) {
                        row.name = ledger.name;
                    }
                } else {
                    const ledger = await prisma.product.findFirst({ where: { id: row.itemId as number }, select: { id: true, name: true } });
                    if (ledger) {
                        row.name = ledger.name;
                    }
                    qtyTotle += row.qty;
                }
                items.push(row)
            }

            data.items = items;
            data.qtyTotle = qtyTotle;
            data.Estimation = "Sales Order / Estimation";
            data.invoiceDate = moment(data.invoiceDate).format('YYYY-MM-DD')
            data.dueDate = data.dueDate ? moment(data.dueDate).format('YYYY-MM-DD') : "  -"
            data.lrDate = data.lrDate ? moment(data.lrDate).format('YYYY-MM-DD') : "  -"
            data.company = await getCompanyByDbName(req.body.db_name)
            data.transport = await getTransport(req.body.db_name, data.transport)
            data.warehouse = await getWarehouse(req.body.db_name, data.warehouseId)
            data.billTo = await getLedger(req.body.db_name, data.billToId)
            data.shipTo = await getLedger(req.body.db_name, data.shipToId)
            data.billToStateCode = await getSate(req.body.db_name, data.billToState)
            data.shipToStateCode = await getSate(req.body.db_name, data.shipToState)
            data.netAmountInWord = await getInWord(data.netAmount)
            data.netAmountInWord = await getInWord(data.netAmount)

            const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            const html: any = await renderFile('pdf/sales_purchase_Invoice.ejs', data);
            await page.setContent(html);
            const settings: any = getPdfSetting();
            const pdf = await page.pdf(settings);

            await browser.close();

            res.setHeader('Content-disposition', `attachment; filename=invoice_${data.id}.pdf`);
            res.contentType('application/pdf');
            res.send(pdf);
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid sale order id" });
        }

    } catch (e: any) {
        console.log('e::: ', e);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}