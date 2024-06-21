import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog, checkInvoiceNo, getCompanyByDbName, getVoucher, nextInvoice, updateTransaction } from "../../helpers/general";
import { differenceBy } from "lodash";
import moment from "moment";
import { getInWord, getPdfSetting } from "../../utils";
import puppeteer from "puppeteer";
import { renderFile } from 'ejs';

export const getInvoiceNumber = async (req: Request, res: Response) => {
    try {
        const voucher = await getVoucher(req.body.db_name, req.body.voucherId)
        if (voucher) {
            const invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, "JOURNAL");
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

        const voucher = await getVoucher(req.body.db_name, req.body.voucherId);
        if (!voucher) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid voucherId' });
        }

        let invoiceNo = req.body.invoiceNo;
        if (voucher.numberMethod === 'Manual') {
            const saleData = await checkInvoiceNo(req.body.db_name, "JOURNAL", req.body.invoiceNo);
            if (saleData) {
                return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'invoice number already exists' });
            }
        } else {
            invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, parseInt(req.body.voucherId), "JOURNAL");
        }

        let data: any = {
            voucherId: req.body.voucherId,
            invoiceNo: invoiceNo,
            date: new Date(req.body.date),
            narration: req.body.narration,
            createBy: userId,
        }

        if (req?.body?.attachment) {
            data.attachment = req?.body?.attachment;
        }
        await prisma.$transaction(async (tx) => {

            const items = req.body.items;
            let itemsArr: any[] = [];

            for (let row of items) {
                if (row.methodAdjustmentType === "AgainstReference") {
                    for (let ref of row.reference) {
                        if (row.txType === "CR") {
                            await tx.sales.update({ where: { id: ref.id }, data: { outstanding: { decrement: parseFloat(ref.amount) } } });
                        } else {
                            await tx.purchase.update({ where: { id: ref.id }, data: { outstanding: { decrement: parseFloat(ref.amount) } } });
                        }
                    }
                }
                itemsArr.push({
                    accId: row.particular,
                    txType: row.txType,
                    amount: row.amount,
                    methodAdjustmentType: row.methodAdjustmentType,
                    reference: row.reference,
                    createBy: userId
                })
            }
            data.items = { createMany: { data: itemsArr } };
            const result: any = await tx.journalVoucher.create({
                data: data
            });

            let txData: txParams[] = [];
            for (let row of itemsArr) {
                const particular = await tx.ledger.findFirst({ where: { id: row.accId } });
                if (!particular) {
                    continue;
                }
                txData.push({
                    txMode: "JOURNAL",
                    voucherId: req.body.voucherId,
                    groupId: particular.glId as number,
                    refId: result.id,
                    date: new Date(req.body.date),
                    ledgerId: row.accId,
                    amount: row.amount,
                    txType: row.txType,
                    ledgerMode: "JV",
                    userId: userId,
                })
            }
            await updateTransaction(req.body.db_name, txData);
            await activityLog(req.body.db_name, "INSERT", "journalVoucher", req.body, userId);
        });
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'journal Created Successfully' });

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id

        let data: any = {
            date: new Date(req.body.date),
            narration: req.body.narration,
            updateBy: userId,
        }

        if (req?.body?.attachment) {
            data.attachment = req?.body?.attachment;
        }
        let txData: txParams[] = [];
        await prisma.$transaction(async (tx) => {
            const items = req.body.items;
            let itemsArr: any[] = [];

            for (let row of items) {

                if (row.methodAdjustmentType === "AgainstReference") {
                    for (let ref of row.reference) {
                        if (row.txType === "CR") {
                            let sales = await tx.sales.findFirst({ where: { id: ref.id }, select: { id: true, netAmount: true, outstanding: true } });
                            if (sales) {
                                let outstanding = sales.netAmount.minus(parseFloat(ref.amount));
                                let getPayment = await tx.receiptAgainst.aggregate({
                                    where: {
                                        salesId: ref.id,
                                        isDelete: false
                                    },
                                    _sum: { amount: true }
                                });
                                if (getPayment._sum.amount && getPayment._sum.amount.toNumber() > 0) {
                                    outstanding.minus(getPayment._sum.amount);
                                }
                                await tx.sales.update({ where: { id: ref.id }, data: { outstanding: outstanding } });
                            }
                        } else {
                            let purchase = await tx.purchase.findFirst({ where: { id: ref.id }, select: { id: true, netAmount: true, outstanding: true } });
                            if (purchase) {
                                let outstanding = purchase.netAmount.minus(parseFloat(ref.amount));
                                let getPayment = await tx.paymentAgainst.aggregate({
                                    where: {
                                        purchaseId: ref.id,
                                        isDelete: false
                                    },
                                    _sum: { amount: true }
                                });
                                if (getPayment._sum.amount && getPayment._sum.amount.toNumber() > 0) {
                                    outstanding.minus(getPayment._sum.amount);
                                }
                                await tx.purchase.update({ where: { id: ref.id }, data: { outstanding: outstanding } });
                            }
                        }
                    }
                }
                itemsArr.push({
                    id: row?.id || 0,
                    accId: row?.particular || row?.accId,
                    txType: row.txType,
                    amount: row.amount,
                    methodAdjustmentType: row.methodAdjustmentType,
                    reference: row.reference,
                });
            }

            const result = await tx.journalVoucher.update({
                where: { id: req.body.id },
                data: data
            });

            const jv = await tx.journalVoucher.findFirst({ where: { id: req.body.id }, include: { items: true } });

            const oldJv = jv?.items;
            const newJv = itemsArr.filter((row: any) => row?.id && row?.id != 0);
            const diff = differenceBy(newJv, oldJv as any, 'id');
            if (diff.length > 0) {
                const deleteItemIds = diff.filter((row: any) => row.id);
                await tx.jVItems.updateMany({
                    where: { jvId: req.body.id, id: { in: deleteItemIds } },
                    data: { isDelete: true }
                });
            }


            for (let row of itemsArr) {
                const particular = await tx.ledger.findFirst({ where: { id: row.accId } });
                if (!particular) {
                    continue;
                }
                if (!row?.id && row?.id === 0) {
                    await tx.jVItems.create({
                        data: {
                            jvId: parseInt(req.body.id),
                            accId: row.particular,
                            txType: row.txType,
                            amount: row.amount,
                            methodAdjustmentType: row.methodAdjustmentType,
                            reference: row.reference,
                        }
                    });
                } else {
                    await prisma.jVItems.update({
                        where: { id: row?.id },
                        data: {
                            jvId: parseInt(req.body.id),
                            accId: row.particular,
                            txType: row.txType,
                            amount: row.amount,
                            methodAdjustmentType: row.methodAdjustmentType,
                            reference: row.reference,
                        }
                    });
                }

                txData.push({
                    txMode: "JOURNAL",
                    voucherId: req.body.voucherId,
                    groupId: particular.glId as number,
                    refId: result.id,
                    date: new Date(req.body.date),
                    ledgerId: row.accId,
                    amount: row.amount,
                    txType: row.txType,
                    ledgerMode: "JV",
                    userId: userId,
                })
            }
            await updateTransaction(req.body.db_name, txData);
            await activityLog(req.body.db_name, "UPDATE", "journalVoucher", req.body, userId);
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'journalVoucher Updated Successfully' });

    } catch (e: any) {
        console.error("Error ", e);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

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

        const total = await prisma.journalVoucher.count({
            where: where
        });

        const jv = await prisma.journalVoucher.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: jv, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error("Error getting payments:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data = await prisma.journalVoucher.findFirst({ where: { id: req.body.id }, include: { items: true } });
        if (data) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid journalVoucher id" });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteJV = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id
        const deletePaymentData = await prisma.journalVoucher.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });
        await prisma.transaction.updateMany({ where: { txMode: "JOURNAL", refId: id }, data: { isDelete: true } });
        await activityLog(db_name, "DELETE", "journalVoucher", req.body, userId);
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'journalVoucher Deleted Successfully' });
    } catch (error) {
        console.error("Error deleting Contra:", error);
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

        let data: any[] = [];
        if (req.body.type === 'CR') {
            const sales = await prisma.sales.findMany({
                where: where,
                include: {
                    items: {
                        where: {
                            isDelete: false
                        }
                    }
                },
                take: 20
            });

            for (let i in sales) {
                data.push({
                    id: sales[i].id,
                    date: sales[i].invoiceDate,
                    name: sales[i].invoiceNo,
                    netAmount: sales[i].netAmount,
                    dueAmount: sales[i].outstanding.toNumber(),
                    type: "SALES"
                });
            }
        } else {
            const purchase = await prisma.purchase.findMany({
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
            for (let x in purchase) {
                data.push({
                    id: purchase[x].id,
                    date: purchase[x].invoiceDate,
                    name: purchase[x].invoiceNo,
                    netAmount: purchase[x].netAmount,
                    dueAmount: purchase[x].outstanding.toNumber(),
                    type: "PURCHASE"
                });
            }
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
        let data: any = await prisma.journalVoucher.findFirst({
            where: { id: req.body.id },
            include: {
                items: {
                    where: {
                        isDelete: false,
                    },
                    include: { account: { select: { name: true } } },

                }
            }
        });
        if (data) {
            data.date = moment(data.date).format('YYYY-MM-DD')

            data.DRamount = data.items.reduce((acc: any, item: any) => {
                return acc + (item.txType === "DR" ? parseInt(item.amount) : 0);
            }, 0);
            data.CRamount = data.items.reduce((acc: any, item: any) => {
                return acc + (item.txType === "CR" ? parseInt(item.amount) : 0);
            }, 0);

            data.company = await getCompanyByDbName(req.body.db_name)
            data.netAmountInWord = await getInWord(data.items.reduce((acc: any, item: any) => {
                return acc + (item.txType === "CR" ? parseInt(item.amount) : 0);
            }, 0))

            const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            const html: any = await renderFile('pdf/Jv.ejs', data);
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