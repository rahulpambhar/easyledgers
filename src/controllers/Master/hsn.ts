import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog } from '../../helpers/general';
import { replaceNullWithString } from "../../utils";

export const insertHSN = async (req: Request, res: Response) => {
    try {
        const { code, description, tax, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.hsn.findFirst({
            where: {
                code: {
                    equals: code,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'hsn code already exists.' });
        }

        const newHsn = await prisma.hsn.create({
            data: {
                code: code,
                description: description,
                igst: tax,
                cgst: tax / 2,
                sgst: tax / 2,
                createdBy: userId,
            }
        });

        if (newHsn) {
            await activityLog(db_name, "INSERT", "hsn", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'HSN Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'HSN creation unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateHSN = async (req: Request, res: Response) => {
    try {
        const { code, description, tax, db_name, id } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.hsn.findFirst({
            where: {
                id: {
                    not: id
                },
                code: {
                    equals: code,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'hsn code already exists.' });
        }

        const updatedHsn = await prisma.hsn.update({
            where: { id: id },
            data: {
                code: code,
                description: description,
                igst: tax,
                cgst: tax / 2,
                sgst: tax / 2,
                updateBy: userId
            }
        });

        if (updatedHsn) {
            await activityLog(db_name, "UPDATE", "hsn", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'HSN Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'HSN update unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteHSN = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id

        const deleteHSNData = await prisma.hsn.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });

        if (deleteHSNData) {
            await activityLog(db_name, "DELETE", "hsn", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'HSN Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'HSN Not Found' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getHsnById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.hsn.findFirst({
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

export const getHSN = async (req: Request, res: Response) => {
    try {

        const { db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.code = { contains: req.body.term, mode: "insensitive" }
        }
        const total = await prisma.hsn.count({
            where: where
        });

        const results = await prisma.hsn.findMany({
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
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const searchHSN = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.code = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.hsn.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}