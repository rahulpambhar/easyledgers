import { Request, Response } from "express";
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { activityLog, getCompanyByDbName, updateTransaction } from "../../helpers/general";
import { replaceNullWithString } from "../../utils";

export const insertLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const isLedger = await prisma.ledger.findFirst({
            where: {
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (isLedger) {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Ledger Name Already Exist" });
        }

        if (req.body?.isTds) {
            if (!req.body?.pancard) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Pancard is required" });
            }
            if (!req.body?.tdsPer) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "TDS Percentage is required" });
            }
            if (req.body?.tdsPer > 100 || req.body?.tdsPer < 0) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "TDS Percentage is not valid" });
            }
        }

        if (req.body?.isTcs) {
            if (!req.body?.tcsId) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Select TCS section is required" });
            }
        }

        if (req.body?.isGstApplicable) {
            if (!req.body?.gstNumber && req.body?.gstRegType !== "Unregister") {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "GST Number is required" });
            }
            if (!req.body?.taxability) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Taxability is required" });
            }
            // if (!req.body?.tax && req.body?.taxability === "TAXABLE") {
            //     return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "GST is required" });
            // }
        }

        if (req.body?.isBankEnable) {
            if (!req.body?.bankName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Name is required" });
            }
            if (!req.body?.branchName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Branch Name is required" });
            }
            if (!req.body?.bankAccHolderName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Account Holder Name is required" });
            }
            if (!req.body?.bankAccNo) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Account is required" });
            }
            if (!req.body?.bankIfsc) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank IFSC is required" });
            }
            // if (!req.body?.bankSwiftCode) {
            //     return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "bankSwiftCode  is required" });
            // }
        }

        const ledger = await prisma.ledger.create({
            data: {
                glId: req.body.glId,
                name: req.body.name || null,
                email: req.body.email || null,
                phoneNumber: String(req.body.phoneNumber) || null,
                AltPhoneNumber: String(req.body.AltPhoneNumber) || null,
                billingName: req.body.billingName || null,
                address: req.body.address || null,
                state: req.body.state || null,
                city: req.body.city || null,
                pincode: req.body.pincode || null,
                openingBalance: req.body.openingBalance,
                openingType: req.body.openingType,
                closing: req.body.closing,
                dueDays: req.body.dueDays,
                interest: req.body.interest,
                brokerage: req.body.brokerage,
                isTcs: req.body?.isTcs || false,
                buyerType: req.body?.buyerType || null,
                isTds: req.body?.isTds || false,
                tcsId: req.body?.tcsId || null,
                pancard: req.body.pancard || null,
                tdsPer: req.body.tdsPer,
                gstRegType: req.body.gstRegType,
                gstNumber: req.body.gstNumber || null,
                isGstApplicable: req.body.isGstApplicable,
                hsncode: req.body.hsncode || null,
                taxability: req.body.taxability,
                igst: req.body.tax,
                cgst: req.body.tax / 2,
                sgst: req.body.tax / 2,
                typeOfSupply: req.body.typeOfSupply || null,
                isBankEnable: req.body.isBankEnable || false,
                bankName: req.body.bankName || null,
                branchName: req.body.branchName || null,
                bankAccHolderName: req.body.bankAccHolderName || null,
                bankAccNo: String(req.body.bankAccNo) || null,
                bankIfsc: req.body.bankIfsc || null,
                bankSwiftCode: req.body.bankSwiftCode || null,
                isTranspoter: req.body.isTranspoter || false,
                createBy: req.cookies.id,
            },
        });

        if (ledger) {
            if (req.body?.openingBalance > 0) {
                let companyInfo = await getCompanyByDbName(req.body.db_name);
                if (companyInfo) {
                    let txData: txParams[] = [];
                    txData.push({
                        txMode: "NA",
                        voucherId: undefined,
                        groupId: req.body.glId,
                        refId: 0,
                        date: new Date(companyInfo.financialFrom),
                        ledgerId: ledger.id,
                        amount: req.body?.openingBalance,
                        txType: req.body?.openingType,
                        ledgerMode: req.body.glId === 34 ? "STOCK_OPENING" : "ACCOUNT_OPENING",
                        userId: req.cookies.id,
                    });
                    if (req.body.glId === 34 && req.body?.closing) {
                        const closing = req.body?.closing;
                        for (let x in closing) {
                            txData.push({
                                txMode: "NA",
                                voucherId: undefined,
                                groupId: req.body.glId,
                                refId: 0,
                                date: new Date(closing[x].date),
                                ledgerId: ledger.id,
                                amount: closing[x].balance,
                                txType: closing[x].type,
                                ledgerMode: "STOCK_CLOSING",
                                userId: req.cookies.id,
                            });
                        }
                    }
                    await updateTransaction(req.body.db_name, txData);
                }
            }
            await activityLog(req.body.db_name, "INSERT", `ledger`, req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Ledger Inserted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        console.log(e)
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const UpdateLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const isLedger = await prisma.ledger.findFirst({
            where: {
                id: {
                    not: req.body.id
                },
                name: {
                    equals: req.body.name,
                    mode: "insensitive"
                },
                isDelete: false
            },
        });

        if (isLedger) {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Ledger Name Already Exist" });
        }

        if (req.body?.isTds) {
            if (!req.body?.pancard) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Pancard is required" });
            }
            if (!req.body?.tdsPer) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "TDS Percentage is required" });
            }
            if (req.body?.tdsPer > 100 || req.body?.tdsPer < 0) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "TDS Percentage is not valid" });
            }
        }
        if (req.body?.isTcs) {
            if (!req.body?.tcsId) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Select TCS section is required" });
            }
        }

        if (req.body?.isGstApplicable) {
            if (!req.body?.gstNumber && req.body?.gstRegType !== "Unregister") {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "GST Number is required" });
            }
            if (!req.body?.taxability) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Taxability is required" });
            }
            // if (!req.body?.tax) {
            //     return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "tax is required" });
            // }
        }

        if (req.body?.isBankEnable) {
            if (!req.body?.bankName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Name is required" });
            }
            if (!req.body?.branchName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Branch Name is required" });
            }
            if (!req.body?.bankAccHolderName) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Account Holder Name is required" });
            }
            if (!req.body?.bankAccNo) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank Account is required" });
            }
            if (!req.body?.bankIfsc) {
                return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Bank IFSC is required" });
            }
            // if (!req.body?.bankSwiftCode) {
            //     return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "bankSwiftCode  is required" });
            // }
        }
        let data: any = {
            glId: req.body.glId,
            name: req.body.name,
            email: req.body.email,
            phoneNumber: String(req.body.phoneNumber),
            AltPhoneNumber: String(req.body.AltPhoneNumber),
            billingName: req.body.billingName,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pincode: parseInt(req.body.pincode),
            openingBalance: req.body.openingBalance,
            openingType: req.body.openingType,
            closing: req.body?.closing,
            dueDays: req.body.dueDays,
            interest: req.body.interest,
            brokerage: req.body.brokerage,
            isTcs: req.body?.isTcs || false,
            tcsId: req.body?.tcsId || null,
            buyerType: req.body?.buyerType || null,
            isTds: req.body?.isTds || false,
            pancard: req.body.pancard,
            tdsPer: req.body.tdsPer,
            gstRegType: req.body.gstRegType,
            gstNumber: req.body.gstNumber,
            isGstApplicable: req.body.isGstApplicable,
            hsncode: req.body.hsncode,
            taxability: req.body.taxability,
            igst: req.body.tax,
            cgst: req.body.tax / 2,
            sgst: req.body.tax / 2,
            typeOfSupply: req.body.typeOfSupply || null,
            isBankEnable: req.body.isBankEnable,
            bankName: req.body.bankName,
            bankAccHolderName: req.body.bankAccHolderName,
            branchName: req.body.branchName,
            bankAccNo: String(req.body.bankAccNo),
            bankIfsc: req.body.bankIfsc,
            bankSwiftCode: req.body.bankSwiftCode,
            isTranspoter: req.body.isTranspoter,
            updateBy: req.cookies.id,
        }

        if (req.body.id <= 16) {
            data = {
                email: req.body.email,
                phoneNumber: String(req.body.phoneNumber) || null,
                AltPhoneNumber: String(req.body.AltPhoneNumber) || null,
                billingName: req.body.billingName || null,
                address: req.body.address || null,
                state: req.body.state || null,
                city: req.body.city || null,
                pincode: parseInt(req.body.pincode) || null,
                openingBalance: req.body.openingBalance,
                openingType: req.body.openingType,
                closing: req.body?.closing,
                dueDays: req.body.dueDays,
                interest: req.body.interest,
                brokerage: req.body.brokerage,
                isTcs: req.body?.isTcs || false,
                buyerType: req.body?.buyerType || null,
                isTds: req.body?.isTds || false,
                tcsId: req.body?.tcsId || null,
                pancard: req.body.pancard || null,
                tdsPer: req.body.tdsPer || null,
                gstRegType: req.body.gstRegType,
                gstNumber: req.body.gstNumber,
                isGstApplicable: req.body.isGstApplicable || false,
                hsncode: req.body.hsncode,
                taxability: req.body.taxability,
                igst: req.body.tax,
                cgst: req.body.tax / 2,
                sgst: req.body.tax / 2,
                typeOfSupply: req.body.typeOfSupply || null,
                isBankEnable: req.body.isBankEnable || false,
                bankName: req.body.bankName,
                branchName: req.body.branchName,
                bankAccHolderName: req.body.bankAccHolderName,
                bankAccNo: String(req.body.bankAccNo),
                bankIfsc: req.body.bankIfsc,
                bankSwiftCode: req.body.bankSwiftCode,
                isTranspoter: req.body.isTranspoter || false,
                updateBy: req.cookies.id,
            }
        }

        const ledger = await prisma.ledger.update({
            where: {
                id: parseInt(req.body?.id)
            },
            data: data,
        });
        if (ledger) {
            if (parseFloat(req.body?.openingBalance) > 0) {
                let companyInfo = await getCompanyByDbName(req.body.db_name);
                console.log(companyInfo);
                if (companyInfo) {
                    let txData: txParams[] = [];
                    txData.push({
                        txMode: "NA",
                        voucherId: undefined,
                        groupId: req.body.glId,
                        refId: 0,
                        date: new Date(companyInfo.financialFrom),
                        ledgerId: ledger.id,
                        amount: parseFloat(req.body?.openingBalance),
                        txType: req.body?.openingType,
                        ledgerMode: req.body.glId === 34 ? "STOCK_OPENING" : "ACCOUNT_OPENING",
                        userId: req.cookies.id,
                    });
                    if (req.body.glId === 34 && req.body?.closing) {
                        const closing = req.body?.closing;
                        for (let x in closing) {
                            txData.push({
                                txMode: "NA",
                                voucherId: undefined,
                                groupId: req.body.glId,
                                refId: 0,
                                date: new Date(closing[x].date),
                                ledgerId: ledger.id,
                                amount: parseFloat(closing[x].balance),
                                txType: closing[x].type,
                                ledgerMode: "STOCK_CLOSING",
                                userId: req.cookies.id,
                            });
                        }
                    }
                    console.log(txData);
                    await updateTransaction(req.body.db_name, txData);
                }
            }
            await activityLog(req.body.db_name, "UPDATE", `ledger`, req.body, req.cookies.id);
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Ledger Update Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
};

