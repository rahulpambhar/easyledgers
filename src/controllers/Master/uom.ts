import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog } from "../../helpers/general";
import { replaceNullWithString } from "../../utils";

export const insertUom = async (req: Request, res: Response) => {
    try {
        const { name, shortname, decimalNumber, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const existing = await prisma.uom.findFirst({
            where: {
                name: req.body.name,
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'uom with the same name already exists.' });
        }

        const newUom = await prisma.uom.create({
            data: {
                name,
                shortname,
                decimalNumber,
                createdBy: userId,
            },
        });

        if (newUom) {
            await activityLog(db_name, "INSERT", "uom", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: "Uom created successfully", });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Uom creation unsuccessful", });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateUom = async (req: Request, res: Response) => {
    try {
        const { id, decimalNumber, db_name } = req.body;
        const prisma = getPrismaClient(db_name);
        const userId = req.cookies.id;

        const updatedUom = await prisma.uom.update({
            where: { id: id },
            data: {
                decimalNumber,
                updateBy: userId,
            },
        });

        if (updatedUom) {
            await activityLog(db_name, "UPDATE", "uom", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: "Uom updated successfully" });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "Uom update unsuccessful" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteUom = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;
        const userId = req.cookies.id

        const prisma = getPrismaClient(db_name);

        const deleteUomdata = await prisma.uom.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId,
            },
        });

        if (deleteUomdata) {
            await activityLog(db_name, "DELETE", "uom", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: "Uom deleted successfully" });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: "No data found" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getUomById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.uom.findFirst({
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

export const getUom = async (req: Request, res: Response) => {
    try {
        const { db_name } = req.body;

        const prisma = getPrismaClient(db_name);
        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.OR = [{ name: { contains: req.body.term, mode: "insensitive" } }, { shortname: { contains: req.body.term, mode: "insensitive" } }]
        }

        const total = await prisma.uom.count({
            where: where
        });

        const results = await prisma.uom.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where,
        });

        if (results) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    };
}

export const searchUom = async (req: Request, res: Response) => {
    try {
        const { db_name, term } = req.body;
        const prisma = getPrismaClient(db_name);

        let where: any = { isDelete: false };
        if (term !== "") {
            where.OR = [{ name: { contains: req.body.term, mode: "insensitive" } }, { shortname: { contains: req.body.term, mode: "insensitive" } }]
        }

        const uom = await prisma.uom.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: uom });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}