import { Request, Response } from 'express';
import { getPrismaClient } from "../../helpers/prisma";
import { StatusCodes } from "http-status-codes";
import { getGLHistory, getGLChildHistory, getInventoryOpeningStock, getInventoryStock, getAccountOpeningStock, getAccountClosingStock, getGLHistoryById } from "../../helpers/report";
import { getCompanyByDbName } from "../../helpers/general";
import moment from "moment";
import { sumBy } from "lodash";

export const trialBalance = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to } = req.body;
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        const companyInfo = await getCompanyByDbName(db_name);
        const glIds = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const data = await getGLHistory(db_name, fromDate, toDate, glIds, companyInfo);

        return res.json({ st: true, statusCode: StatusCodes.OK, data: data });
    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
}

export const trading = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to } = req.body;

        const companyInfo = await getCompanyByDbName(db_name);
        if (!companyInfo) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid company' });
        }

        let financialFrom = moment(new Date(companyInfo.financialFrom));
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        let opening = 0;
        let closing = 0;
        if (companyInfo.isInventory) {
            let openingStock;
            if (financialFrom.isSame(fromDate)) {
                openingStock = await getInventoryOpeningStock(db_name, true, "", "");
            } else {
                openingStock = await getInventoryOpeningStock(db_name, false, financialFrom, fromDate.subtract(1, 'day'));
            }
            opening = openingStock ? sumBy(openingStock, (values) => values.rate) : 0;
            closing = await getInventoryStock(db_name, fromDate, toDate, openingStock);
        } else {
            opening = await getAccountOpeningStock(db_name, fromDate, companyInfo);
            closing = await getAccountClosingStock(db_name, fromDate, toDate);
        }

        const glIds = [12, 13, 14, 15];
        const data = await getGLHistory(db_name, fromDate, toDate, glIds, companyInfo);

        let sales = 0, purchase = 0, income = 0, expense = 0;
        for (let row of data) {
            if (row.parent === 12 || row.id === 12) {
                if (row.opening < 0) {
                    income += row.cr - (row.dr + row.opening);
                } else {
                    income += (row.cr + row.opening) - row.dr;
                }
            } else if (row.parent === 13 || row.id === 13) {
                if (row.opening < 0) {
                    expense += (row.dr + row.opening) - row.cr;
                } else {
                    expense += row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 14 || row.id === 14) {
                if (row.opening < 0) {
                    sales += row.cr - (row.dr + row.opening);
                } else {
                    sales += (row.cr + row.opening) - row.dr;
                }
            } else {
                if (row.opening < 0) {
                    purchase += (row.dr + row.opening) - row.cr;
                } else {
                    purchase += row.dr - (row.cr + row.opening);
                }
            }
        }

        let gross = (opening + purchase + expense) - (sales + income + closing);

        return res.json({
            st: true, statusCode: StatusCodes.OK,
            data: {
                opening: opening,
                purchase: {
                    id: 15,
                    name: "Purchase",
                    amount: purchase
                },
                expense: {
                    id: 13,
                    name: "Trading Expenses",
                    amount: expense
                },
                leftTotal: opening + purchase + expense,
                income: {
                    id: 12,
                    name: "Trading Income",
                    amount: expense
                },
                sales: {
                    id: 14,
                    name: "Sales",
                    amount: sales
                },
                closing: closing,
                rightTotal: income + sales + closing,
                grossLoss: Math.sign(gross) === -1 ? gross : 0,
                grossProfit: Math.sign(gross) === -1 ? 0 : gross,
            }
        });
    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
}

