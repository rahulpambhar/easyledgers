
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../helpers/prisma';
import jwt from 'jsonwebtoken';
import { getClientIp } from "../../utils";
import { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findFirst({ where: { email } });
        if (!user) {
            return res.json({
                st: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                msg: 'enter email not registered',
            });
        }

        if (user.isBlock) {
            return res.json({
                st: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                msg: 'account are block, please contact admin',
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.json({
                st: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                msg: 'entered password incorrect',
            });
        }

        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'] || "";

        const token = jwt.sign({
            id: user.id,
            ipAddress: ipAddress,
            userAgent: userAgent,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        // await prisma.loginActivity.updateMany({
        //     where: { userId: user.id },
        //     data: { isExpired: true, loggedOutAt: new Date() }
        // });
        await prisma.loginActivity.create({
            data: {
                userId: user.id,
                ipAddress: ipAddress,
                userAgent: userAgent,
                token: token
            }
        });

        return res.json({
            st: true,
            statusCode: StatusCodes.OK,
            token: token
        });
    } catch (e: any) {
        return res.json({
            st: false,
            statusCode: StatusCodes.BAD_REQUEST,
            errors: e.message,
        });

    }
}

export async function insertUser(req: Request, res: Response) {
    try {
        const { name, email, password, gcode, type } = req.body;
        const userId = req.cookies?.id;

        const existing = await prisma.users.findFirst({
            where: {
                email: email,
            },
        });

        if (existing) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'email address already registered' });
        }

        const salt = bcrypt.genSaltSync(10);
        const encryptPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.users.create({
            data: {
                name: name,
                email: email,
                password: encryptPassword,
                gcode: gcode,
                type: type,
                createBy: userId,
            },
        });
        if (user) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'User Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};

export async function updateUser(req: Request, res: Response) {
    try {
        const { id, name, email, password, gcode, type } = req.body;
        const userId = req.cookies.id

        let data: any = {
            name: name,
            email: email,
            type: type,
            gcode: gcode,
            updateBy: userId
        }
        if (password != "") {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(password, salt);
        }

        const user = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: data,
        });

        if (user) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'User Update Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.body;
        const userId = req.cookies.id

        const user = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isDelete: true,
                updateBy: userId
            },
        });

        if (user) {
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'User Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'User Delete Fail' });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};

export async function updateStatus(req: Request, res: Response) {
    try {
        const { id, status } = req.body;
        const userId = req.cookies.id

        const user = await prisma.users.update({
            where: {
                id: parseInt(id)
            },
            data: {
                isBlock: status,
                updateBy: userId
            },
        });

        if (user) {
            return res.json({ st: true, msg: 'User Update Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const results = await prisma.users.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: {
                isDelete: false
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

export const getUserById = async (req: Request, res: Response) => {
    try {
        const results = await prisma.users.findFirst({
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


