// controllers/transportController.ts

import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import StatusCodes from "http-status-codes";
import { activityLog } from "../../helpers/general";
import { replaceNullWithString } from "../../utils";

export const insertTransport = async (req: Request, res: Response) => {
    try {
        const { name, phoneNumber, AltPhoneNumber, address, state, city, country, gstNo, pincode, db_name } = req.body;
        const userId = req.cookies.id
        const prisma = getPrismaClient(db_name);

        const existing = await prisma.transport.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Transport with the same name already exists.' });
        }

        const newTransport = await prisma.transport.create({
            data: {
                name, phoneNumber, AltPhoneNumber, address, state, city, country, gstNo, pincode, createBy: userId,
            }
        });

        if (newTransport) {
            await activityLog(db_name, "INSERT", "transport", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Transport Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Transport creation unsuccessful!' });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateTransport = async (req: Request, res: Response) => {
    try {
        const { id, name, phoneNumber, AltPhoneNumber, address, state, city, country, gstNo, pincode, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.transport.findFirst({
            where: {
                id: {
                    not: req.body.id
                },
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Transport with the same name already exists.' });
        }

        const updatedTransport = await prisma.transport.update({
            where: { id: id },
            data: {
                name, phoneNumber, AltPhoneNumber, address, state, city, country, gstNo, pincode, updateBy: userId,
            }
        });

        if (updatedTransport) {
            await activityLog(db_name, "UPDATE", "transport", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Transport Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Transport Updation unsuccessful!' });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteTransport = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;
        const userId = req.cookies.id
        const prisma = getPrismaClient(db_name);

        const deleteTransportData = await prisma.transport.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });

        if (deleteTransportData) {
            await activityLog(db_name, "DELETE", "transport", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Transport Deleted Successfully' });
        } else {
            return res.json({ st: true, statusCode: StatusCodes.BAD_REQUEST, msg: 'Transport Not Found' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getTransportById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.transport.findFirst({
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

export const getTransports = async (req: Request, res: Response) => {
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
        const total = await prisma.transport.count({
            where: where
        });

        const results = await prisma.transport.findMany({
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

export const searchTransport = async (req: Request, res: Response) => {
    try {
        const { db_name } = req.body;
        const prisma = getPrismaClient(db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const transports = await prisma.transport.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: transports });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}