export const pnl = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to } = req.body;

        const companyInfo = await getCompanyByDbName(db_name);
        if (!companyInfo) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid company' });
        }

        let financialFrom = moment(new Date(companyInfo.financialFrom));
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        let opening = 0;
        let closing = 0;
        if (companyInfo.isInventory) {
            let openingStock;
            if (financialFrom.isSame(fromDate)) {
                openingStock = await getInventoryOpeningStock(db_name, true, "", "");
            } else {
                openingStock = await getInventoryOpeningStock(db_name, false, financialFrom, fromDate.subtract(1, 'day'));
            }
            opening = openingStock ? sumBy(openingStock, (values) => values.rate) : 0;
            closing = await getInventoryStock(db_name, fromDate, toDate, openingStock);
        } else {
            opening = await getAccountOpeningStock(db_name, fromDate, companyInfo);
            closing = await getAccountClosingStock(db_name, fromDate, toDate);
        }

        const glIds = [10, 11, 12, 13, 14, 15];
        const data = await getGLHistory(db_name, fromDate, toDate, glIds, companyInfo);

        let sales = 0, purchase = 0, income = 0, expense = 0;
        let pl_income = 0, pl_expense = 0;

        let result = [];
        for (let row of data) {
            if (row.parent === 10 || row.id === 10) {
                if (row.opening < 0) {
                    row.amount = (row.cr - (row.dr + row.opening)).toFixed(2);
                    pl_income += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = ((row.cr + row.opening) - row.cr).toFixed(2);
                    pl_income += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 11 || row.id === 11) {
                if (row.opening < 0) {
                    row.amount = ((row.dr + row.opening) - row.cr).toFixed(2);
                    pl_expense += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = (row.dr - (row.cr + row.opening)).toFixed(2);
                    pl_expense += row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 12 || row.id === 12) {
                if (row.opening < 0) {
                    row.amount = (row.cr - (row.dr + row.opening)).toFixed(2);
                    income += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = ((row.cr + row.opening) - row.dr).toFixed(2);
                    income += (row.cr + row.opening) - row.dr;
                }
            } else if (row.parent === 13 || row.id === 13) {
                if (row.opening < 0) {
                    row.amount = ((row.dr + row.opening) - row.cr).toFixed(2);
                    expense += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = (row.dr - (row.cr + row.opening)).toFixed(2);
                    expense += row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 14 || row.id === 14) {
                if (row.opening < 0) {
                    row.amount = (row.cr - (row.dr + row.opening)).toFixed(2);
                    sales += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = ((row.cr + row.opening) - row.dr).toFixed(2);
                    sales += (row.cr + row.opening) - row.dr;
                }
            } else {
                if (row.opening < 0) {
                    row.amount = ((row.dr + row.opening) - row.cr).toFixed(2);
                    purchase += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = (row.dr - (row.cr + row.opening)).toFixed(2);
                    purchase += row.dr - (row.cr + row.opening);
                }
            }
            result.push(row);
        }

        let gross = (opening + purchase + expense) - (sales + income + closing);
        let grossLoss = Math.sign(gross) === -1 ? gross : 0;
        let grossProfit = Math.sign(gross) === -1 ? 0 : gross;

        let net = (grossProfit + pl_income) - (pl_expense + grossLoss);
        let netLoss = Math.sign(net) === -1 ? net : 0;
        let netProfit = Math.sign(net) === -1 ? 0 : net;

        return res.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: result,
            opening: { id: 0, amount: opening.toFixed(2) },
            closing: { id: companyInfo.isInventory ? 0 : 34, amount: closing.toFixed(2) },
            grossLoss: grossLoss.toFixed(2),
            grossProfit: grossProfit.toFixed(2),
            leftTotal: (opening + purchase + expense + pl_expense + netProfit + grossLoss).toFixed(2),
            rightTotal: (closing + sales + income + pl_income + netLoss + grossProfit).toFixed(2),
            netLoss: netLoss.toFixed(2),
            netProfit: netProfit.toFixed(2)
        });
    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
}

