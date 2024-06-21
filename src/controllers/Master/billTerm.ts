import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog } from "../../helpers/general";
import { replaceNullWithString } from "../../utils";

export const insertBillTerm = async (req: Request | any, res: Response) => {
    try {
        const { name, term, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const existingBillTerm = await prisma.billTerm.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existingBillTerm) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'bill Term with the same name already exists.' });
        }

        const billTerm = await prisma.billTerm.create({
            data: {
                name,
                term,
                createdBy: req.cookies.id
            }
        });

        if (billTerm) {
            await activityLog(db_name, "INSERT", "billTerm", req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'bill Term Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'bill Term creation unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateBillTerm = async (req: Request | any, res: Response) => {
    try {
        const { id, name, code, term, db_name } = req.body;
        const prisma = getPrismaClient(db_name);

        const existingBillTerm = await prisma.billTerm.findFirst({
            where: {
                id: {
                    not: id
                },
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (existingBillTerm) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'bill Term with the same name already exists.' });
        }

        const updatedBillTerm = await prisma.billTerm.update({
            where: { id: id },
            data: {
                name,
                term,
                updateBy: req.cookies.id
            }
        });

        if (updatedBillTerm) {
            await activityLog(db_name, "UPDATE", "billTerm", req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'bill Term Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'bill Term update unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteBillTerm = async (req: Request, res: Response) => {
    try {
        const userId = req.cookies.id
        const { id, db_name } = req.body;
        const prisma = getPrismaClient(db_name);

        const billTerm = await prisma.billTerm.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId,
            },
        });

        if (billTerm) {
            await activityLog(db_name, "DELETE", "bill Term", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'bill Term Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'bill Term deleted unsuccess!' });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getBillTermById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.billTerm.findFirst({
            where: {
                id: Number(req.body.id)
            }
        });
        if (results) {
            const data = replaceNullWithString(results);
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getBillTerm = async (req: Request, res: Response) => {
    try {
        const { db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const total = await prisma.billTerm.count({
            where: where
        });

        const results = await prisma.billTerm.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where
        });

        if (results) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (error) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: 'Something went wrong' });
    }
};

export const searchBillTerm = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }
        const results = await prisma.billTerm.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}