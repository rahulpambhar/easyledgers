import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog } from '../../helpers/general';
import { replaceNullWithString } from "../../utils";

export const insertWarehouse = async (req: Request, res: Response) => {
    try {
        const { name, phoneNumber, AltPhoneNumber, address, pincode, city, state, area, email, db_name } = req.body;
        const userId = req.cookies.id;

        const prisma = getPrismaClient(db_name);

        const existing = await prisma.warehouse.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Warehouse with the same code already exists.' });
        }

        const newWarehouse = await prisma.warehouse.create({
            data: {
                name,
                address,
                pincode,
                city,
                state,
                area,
                phoneNumber,
                AltPhoneNumber,
                email,
                createdBy: userId,
            },
        });

        if (newWarehouse) {
            await activityLog(db_name, "INSERT", "warehouse", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Warehouse Created Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Warehouse created unsuccess !' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const updateWarehouse = async (req: Request, res: Response) => {
    try {
        const { id, name, address, entries, pincode, city, state, area, phoneNumber, AltPhoneNumber, email, db_name } = req.body;
        const userId = req.cookies.id;

        const prisma = getPrismaClient(db_name);

        const existing = await prisma.warehouse.findFirst({
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
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Warehouse with the same code already exists.' });
        }

        const updatedWarehouse = await prisma.warehouse.update({
            where: { id: id },
            data: {
                name,
                address,
                pincode,
                city,
                state,
                area,
                phoneNumber,
                AltPhoneNumber,
                email,
                updateBy: userId,
            },
        });

        if (updatedWarehouse) {
            await activityLog(db_name, "UPDATE", "warehouse", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Warehouse Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Warehouse updated unsuccess !' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
    try {
        const { id, db_name } = req.body;
        const userId = req.cookies.id;
        const prisma = getPrismaClient(db_name);

        const updatedData = await prisma.warehouse.update({
            where: { id: id },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });

        if (updatedData) {
            await activityLog(db_name, "DELETE", "warehouse", req.body, userId);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Warehouse Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Warehouse Not Found' });
        }


    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getWarehouseById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.warehouse.findFirst({
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

export const getWarehouses = async (req: Request, res: Response) => {
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
        const total = await prisma.warehouse.count({
            where: where
        });

        const results = await prisma.warehouse.findMany({
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

export const searchWarehouse = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const getWarehouses = await prisma.warehouse.findMany({
            where: where,
        });


        return res.json({ st: true, statusCode: StatusCodes.OK, data: getWarehouses });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};
