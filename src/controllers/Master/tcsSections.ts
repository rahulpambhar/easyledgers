import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog } from '../../helpers/general';
import { replaceNullWithString } from "../../utils";

export const insertTcs = async (req: Request, res: Response) => {
    try {
        const { name, withoutPan, withPan, thresholdAmt, db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.tcs.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Section  already exists.' });
        }

        const newTcs = await prisma.tcs.create({
            data: {
                name: name,
                withoutPan: parseFloat(withoutPan),
                withPan: parseFloat(withPan),
                thresholdAmt: parseFloat(thresholdAmt),
                createBy: userId
            }
        });

        if (newTcs) {
            await activityLog(db_name, "INSERT", "tcs", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'TCS Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'TCS creation unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateTcs = async (req: Request, res: Response) => {
    try {
        const { name, withoutPan, withPan, thresholdAmt, db_name, } = req.body;

        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.tcs.findFirst({
            where: {
                id: {
                    not: parseInt(req.body.id)
                },
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Section already exists.' });
        }

        const updateTCS = await prisma.tcs.update({
            where: { id: parseInt(req.body.id) },
            data: {
                name: name,
                withoutPan: parseFloat(withoutPan),
                withPan: parseFloat(withPan),
                thresholdAmt: parseFloat(thresholdAmt),
                updateBy: userId,
                updateAt: new Date()
            }
        });

        if (updateTCS) {
            await activityLog(db_name, "UPDATE", "tcs", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'TCS Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'TCS update unsuccessful!' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteTcs = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id


        const existing = await prisma.tcs.findFirst({
            where: {
                id: parseInt(req.body.id),
                isDelete: false,
            },
        });

        if (!existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Tcs with the provided ID does not exist" });
        }

        const deleteTCS = await prisma.tcs.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });

        if (deleteTCS) {
            await activityLog(db_name, "DELETE", "Tcs", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'TCS Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'TCS Not Deleted Successfully' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.tcs.findFirst({
            where: {
                id: Number(parseInt(req.body.id)),
                isDelete: false,
            }
        });
        if (results) {
            const data = replaceNullWithString(results);
            return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Provided Id Not found." });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getTcs = async (req: Request, res: Response) => {
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
        const total = await prisma.tcs.count({
            where: where
        });

        const results = await prisma.tcs.findMany({
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

export const tcsSearch = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.tcs.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}