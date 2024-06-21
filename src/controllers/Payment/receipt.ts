import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog, checkInvoiceNo, getVoucher, nextInvoice, updateTransaction, getLedger, getCompanyByDbName } from "../../helpers/general";
import { uploadFiles, getInWord, getPdfSetting } from '../../utils';
import { differenceBy } from "lodash";
import moment from 'moment';
import puppeteer from 'puppeteer';
import { renderFile } from 'ejs';

export const getInvoiceNumber = async (req: Request, res: Response) => {
    try {
        const voucher = await getVoucher(req.body.db_name, parseInt(req.body.voucherId))
        if (voucher) {
            const invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, "RECEIPT");
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
        const prisma = getPrismaClient(req.body.db_name);

        const userId = req.cookies.id
        const account = await prisma.ledger.findFirst({ where: { id: parseInt(req.body.accId) } });
        if (!account) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'invalid account id' });
        }

        const particular = await prisma.ledger.findFirst({ where: { id: parseInt(req.body.particularId) } });
        if (!particular) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'invalid particular id' });
        }

        const voucher = await getVoucher(req.body.db_name, parseInt(req.body.voucherId));
        if (!voucher) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid voucherId' });
        }

        let invoiceNo = req.body.invoiceNo;
        if (voucher.numberMethod === 'Manual') {
            const saleData = await checkInvoiceNo(req.body.db_name, "RECEIPT", req.body.invoiceNo);
            if (saleData) {
                return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'invoice number already exists' });
            }
        } else {
            invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, parseInt(req.body.voucherId), 'RECEIPT');
        }

        let data: any = {
            voucherId: parseInt(req.body.voucherId),
            invoiceNo: invoiceNo,
            accId: parseInt(req.body.accId),
            particularId: parseInt(req.body.particularId),
            date: new Date(req.body.date),
            amount: parseFloat(req.body.amount),
            methodAdjustmentType: req.body.methodAdjustmentType,
            referenceNo: req.body.referenceNo,
            referenceMode: req.body.referenceMode,
            referenceDate: req.body?.referenceDate ? new Date(req.body?.referenceDate) : null,
            narration: req.body.narration,
            createBy: userId,
        }
        if (req?.files?.attachment) {
            data.attachment = await uploadFiles(req.files.attachment, "attachment");
        }

        await prisma.$transaction(async (tx) => {
            if (req.body.methodAdjustmentType === "AgainstReference" && req.body.reference != "") {
                let ref = JSON.parse(req.body.reference);
                let receiptAgainst = []
                for (let i in ref) {
                    let getSales = await tx.sales.findFirst({ where: { id: ref[i].salesId }, select: { id: true, invoiceNo: true, invoiceDate: true, netAmount: true, outstanding: true } });
                    if (getSales) {
                        receiptAgainst.push({
                            particularId: particular.id,
                            particularName: particular.billingName as string,
                            salesId: getSales.id,
                            date: new Date(req.body.date),
                            netAmount: getSales.netAmount,
                            dueAmount: getSales.outstanding,
                            amount: parseFloat(ref[i].amount)
                        });
                        await tx.sales.update({ where: { id: ref[i].salesId }, data: { outstanding: { decrement: parseFloat(ref[i].amount) } } });
                    }
                }
                data.receiptAgainst = { createMany: { data: receiptAgainst } }
            }
            const result: any = await tx.receipt.create({ data: data });

            await activityLog(req.body.db_name, "INSERT", "receipt", req.body, userId);
            const txData: txParams[] = [{
                txMode: "RECEIPT",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "RECEIPT",
                userId: userId,
            }, {
                txMode: "RECEIPT",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "RECEIPT",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)
        });
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Receipt Created Successfully' });

    } catch (error) {
        console.log(error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const userId = req.cookies.id
        const account = await prisma.ledger.findFirst({ where: { id: parseInt(req.body.accId) } });
        if (!account) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'invalid account id' });
        }

        const particular = await prisma.ledger.findFirst({ where: { id: parseInt(req.body.particularId) } });
        if (!particular) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'invalid particular id' });
        }

        let data: any = {
            accId: parseInt(req.body.accId),
            particularId: parseInt(req.body.particularId),
            date: new Date(req.body.date),
            amount: parseFloat(req.body.amount),
            methodAdjustmentType: req.body.methodAdjustmentType,
            referenceNo: req.body.referenceNo,
            referenceMode: req.body.referenceMode,
            referenceDate: req.body?.referenceDate ? new Date(req.body?.referenceDate) : null,
            narration: req.body.narration,
            updateBy: userId,
        }

        if (req?.files?.attachment) {
            data.attachment = await uploadFiles(req.files.attachment, "attachment");
        }

        await prisma.$transaction(async (tx) => {
            const result: any = await tx.receipt.update({
                where: { id: parseInt(req.body.id) },
                data: data
            });
            if (!result) {
                throw new Error("invalid id");
            }

            if (req.body.methodAdjustmentType === "AgainstReference" && req.body.reference != "") {
                const receipt = await tx.receipt.findFirst({ where: { id: parseInt(req.body.id) }, include: { receiptAgainst: true } });
                let ref = JSON.parse(req.body.reference);
                if (receipt) {
                    const oldReceiptAgainst = receipt?.receiptAgainst;
                    const newReceiptAgainst = ref.filter((row: any) => row?.id && row?.id != 0);
                    const diff = differenceBy(newReceiptAgainst, oldReceiptAgainst, 'id');
                    if (diff.length > 0) {
                        const deleteItemIds = diff.map((row: any) => row.id);
                        await tx.receiptAgainst.updateMany({
                            where: { parentId: parseInt(req.body.id), id: { in: deleteItemIds } },
                            data: { isDelete: true }
                        });
                    }
                    for (let i in ref) {
                        let sales = await tx.sales.findFirst({ where: { id: ref[i].salesId }, select: { id: true, invoiceNo: true, invoiceDate: true, netAmount: true, outstanding: true } });
                        if (sales) {
                            let outstanding = sales.netAmount.minus(parseFloat(ref[i].amount));
                            let getPayment = await tx.receiptAgainst.aggregate({
                                where: {
                                    id: { not: ref[i]?.id || 0 },
                                    salesId: ref[i].salesId,
                                    isDelete: false
                                },
                                _sum: { amount: true }
                            });
                            if (getPayment._sum.amount && getPayment._sum.amount.toNumber() > 0) {
                                outstanding.minus(getPayment._sum.amount);
                            }
                            await tx.sales.update({ where: { id: ref[i].salesId }, data: { outstanding: outstanding } });

                            await tx.receiptAgainst.upsert({
                                where: { id: ref[i].id },
                                update: {
                                    particularId: particular.id,
                                    particularName: particular.billingName as string,
                                    salesId: sales.id,
                                    date: new Date(req.body.date),
                                    netAmount: sales.netAmount,
                                    dueAmount: sales.outstanding,
                                    amount: parseFloat(ref[i].amount)
                                },
                                create: {
                                    parentId: parseInt(req.body.id),
                                    particularId: particular.id,
                                    particularName: particular.billingName as string,
                                    salesId: sales.id,
                                    date: new Date(req.body.date),
                                    netAmount: sales.netAmount,
                                    dueAmount: sales.outstanding,
                                    amount: parseFloat(ref[i].amount)
                                }
                            });
                        }
                    }
                }
            }
            await activityLog(req.body.db_name, "UPDATE", "receipt", req.body, userId);
            const txData: txParams[] = [{
                txMode: "RECEIPT",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "RECEIPT",
                userId: userId,
            }, {
                txMode: "RECEIPT",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "RECEIPT",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Receipt Updated Successfully' });
    } catch (error) {
        console.error("Error ", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data = await prisma.receipt.findFirst({ where: { id: req.body.id }, include: { receiptAgainst: { where: { isDelete: false }, include: { sales: { select: { invoiceNo: true, invoiceDate: true, outstanding: true } } } } } });
        if (data) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid receipt id" });
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

        const total = await prisma.receipt.count({
            where: where
        });

        const receipt = await prisma.receipt.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: receipt, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error("Error getting receipt:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const deleteReceipt = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id
        const deletePaymentData = await prisma.receipt.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });
        await prisma.transaction.updateMany({ where: { txMode: "RECEIPT", refId: id }, data: { isDelete: true } });
        await activityLog(db_name, "DELETE", "receipt", req.body, userId);
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Receipt Deleted Successfully' });
    } catch (error) {
        console.error("Error deleting payment:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const search = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        let where: any = { billToId: req.body.billToId, outstanding: { gt: 0 }, isDelete: false, isCancel: false };
        if (req.body.term !== "") {
            where.invoiceNo = { contains: req.body.term, mode: "insensitive" }
        }
        const sales = await prisma.sales.findMany({
            where: where,
            take: 100
        });
        let data = [];
        for (let x in sales) {
            data.push({
                id: sales[x].id,
                date: sales[x].invoiceDate,
                name: sales[x].invoiceNo,
                netAmount: sales[x].netAmount,
                dueAmount: sales[x].outstanding.toNumber()
            })
        }

        return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
    } catch (e: any) {
        console.log('e::: ', e);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const download = async (req: Request, res: Response) => {
    try {

        const prisma = getPrismaClient(req.body.db_name);
        const data: any = await prisma.receipt.findFirst({ where: { id: req.body.id }, include: { receiptAgainst: { where: { isDelete: false } } } });
        if (data) {

            const Accledger = await prisma.ledger.findFirst({ where: { id: data.accId as number } });
            data.Estimation = "RECEIPT VOUCHER ";
            data.Accledger = Accledger;
            data.date = moment(data.date).format('YYYY-MM-DD')

            data.company = await getCompanyByDbName(req.body.db_name)
            data.netAmountInWord = await getInWord(data.amount)

            const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            const html: any = await renderFile('pdf/receipt.ejs', data);
            await page.setContent(html);
            const settings: any = getPdfSetting();
            const pdf = await page.pdf(settings);

            await browser.close();

            res.setHeader('Content-disposition', `attachment; filename=receipt.pdf`);
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