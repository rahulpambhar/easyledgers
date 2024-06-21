import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../helpers/prisma";
import { getClientIp } from "../utils";
import { StatusCodes } from "http-status-codes";

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'No token provided' });
        const token = authHeader.split(' ')[1];
        // const token = req.signedCookies?.token;
        const decoded: any = verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await prisma.loginActivity.findFirst({ where: { token: token } });
        if (!user) {
            return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'invalid token' });
        }
        if (user.isExpired) {
            return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'token expired' });
        }

        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'] || "";

        console.log(ipAddress);
        console.log(userAgent);
        // if (decoded.ipAddress !== ipAddress || decoded.userAgent !== userAgent) {
        //     return res.status(StatusCodes.UNAUTHORIZED).json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'invalid token' });
        // }
        req.cookies = decoded;
        return next();
    } catch (error) {
        return res.json({ st: false, statusCode: StatusCodes.UNAUTHORIZED, msg: 'invalid token' });
    }
}
