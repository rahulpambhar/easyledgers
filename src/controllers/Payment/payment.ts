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
            const invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, 'PAYMENT');
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
            const saleData = await checkInvoiceNo(req.body.db_name, "PAYMENT", req.body.invoiceNo);
            if (saleData) {
                return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invoice number already exists' });
            }
        } else {
            invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, parseInt(req.body.voucherId), "PAYMENT");
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
                let paymentAgainst = []
                for (let i in ref) {
                    let purchase = await tx.purchase.findFirst({ where: { id: ref[i].purchaseId }, select: { id: true, invoiceNo: true, invoiceDate: true, netAmount: true, outstanding: true } });
                    if (purchase) {
                        paymentAgainst.push({
                            particularId: particular.id,
                            particularName: particular.billingName as string,
                            purchaseId: purchase.id,
                            date: new Date(req.body.date),
                            netAmount: purchase.netAmount,
                            dueAmount: purchase.outstanding,
                            amount: parseFloat(ref[i].amount)
                        });
                        await tx.purchase.update({ where: { id: ref[i].purchaseId }, data: { outstanding: { decrement: parseFloat(ref[i].amount) } } });
                    }
                }
                data.paymentAgainst = { createMany: { data: paymentAgainst } }
            }

            const result: any = await tx.payment.create({ data: data });

            const txData: txParams[] = [{
                txMode: "PAYMENT",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "PAYMENT",
                userId: userId,
            }, {
                txMode: "PAYMENT",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "PAYMENT",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)
            await activityLog(req.body.db_name, "INSERT", "payment", req.body, userId);
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Payment Created Successfully' });
    } catch (error) {
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
            const result: any = await tx.payment.update({ where: { id: parseInt(req.body.id) }, data: data });
            if (!result) {
                throw new Error("invalid id");
            }

            if (req.body.methodAdjustmentType === "AgainstReference" && req.body.reference != "") {
                const payment = await tx.payment.findFirst({ where: { id: parseInt(req.body.id) }, include: { paymentAgainst: true } });
                let ref = JSON.parse(req.body.reference);
                if (payment) {
                    const oldPaymentAgainst = payment?.paymentAgainst;
                    const newPaymentAgainst = ref.filter((row: any) => row?.id && row?.id != 0);
                    const diff = differenceBy(newPaymentAgainst, oldPaymentAgainst, 'id');
                    if (diff.length > 0) {
                        const deleteItemIds = diff.map((row: any) => row.id);
                        await tx.paymentAgainst.updateMany({
                            where: { parentId: req.body.id, id: { in: deleteItemIds } },
                            data: { isDelete: true }
                        });
                    }
                    for (let i in ref) {
                        let purchase = await tx.purchase.findFirst({ where: { id: ref[i].purchaseId }, select: { id: true, invoiceNo: true, invoiceDate: true, netAmount: true, outstanding: true } });
                        if (purchase) {
                            let outstanding = purchase.netAmount.minus(parseFloat(ref[i].amount));
                            let getPayment = await tx.paymentAgainst.aggregate({
                                where: {
                                    id: { not: ref[i]?.id || 0 },
                                    purchaseId: ref[i].purchaseId,
                                    isDelete: false
                                },
                                _sum: { amount: true }
                            });
                            if (getPayment._sum.amount && getPayment._sum.amount.toNumber() > 0) {
                                outstanding.minus(getPayment._sum.amount);
                            }
                            await tx.purchase.update({ where: { id: ref[i].purchaseId }, data: { outstanding: outstanding } });

                            await tx.paymentAgainst.upsert({
                                where: { id: ref[i].id },
                                update: {
                                    particularId: particular.id,
                                    particularName: particular.billingName as string,
                                    purchaseId: purchase.id,
                                    date: new Date(req.body.date),
                                    netAmount: purchase.netAmount,
                                    dueAmount: purchase.outstanding,
                                    amount: parseFloat(ref[i].amount)
                                },
                                create: {
                                    parentId: parseInt(req.body.id),
                                    particularId: particular.id,
                                    particularName: particular.billingName as string,
                                    purchaseId: purchase.id,
                                    date: new Date(req.body.date),
                                    netAmount: purchase.netAmount,
                                    dueAmount: purchase.outstanding,
                                    amount: parseFloat(ref[i].amount)
                                }
                            });
                        }
                    }
                }
            } else {
                await tx.paymentAgainst.updateMany({ where: { parentId: parseInt(req.body.id) }, data: { isDelete: true } });
            }
            await activityLog(req.body.db_name, "UPDATE", "payment", req.body, userId);
            const txData: txParams[] = [{
                txMode: "PAYMENT",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "PAYMENT",
                userId: userId,
            }, {
                txMode: "PAYMENT",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "PAYMENT",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)


        });
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Payment Updated Successfully' });

    } catch (error) {
        console.error("Error ", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data = await prisma.payment.findFirst({ where: { id: req.body.id }, include: { paymentAgainst: { where: { isDelete: false }, include: { purchase: { select: { invoiceNo: true, invoiceDate: true, outstanding: true } } } } } });
        if (data) {
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
        const total = await prisma.payment.count({
            where: where
        });

        const payments = await prisma.payment.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: payments, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error("Error getting payments:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id
        const deletePaymentData = await prisma.payment.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });
        await prisma.transaction.updateMany({ where: { txMode: "PAYMENT", refId: id }, data: { isDelete: true } });
        await activityLog(db_name, "DELETE", "payment", req.body, userId);
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Payment Deleted Successfully' });
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
        const purchase = await prisma.purchase.findMany({
            where: where,
            take: 100
        });
        let data = [];
        for (let x in purchase) {
            data.push({
                id: purchase[x].id,
                date: purchase[x].invoiceDate,
                name: purchase[x].invoiceNo,
                netAmount: purchase[x].netAmount,
                dueAmount: purchase[x].outstanding.toNumber()
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
        const data: any = await prisma.payment.findFirst({ where: { id: req.body.id }, include: { paymentAgainst: { where: { isDelete: false } } } });
        if (data) {

            const Accledger = await prisma.ledger.findFirst({ where: { id: data.accId as number } });
            data.Estimation = "PAYMENT RECEIPT";
            data.Accledger = Accledger;
            data.date = moment(data.date).format('YYYY-MM-DD')

            data.company = await getCompanyByDbName(req.body.db_name)
            data.netAmountInWord = await getInWord(data.amount)

            const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            const html: any = await renderFile('pdf/payment.ejs', data);
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