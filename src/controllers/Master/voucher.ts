import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { replaceNullWithString } from "../../utils";

export const insertVoucher = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        const { name, parent, numberMethod, prefix, isBank, bankLedgerId, isDefault } = req.body;

        const existing = await prisma.voucher.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'voucher with the same name already exists.' });
        }

        let data: any = {
            name: name,
            parent: parseInt(parent),
            numberMethod: numberMethod,
            isDefault: isDefault,
            isBank: isBank,
            createBy: userId
        }

        if (numberMethod === 'Automatic_Manual') {
            data.prefix = prefix
        }
        if (isBank) {
            data.bankLedgerId = bankLedgerId;
        }

        const voucher = await prisma.voucher.create({
            data: data,
        });

        if (voucher) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Voucher Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const updateVoucher = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        const { id, name, numberMethod, prefix, isBank, isDefault } = req.body;

        const existing = await prisma.voucher.findFirst({
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
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'voucher with the same name already exists.' });
        }

        let data: any = {
            name: name,
            numberMethod: numberMethod,
            isDefault: isDefault,
            isBank: isBank,
            updateBy: userId
        };

        if (numberMethod === 'Automatic_Manual') {
            data.prefix = prefix
        }
        if (isBank) {
            data.bankLedgerId = req.body.bankLedgerId;
        }

        const voucher = await prisma.voucher.update({
            where: {
                id: parseInt(id)
            },
            data: data,
        });
        if (voucher) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Voucher Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteVoucher = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;
        const { id } = req.body;

        if (id <= 11) {
            return res.json({ st: false, statusCode: StatusCodes.OK, msg: 'Base Voucher can not be deleted' });
        }

        const voucher = await prisma.voucher.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });
        if (voucher) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Voucher Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getVoucherById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.voucher.findFirst({
            where: {
                id: Number(req.body.id)
            },
            include: {
                parentVoucher: {
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
            res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getVoucherByParentId = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.voucher.findMany({
            where: {
                OR: [
                    { id: Number(req.body.parent) },
                    { parent: Number(req.body.parent) }
                ]
            }
        });

        res.json({ st: true, statusCode: StatusCodes.OK, data: results });

    } catch (e: any) {
        res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getVoucher = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }
        const total = await prisma.voucher.count({
            where: where
        });

        const results = await prisma.voucher.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where,
            include: {
                parentVoucher: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });
        if (results) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: results, total_rows: total, total_pages: Math.ceil(total / limit) });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const searchVoucher = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { parent: 0, isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.voucher.findMany({
            where: where,
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

