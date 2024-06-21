import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { limiter } from "config/rateLimiter";


export const Gstr1 = async (req: Request, res: Response) => {
    try {
        const { db_name } = req.body;
        const prisma = getPrismaClient(db_name);

        const dt = await prisma.transaction.findMany();

        let b2b = {
            voucherCount: 0,
            taxableAmount: 0,
            igst: 0,
            cgst: 0,
            sgst: 0,
            cess: 0,
            tax: 0,
            invoiceAmount: 0
        }

        // return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });

    } catch (error) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};