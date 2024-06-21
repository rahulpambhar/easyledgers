import dotenv from "dotenv";
import path from "path";
dotenv.config();
import prisma, { getPrismaClient } from "./src/helpers/prisma";

async function test() {

    const company = await prisma.company.findMany({ where: { isDelete: false }, include: { years: true } });
    if (company.length > 0) {

    }
}

test();