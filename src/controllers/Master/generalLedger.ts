import { Request, Response, response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { replaceNullWithString } from "../../utils";

export const insertGeneralLedger = async (req: Request, res: Response) => {
    try {
        const { name, parent } = req.body;
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id

        const existing = await prisma.generalLedger.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'gl group with the same name already exists.' });
        }

        const gl = await prisma.generalLedger.create({
            data: {
                name: name,
                parent: parent,
                createBy: userId
            },
        });

        if (gl) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'GL Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateGeneralLedger = async (req: Request, res: Response) => {
    try {
        const { id, name, parent } = req.body;
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        if (id <= 34) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'base gl group not editable' });
        }

        const existing = await prisma.generalLedger.findFirst({
            where: {
                id: {
                    not: id
                },
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'gl group with the same name already exists.' });
        }

        const gl = await prisma.generalLedger.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: name,
                parent: parent,
                updateBy: userId,
            },
        });

        if (gl) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'GL Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteGeneralLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const { id } = req.body;

        if (id <= 34) {
            return res.json({ st: false, statusCode: StatusCodes.OK, msg: 'Base GL can not be deleted' });
        }

        const gl = await prisma.generalLedger.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isDelete: true
            },
        });


        if (gl) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'GL Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getGeneralLedgerById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.generalLedger.findFirst({
            where: {
                id: Number(req.body.id)
            },
            include: {
                parentGL: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
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

export const getGeneralLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const total = await prisma.generalLedger.count({
            where: where
        });

        const results = await prisma.generalLedger.findMany({
            skip: offset,
            take: limit,
            include: {
                parentGL: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                id: 'desc',
            },
            where: where
        });
        if (results) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });
        } else {
            res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const searchGeneralLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        let where: any;
        if (req.body?.isCreateDropDown) {
            const ids = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
            where = { isDelete: false, id: { in: ids } };
        } else {
            where = { isDelete: false, id: { notIn: [1, 2, 3, 4, 25] } };
        }
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }
        const results = await prisma.generalLedger.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}