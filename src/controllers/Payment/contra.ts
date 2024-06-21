import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog, checkInvoiceNo, getVoucher, nextInvoice, updateTransaction, getLedger, getCompanyByDbName } from "../../helpers/general";
import { uploadFiles, getInWord, getPdfSetting } from '../../utils';
import moment from 'moment';
import puppeteer from 'puppeteer';
import { renderFile } from 'ejs';

export const getInvoiceNumber = async (req: Request, res: Response) => {
    try {
        const voucher = await getVoucher(req.body.db_name, req.body.voucherId)
        if (voucher) {
            const invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, req.body.voucherId, "CONTRA");
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
            const saleData = await checkInvoiceNo(req.body.db_name, "CONTRA", req.body.invoiceNo);
            if (saleData) {
                return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'invoice number already exists' });
            }
        } else {
            invoiceNo = await nextInvoice(req.body.db_name, voucher.prefix || "", voucher.numberMethod, parseInt(req.body.voucherId), "CONTRA");
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
        const result: any = await prisma.contra.create({
            data: data
        });

        if (result) {
            await activityLog(req.body.db_name, "INSERT", "contra", req.body, userId);
            const txData: txParams[] = [{
                txMode: "CONTRA",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "CONTRA",
                userId: userId,
            }, {
                txMode: "CONTRA",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "CONTRA",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Contra Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Contra not created' });
        }

    } catch (error) {
        console.error("Error ", error);
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
            referenceNo: req.body.referenceNo,
            referenceMode: req.body.referenceMode,
            referenceDate: req.body?.referenceDate ? new Date(req.body?.referenceDate) : null,
            narration: req.body.narration,
            updateBy: userId,
        }

        if (req?.files?.attachment) {
            data.attachment = await uploadFiles(req.files.attachment, "attachment");
        }

        const result: any = await prisma.contra.update({
            where: { id: parseInt(req.body.id) },
            data: data
        });

        if (result) {
            await activityLog(req.body.db_name, "UPDATE", "contra", req.body, userId);
            const txData: txParams[] = [{
                txMode: "CONTRA",
                voucherId: parseInt(req.body.voucherId),
                groupId: account.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.accId),
                amount: parseFloat(req.body.amount),
                txType: "DR",
                ledgerMode: "CONTRA",
                userId: userId,
            }, {
                txMode: "CONTRA",
                voucherId: parseInt(req.body.voucherId),
                groupId: particular.glId as number,
                refId: result.id,
                date: new Date(req.body.date),
                ledgerId: parseInt(req.body.particularId),
                amount: parseFloat(req.body.amount),
                txType: "CR",
                ledgerMode: "CONTRA",
                userId: userId,
            }]
            await updateTransaction(req.body.db_name, txData)
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Contra Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Contra not updated' });
        }
    } catch (error) {
        console.error("Error ", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
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

        const total = await prisma.contra.count({
            where: where
        });

        const contra = await prisma.contra.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: contra, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (error) {
        console.error("Error getting payments:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data = await prisma.contra.findFirst({ where: { id: req.body.id } });
        if (data) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Invalid sale order id" });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteContra = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id
        const deletePaymentData = await prisma.contra.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });
        await prisma.transaction.updateMany({ where: { txMode: "CONTRA", refId: id }, data: { isDelete: true } });
        await activityLog(db_name, "DELETE", "contra", req.body, userId);
        return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Contra Deleted Successfully' });
    } catch (error) {
        console.error("Error deleting Contra:", error);
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const download = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const data: any = await prisma.contra.findFirst({ where: { id: req.body.id }, });
        if (data) {

            data.date = moment(data.date).format('YYYY-MM-DD')
            data.company = await getCompanyByDbName(req.body.db_name)
            data.account = await getLedger(req.body.db_name, data.accId)
            data.particular = await getLedger(req.body.db_name, data.particularId)
            data.amountInWord = await getInWord(data.amount)


            const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            const html: any = await renderFile('pdf/contra.ejs', data);
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