export const balanceSheet = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to } = req.body;

        const companyInfo = await getCompanyByDbName(db_name);
        if (!companyInfo) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid company' });
        }

        let financialFrom = moment(new Date(companyInfo.financialFrom));
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        let opening = 0;
        let closing = 0;
        if (companyInfo.isInventory) {
            let openingStock;
            if (financialFrom.isSame(fromDate)) {
                openingStock = await getInventoryOpeningStock(db_name, true, "", "");
            } else {
                openingStock = await getInventoryOpeningStock(db_name, false, financialFrom, fromDate.subtract(1, 'day'));
            }
            opening = openingStock ? sumBy(openingStock, (values) => values.rate) : 0;
            closing = await getInventoryStock(db_name, fromDate, toDate, openingStock);
        } else {
            opening = await getAccountOpeningStock(db_name, fromDate, companyInfo);
            closing = await getAccountClosingStock(db_name, fromDate, toDate);
        }

        const glIds = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const data = await getGLHistory(db_name, fromDate, toDate, glIds, companyInfo);

        let sales = 0, purchase = 0, income = 0, expense = 0;
        let pl_income = 0, pl_expense = 0;
        let capital = 0, loans = 0, currentLiabilities = 0;
        let fixedAssets = 0, currentAssets = 0;

        let result = [];
        for (let row of data) {
            if (row.parent === 5 || row.id === 5) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    capital += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.cr;
                    capital += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 6 || row.id === 6) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    loans += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.cr;
                    loans += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 7 || row.id === 7) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    currentLiabilities += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.cr;
                    currentLiabilities += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 8 || row.id === 8) {
                if (row.opening < 0) {
                    row.amount = (row.dr + row.opening) - row.cr;
                    fixedAssets = (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = row.dr - (row.cr + row.opening);
                    fixedAssets = row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 9 || row.id === 9) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    currentAssets += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.cr;
                    currentAssets += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 10 || row.id === 10) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    pl_income += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.cr;
                    pl_income += (row.cr + row.opening) - row.cr;
                }
            } else if (row.parent === 11 || row.id === 11) {
                if (row.opening < 0) {
                    row.amount = (row.dr + row.opening) - row.cr;
                    pl_expense += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = row.dr - (row.cr + row.opening);
                    pl_expense += row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 12 || row.id === 12) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    income += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.dr;
                    income += (row.cr + row.opening) - row.dr;
                }
            } else if (row.parent === 13 || row.id === 13) {
                if (row.opening < 0) {
                    row.amount = (row.dr + row.opening) - row.cr;
                    expense += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = row.dr - (row.cr + row.opening);
                    expense += row.dr - (row.cr + row.opening);
                }
            } else if (row.parent === 14 || row.id === 14) {
                if (row.opening < 0) {
                    row.amount = row.cr - (row.dr + row.opening);
                    sales += row.cr - (row.dr + row.opening);
                } else {
                    row.amount = (row.cr + row.opening) - row.dr;
                    sales += (row.cr + row.opening) - row.dr;
                }
            } else {
                if (row.opening < 0) {
                    row.amount = (row.dr + row.opening) - row.cr;
                    purchase += (row.dr + row.opening) - row.cr;
                } else {
                    row.amount = row.dr - (row.cr + row.opening);
                    purchase += row.dr - (row.cr + row.opening);
                }
            }
            result.push(row);
        }
        let gross = (opening + purchase + expense) - (sales + income + closing);
        let grossLoss = Math.sign(gross) === -1 ? gross : 0;
        let grossProfit = Math.sign(gross) === -1 ? 0 : gross;

        let net = (grossProfit + pl_income) - (pl_expense + grossLoss);
        let netLoss = Math.sign(net) === -1 ? net : 0;
        let netProfit = Math.sign(net) === -1 ? 0 : net;

        return res.json({
            st: true,
            statusCode: StatusCodes.OK,
            data: result,
            netProfit: netProfit,
            netLoss: netLoss,
            opening: opening,
            closing: closing
        });
    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
}

// return gl with cr & dr
export const byGLIdHistory = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to, id } = req.body;
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        const companyInfo = await getCompanyByDbName(db_name);
        const glIds = [id];
        const data = await getGLHistory(db_name, fromDate, toDate, glIds, companyInfo);
        return res.json({ st: true, statusCode: StatusCodes.OK, data: data });

    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
};