export const deleteLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const { id } = req.body;
        if (id <= 16) {
            return res.json({ st: false, statusCode: StatusCodes.OK, msg: 'Base Ledger can not be deleted' });
        }

        const isLedger = await prisma.ledger.findFirst({
            where: {
                id: parseInt(id),
                isDelete: false
            }
        });

        if (!isLedger) {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "Ledger Not Found" });
        }

        const product = await prisma.ledger.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isDelete: true
            },
        });

        if (product) {
            await prisma.transaction.updateMany({ where: { ledgerId: parseInt(id) }, data: { isDelete: true } });
            return res.json({ st: true, statusCode: StatusCodes.OK, msg: 'Ledger Deleted Successfully' });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "something went wrong" });
        }
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getLedgerById = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);
        const { id } = req.body;

        const results = await prisma.ledger.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                glGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                tcs: {
                    select: {
                        id: true,
                        name: true
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

export const getLedgerByGLGroup = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { glId: { in: req.body.glId }, isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.ledger.findMany({
            where: where,
            select: {
                id: true,
                name: true,
                glGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                billingName: true,
                address: true,
                state: true,
                city: true,
                pincode: true,
                gstNumber: true,
                hsncode: true,
                taxability: true,
                igst: true,
                cgst: true,
                sgst: true,
                typeOfSupply: true,
                isTds: true,
                tdsPer: true,
                billToSales: {
                    where: {
                        isDelete: false
                    },
                },
                isTcs: true,
                tcs: true,
                tcsId: true,
            },
        });

        const sumResult = results.map((item: any) => {
            let saleSum = 0;
            item.billToSales.forEach((x: any) => {
                saleSum += parseInt(x.netAmount);
            });
            return { ...item, saleSum };
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: sumResult });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}

export const getLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const total = await prisma.ledger.count({
            where: where
        });

        const results = await prisma.ledger.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: where,
            include: {
                glGroup: {
                    select: {
                        name: true
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

export const searchLedger = async (req: Request, res: Response) => {
    try {
        const prisma = getPrismaClient(req.body.db_name);

        let where: any = { isDelete: false };
        if (req.body.term !== "") {
            where.name = { contains: req.body.term, mode: "insensitive" }
        }

        const results = await prisma.ledger.findMany({
            where: where,
            take: 50
        });

        return res.json({ st: true, statusCode: StatusCodes.OK, data: results });
    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: e.message });
    }
}