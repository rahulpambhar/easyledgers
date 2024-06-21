import { Request, Response, response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { replaceNullWithString } from "../../utils";

export const insertProductGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;
        const existing = await prisma.productGroup.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'product name already exists.' });
        }

        const productGroup = await prisma.productGroup.create({
            data: {
                name: req.body.name,
                createBy: userId
            },
        });
        if (productGroup) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Group Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const updateProductGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        const existing = await prisma.productGroup.findFirst({
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
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'group name already exists.' });
        }

        const data = await prisma.productGroup.update({
            where: {
                id: req.body.id
            },
            data: {
                name: req.body.name,
                updateBy: userId
            },
        });

        if (data) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Group Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }

    } catch (e: any) {
        console.log(e)
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteProductGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const { id } = req.body;

        const product = await prisma.productGroup.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isDelete: true
            },
        });

        if (product) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const getProductGroupById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.productGroup.findFirst({
            where: {
                id: Number(req.body.id)
            }
        });
        if (results) {
            return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getProductGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const total = await prisma.productGroup.count({
            where: where
        });

        const results = await prisma.productGroup.findMany({
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
}

export const searchProductGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.productGroup.findMany({
            where: where,
            take: 10
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const insertProduct = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        const existing = await prisma.product.findFirst({
            where: {
                name: req.body.name,
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'product name already exists.' });
        }

        let data: any = {
            name: req.body.name,
            sku: req.body.sku,
            uomId: req.body.uom,
            hsnId: req.body.hsn,
            type: req.body.type,
            isManageSales: req.body.isManageSales,
            saleRate: req.body.isManageSales ? req.body.saleRate : 0,
            saleMinQty: req.body.isManageSales ? req.body.saleMinQty : 0,
            saleMaxQty: req.body.isManageSales ? req.body.saleMaxQty : 0,
            isManagePurchase: req.body.isManagePurchase,
            purchaseRate: req.body.isManagePurchase ? req.body.purchaseRate : 0,
            purchaseMinQty: req.body.isManagePurchase ? req.body.purchaseMinQty : 0,
            purchaseMaxQty: req.body.isManagePurchase ? req.body.purchaseMaxQty : 0,
            StockQty: req.body.openingStock,
            PerQtyRate: req.body.openingRate,
            StockAmount: (req.body.openingStock * req.body.openingRate),
            taxability: req.body.taxability,
            cess: req.body.cess,
            igst: req.body.tax,
            cgst: req.body.tax / 2,
            sgst: req.body.tax / 2,
            createBy: userId
        }

        if (req.body.groupId != "" && req.body.groupId != 0) {
            data.groupId = req.body.groupId;
        }

        const product = await prisma.product.create({
            data: data,
        });
        if (product) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const userId = req.cookies.id;

        const existing = await prisma.product.findFirst({
            where: {
                id: {
                    not: req.body.id
                },
                name: req.body.name,
                isDelete: false,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'product name already exists.' });
        }

        let data: any = {
            name: req.body.name,
            sku: req.body.sku,
            uomId: req.body.uom,
            hsnId: req.body.hsn,
            type: req.body.type,
            isManageSales: req.body.isManageSales,
            saleRate: req.body.isManageSales ? req.body.saleRate : 0,
            saleMinQty: req.body.isManageSales ? req.body.saleMinQty : 0,
            saleMaxQty: req.body.isManageSales ? req.body.saleMaxQty : 0,
            isManagePurchase: req.body.isManagePurchase,
            purchaseRate: req.body.isManagePurchase ? req.body.purchaseRate : 0,
            purchaseMinQty: req.body.isManagePurchase ? req.body.purchaseMinQty : 0,
            purchaseMaxQty: req.body.isManagePurchase ? req.body.purchaseMaxQty : 0,
            StockQty: req.body.openingStock,
            PerQtyRate: req.body.openingRate,
            StockAmount: (req.body.openingStock * req.body.openingRate),
            isNonGst: req.body.isNonGst,
            taxability: req.body.taxability,
            cess: req.body.cess,
            igst: req.body.tax,
            cgst: req.body.tax / 2,
            sgst: req.body.tax / 2,
            updateBy: userId
        }
        if (req.body.groupId != "" && req.body.groupId != 0) {
            data.groupId = req.body.groupId;
        }

        const product = await prisma.product.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: data
        });
        if (product) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Updated Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const { id } = req.body;

        const product = await prisma.product.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isDelete: true
            },
        });

        if (product) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Product Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const results = await prisma.product.findFirst({
            where: {
                id: Number(req.body.id),
            },
            include: {
                hsn: {
                    select: {
                        id: true,
                        code: true,
                    }
                },
                uom: {
                    select: {
                        id: true,
                        shortname: true,
                    }
                }
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

export const getProduct = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.OR = [{ name: { contains: req.body.term, mode: "insensitive" } }, { sku: { contains: req.body.term, mode: "insensitive" } }]
        }

        const total = await prisma.product.count({
            where: where
        });

        const results = await prisma.product.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where,
            include: {
                hsn: {
                    select: {
                        id: true,
                        code: true,
                    }
                },
                uom: {
                    select: {
                        id: true,
                        shortname: true,
                    }
                }
            }
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

export const searchProduct = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.OR = [{ name: { contains: req.body.term, mode: "insensitive" } }, { sku: { contains: req.body.term, mode: "insensitive" } }]
        }

        const results = await prisma.product.findMany({
            where: where,
            include: {
                uom: {
                    select: {
                        id: true,
                        name: true,
                        decimalNumber: true
                    }
                }
            },
            take: 50
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}