// return all child gl list with cr & dr
export const byGLId = async (req: Request, res: Response) => {
    try {
        const { db_name, from, to, id } = req.body;
        const companyInfo = await getCompanyByDbName(db_name);

        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));

        const data = await getGLChildHistory(db_name, fromDate, toDate, id, companyInfo);
        return res.json({ st: true, statusCode: StatusCodes.OK, data: data });

    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
};

export const getLedgersByGLId = async (req: Request, res: Response) => {
    try {
        const { db_name, id, from, to } = req.body;
        const prisma = getPrismaClient(db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const companyInfo = await getCompanyByDbName(db_name);
        let fromDate = moment(new Date(from));
        let toDate = moment(new Date(to));
        const glInfo = await getGLHistoryById(db_name, fromDate, toDate, parseInt(id), companyInfo);

        const total = await prisma.ledger.count({ where: { glId: id, isDelete: false } });
        const ledgers = await prisma.ledger.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                id: 'desc',
            },
            where: {
                glId: id,
                isDelete: false
            },
            include: {
                glGroup: true
            }
        });

        let ledgersList: any[] = [];

        for (let row of ledgers) {

            let dt: any = {
                id: row.id,
                name: row.name,
            };

            const openingTrxSum: any = await prisma.$queryRaw`
            SELECT 
                SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
            FROM transaction
            WHERE "ledgerId" = ${row.id}
            AND "ledgerMode" = 'ACCOUNT_OPENING'
            AND "isDelete" = false;`;

            const trxSum: any = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "ledgerId" = ${row.id}
                AND "ledgerMode" != 'ACCOUNT_OPENING'
                AND "ledgerMode" != 'STOCK_CLOSING'
                AND "isDelete" = false
                AND DATE("date") BETWEEN DATE(${from}) AND DATE(${to})
                OFFSET ${offset}
                LIMIT ${limit};`;

            let opening = parseFloat(openingTrxSum[0].CR || 0) - parseFloat(openingTrxSum[0].DR || 0);
            let cr = Number(trxSum[0].CR);
            let dr = Number(trxSum[0].DR);
            dt.opening = parseFloat(openingTrxSum[0].CR || 0) - parseFloat(openingTrxSum[0].DR || 0);
            dt.cr = Number(trxSum[0].CR);
            dt.dr = Number(trxSum[0].DR);

            if (row.glGroup?.id === 10 || row.glGroup?.parent === 10) {
                if (opening < 0) {
                    dt.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    dt.closing = ((cr + opening) - cr).toFixed(2);
                }
            } else if (row.glGroup?.id === 11 || row.glGroup?.parent === 11) {
                if (opening < 0) {
                    dt.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    dt.closing = (dr - (cr + opening)).toFixed(2);
                }
            } else if (row.glGroup?.id === 12 || row.glGroup?.parent === 12) {
                if (opening < 0) {
                    dt.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    dt.closing = ((cr + opening) - dr).toFixed(2);
                }
            } else if (row.glGroup?.id === 13 || row.glGroup?.parent === 13) {
                if (opening < 0) {
                    dt.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    dt.closing = (dr - (cr + opening)).toFixed(2);
                }
            } else if (row.glGroup?.id === 14 || row.glGroup?.parent === 14) {
                if (opening < 0) {
                    dt.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    dt.closing = ((cr + opening) - dr).toFixed(2);
                }
            } else {
                if (opening < 0) {
                    dt.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    dt.closing = (dr - (cr + opening)).toFixed(2);
                }
            }

            ledgersList.push(dt);
        }

        return res.json({ st: true, statusCode: StatusCodes.OK, total_rows: total, total_pages: Math.ceil(total / limit), data: ledgersList, glInfo: glInfo });

    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
};

export const getMonthlyByLedgerId = async (req: Request, res: Response) => {
    try {
        const { db_name, id, from, to } = req.body;
        const prisma = getPrismaClient(db_name);

        const ledger = await prisma.ledger.findFirst({
            where: { id: id },
            include: {
                glGroup: true
            }
        });
        if (ledger) {
            const openingTrxSum: any = await prisma.$queryRaw`
            SELECT 
                SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
            FROM transaction
            WHERE "ledgerId" = ${id}
            AND "ledgerMode" = 'ACCOUNT_OPENING'
            AND "isDelete" = false;`;

            const transactions: any[] = await prisma.$queryRaw`
                SELECT
                    EXTRACT(month FROM "date") AS month,
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "cr",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "dr"
                FROM transaction
                WHERE "ledgerId" = ${id}
                    AND "txMode" != 'DELIVERY_NOTE'
                    AND "ledgerMode" != 'ACCOUNT_OPENING'
                    AND "isDelete" = false
                    -- AND DATE("date") BETWEEN DATE(${from}) AND DATE(${to})
                    GROUP BY month
                    ORDER BY month;`;

            let opening = (openingTrxSum[0].CR > 0) ? openingTrxSum[0].CR : -openingTrxSum[0].DR;

            let closing = opening;
            for (let row of transactions) {

                let opn = closing;
                let cr = parseFloat(parseFloat(String(row.cr)).toFixed(2));
                let dr = parseFloat(parseFloat(String(row.dr)).toFixed(2));

                if (ledger.glGroup?.id === 10 || ledger.glGroup?.parent === 10) {
                    if (opn < 0) {
                        closing = (cr - (dr + opn)).toFixed(2);
                    } else {
                        closing = ((cr + opn) - cr).toFixed(2);
                    }
                } else if (ledger.glGroup?.id === 11 || ledger.glGroup?.parent === 11) {
                    if (opn < 0) {
                        closing = ((dr + opn) - cr).toFixed(2);
                    } else {
                        closing = (dr - (cr + opn)).toFixed(2);
                    }
                } else if (ledger.glGroup?.id === 12 || ledger.glGroup?.parent === 12) {
                    if (opn < 0) {
                        closing = (cr - (dr + opn)).toFixed(2);
                    } else {
                        closing = ((cr + opn) - dr).toFixed(2);
                    }
                } else if (ledger.glGroup?.id === 13 || ledger.glGroup?.parent === 13) {
                    if (opn < 0) {
                        closing = ((dr + opn) - cr).toFixed(2);
                    } else {
                        closing = (dr - (cr + opn)).toFixed(2);
                    }
                } else if (ledger.glGroup?.id === 14 || ledger.glGroup?.parent === 14) {
                    if (opn < 0) {
                        closing = (cr - (dr + opn)).toFixed(2);
                    } else {
                        closing = ((cr + opn) - dr).toFixed(2);
                    }
                } else {
                    if (opn < 0) {
                        closing = ((dr + opn) - cr).toFixed(2);
                    } else {
                        closing = (dr - (cr + opn)).toFixed(2);
                    }
                }
                row.opening = opn;
                row.closing = closing;
            }

            return res.json({ st: true, statusCode: StatusCodes.OK, ledgerName: ledger.name, id: id, opening: opening, data: transactions });
        } else {
            return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: "invalid ledger id" });
        }
    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
};

export const getLedgerInfoByMonth = async (req: Request, res: Response) => {
    try {
        const { db_name, month } = req.body;
        const prisma = getPrismaClient(db_name);

        const page = parseInt(req.body.page, 10) || 1;
        const limit = parseInt(req.body.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const ledger = await prisma.ledger.findFirst({ where: { id: parseInt(req.body.ledgerId) } });

        const txCount: any = await prisma.$queryRaw`
            SELECT count(t.id) as total
                FROM "transaction" t
                JOIN ledger l ON t."ledgerId" = l.id
            WHERE EXTRACT(MONTH FROM t.date) = ${month}
            AND t."ledgerId" = ${req.body.ledgerId};`;

        const transactions: any = await prisma.$queryRaw`
            SELECT t.*,  l.name AS ledgerName    
                FROM "transaction" t
                JOIN ledger l ON t."ledgerId" = l.id
            WHERE EXTRACT(MONTH FROM t.date) =${month}
            AND t."ledgerId" = ${req.body.ledgerId}
            OFFSET ${offset}
            LIMIT ${limit};`;

        let data = [];
        for (let row of transactions) {
            if (row?.txMode === "PAYMENT") {
                const data = await prisma.payment.findFirst({
                    where: { id: row.refId },
                    include: {
                        account: {
                            select: { id: true, name: true }
                        },
                        particular: {
                            select: { id: true, name: true }
                        }
                    }
                });
                row.invoiceNo = data?.invoiceNo as string;
                if (data?.accId === row?.refId) {
                    row.ledgerName = data?.particular.name as string;
                } else {
                    row.ledgerName = data?.account.name as string;
                }
            } else if (row?.txMode === "RECEIPT") {
                const data = await prisma.receipt.findFirst({
                    where: { id: row.refId },
                    include: {
                        account: {
                            select: { id: true, name: true }
                        },
                        particular: {
                            select: { id: true, name: true }
                        }
                    }
                });
                row.invoiceNo = data?.invoiceNo as string;
                if (data?.accId === row?.refId) {
                    row.ledgerName = data?.particular.name as string;
                } else {
                    row.ledgerName = data?.account.name as string;
                }
            } else if (row?.txMode === "CONTRA") {
                const data = await prisma.contra.findFirst({
                    where: { id: row.refId },
                    include: {
                        account: {
                            select: { id: true, name: true }
                        },
                        particular: {
                            select: { id: true, name: true }
                        }
                    }
                });
                row.invoiceNo = data?.invoiceNo as string;
                if (data?.accId === row?.refId) {
                    row.ledgerName = data?.particular.name as string;
                } else {
                    row.ledgerName = data?.account.name as string;
                }
            } else if (row?.txMode === "JV") {
                const jVItems = await prisma.jVItems.findMany({
                    where: {
                        jvId: row.refId,
                        isDelete: false
                    },
                    include: {
                        JournalVoucher: true,
                        account: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });
                row.invoiceNo = jVItems[0]?.JournalVoucher?.invoiceNo as string;
                if (jVItems.length > 0) {
                    for (let item of jVItems) {
                        if (item.accId !== row.ledgerId) {
                            row.ledgerName = item.account.name;
                            break;
                        }
                    }
                }
            } else if (row?.txMode === "SALES") {
                const data = await prisma.sales.findFirst({
                    where: { id: row.refId },
                    select: {
                        invoiceNo: true,
                    }
                });
                row.invoiceNo = data?.invoiceNo as string;
                row.ledgerName = ledger?.name;
            } else if (row?.txMode === "DEBIT") {
                const data = await prisma.salesReturn.findFirst({
                    where: { id: row.refId },
                    select: {
                        invoiceNo: true
                    }
                });
                row.txMode = "SALES RETURN"
                row.invoiceNo = data?.invoiceNo as string;
                row.ledgerName = ledger?.name;
            } else if (row?.txMode === "PURCHASE") {
                const data = await prisma.purchase.findFirst({
                    where: { id: row.refId },
                    select: {
                        invoiceNo: true
                    }
                });
                row.invoiceNo = data?.invoiceNo as string;
                row.ledgerName = ledger?.name;
            } else if (row?.txMode === "CREDIT") {
                const data = await prisma.purchaseReturn.findFirst({
                    where: { id: row.refId },
                    select: {
                        invoiceNo: true
                    }
                });
                row.txMode = "PURCHASE RETURN"
                row.invoiceNo = data?.invoiceNo as string;
                row.ledgerName = ledger?.name;
            }

            let item: any = {
                id: row.id,
                refId: row.refId,
                date: row.date,
                txMode: row.txMode,
                ledgerName: row.ledgerName,
                invoiceNo: row.invoiceNo,
                cr: row.txType === "CR" ? row.amount : 0,
                dr: row.txType === "DR" ? row.amount : 0
            }
            data.push(item)
        }

        return res.json({ st: true, statusCode: StatusCodes.OK, total_rows: parseInt(txCount[0].total), total_pages: Math.ceil(parseInt(txCount[0].total) / limit), data: data });

    } catch (error: any) {
        return res.json({ st: false, statusCode: StatusCodes.INTERNAL_SERVER_ERROR, msg: error?.message });
    }
};