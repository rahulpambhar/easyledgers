import { sumBy } from "lodash";
import { glAncestors } from "./general";
import { getPrismaClient } from "./prisma";
import moment, { Moment } from "moment";

export const getGLHistoryById = async (db_name: string, from: Moment, to: Moment, glId: number, companyInfo: any) => {
    try {
        const prisma = getPrismaClient(db_name);
        const financialFrom = moment(new Date(companyInfo.financialFrom));

        let openingTrxSum: any;

        if (financialFrom.isSame(from)) {
            openingTrxSum = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${glId}
                AND "ledgerMode" = 'ACCOUNT_OPENING'
                AND "isDelete" = false;`;
        } else {
            openingTrxSum = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${glId}
                AND "ledgerMode" = 'ACCOUNT_OPENING'
                AND "isDelete" = false
                AND DATE("date") BETWEEN DATE(${financialFrom.format("YYYY-MM-DD")}) AND DATE(${from.subtract(1, 'day').format("YYYY-MM-DD")});`;
        }

        const trxSum: any = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${glId}
                AND "isDelete" = false
                AND "ledgerMode" != 'ACCOUNT_OPENING'
                AND "ledgerMode" != 'STOCK_CLOSING'
                AND DATE("date") BETWEEN DATE(${from}) AND DATE(${to});`;

        let opening = parseFloat((parseFloat(openingTrxSum[0].CR || 0) - parseFloat(openingTrxSum[0].DR || 0)).toFixed(2));
        let cr = parseFloat(parseFloat(trxSum[0].CR || 0).toFixed(2));
        let dr = parseFloat(parseFloat(trxSum[0].DR || 0).toFixed(2));

        let closing = 0;
        if (glId === 10) {
            if (opening < 0) {
                closing = (cr - (dr + opening));
            } else {
                closing = ((cr + opening) - cr);
            }
        } else if (glId === 11) {
            if (opening < 0) {
                closing = ((dr + opening) - cr);
            } else {
                closing = (dr - (cr + opening));
            }
        } else if (glId === 12) {
            if (opening < 0) {
                closing = (cr - (dr + opening));
            } else {
                closing = ((cr + opening) - dr);
            }
        } else if (glId === 13) {
            if (opening < 0) {
                closing = ((dr + opening) - cr);
            } else {
                closing = (dr - (cr + opening));
            }
        } else if (glId === 14) {
            if (opening < 0) {
                closing = (cr - (dr + opening));
            } else {
                closing = ((cr + opening) - dr);
            }
        } else {
            if (opening < 0) {
                closing = ((dr + opening) - cr);
            } else {
                closing = (dr - (cr + opening));
            }
        }

        return {
            opening: opening,
            cr: cr,
            dr: dr,
            closing: closing
        }
    } catch (error) {
        return {
            opening: 0,
            cr: 0,
            dr: 0,
            closing: 0
        }
    }
}

export const getGLHistory = async (db_name: string, from: Moment, to: Moment, glIds: number[], companyInfo: any) => {
    try {
        let glList: any[] = [];

        for (let glId of glIds) {
            const getGlList = await glAncestors(db_name, glId);
            let glInfo: any = getGlList[0];
            glInfo.subGL = getGlList.slice(1);
            glList.push(glInfo);
        }

        let result = []
        for (let row of glList) {

            const trxGL = await getGLHistoryById(db_name, from, to, row.id, companyInfo);

            let opening = trxGL.opening;
            let cr = trxGL.cr;
            let dr = trxGL.dr;

            let subGL = [];
            if (row.subGL && row.subGL.length > 0) {
                for (let sub of row.subGL) {
                    const trxSubGL = await getGLHistoryById(db_name, from, to, sub.id, companyInfo);
                    sub.opening = trxSubGL.opening;
                    sub.cr = trxSubGL.cr;
                    sub.dr = trxSubGL.dr;
                    sub.amount = trxSubGL.closing;

                    subGL.push(sub);
                    opening += trxSubGL.opening;
                    cr += trxSubGL.cr;
                    dr += trxSubGL.dr;
                }
            }
            row.opening = parseFloat(opening.toFixed(2))
            row.cr = parseFloat(cr.toFixed(2));
            row.dr = parseFloat(dr.toFixed(2));

            if (row?.id === 10 || row?.parent === 10) {
                if (opening < 0) {
                    row.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    row.closing = ((cr + opening) - cr).toFixed(2);
                }
            } else if (row?.id === 11 || row?.parent === 11) {
                if (opening < 0) {
                    row.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    row.closing = (dr - (cr + opening)).toFixed(2);
                }
            } else if (row?.id === 12 || row?.parent === 12) {
                if (opening < 0) {
                    row.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    row.closing = ((cr + opening) - dr).toFixed(2);
                }
            } else if (row?.id === 13 || row?.parent === 13) {
                if (opening < 0) {
                    row.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    row.closing = (dr - (cr + opening)).toFixed(2);
                }
            } else if (row?.id === 14 || row?.parent === 14) {
                if (opening < 0) {
                    row.closing = (cr - (dr + opening)).toFixed(2);
                } else {
                    row.closing = ((cr + opening) - dr).toFixed(2);
                }
            } else {
                if (opening < 0) {
                    row.closing = ((dr + opening) - cr).toFixed(2);
                } else {
                    row.closing = (dr - (cr + opening)).toFixed(2);
                }
            }

            row.subGL = subGL;
            result.push(row);
        }

        // let filter = glList.filter((row: any) => row?.cr !== 0 || row?.dr !== 0 || row?.opening !== 0);

        return result;
    } catch (error) {
        console.log('error::: ', error);
        return [];
    }
}

export const getGLChildHistory = async (db_name: string, from: Moment, to: Moment, glId: number, companyInfo: any) => {
    try {
        const prisma = getPrismaClient(db_name);
        const financialFrom = moment(new Date(companyInfo.financialFrom));
        const getGlList = await prisma.generalLedger.findMany({ where: { parent: glId, isDelete: false }, select: { id: true, name: true, parent: true } });

        let glIdsArr: any[] = [];
        for (let x in getGlList) {
            let dt: any = getGlList[x];

            let openingTrxSum: any;
            if (financialFrom.isSame(from)) {
                openingTrxSum = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${getGlList[x].id}
                AND "ledgerMode" = 'ACCOUNT_OPENING'
                AND "isDelete" = false;`;
            } else {
                openingTrxSum = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${getGlList[x].id}
                AND "ledgerMode" = 'ACCOUNT_OPENING'
                AND "isDelete" = false
                AND DATE("date") BETWEEN DATE(${financialFrom.format("YYYY-MM-DD")}) AND DATE(${from.subtract(1, 'day').format("YYYY-MM-DD")});`;
            }

            const trxSum: any = await prisma.$queryRaw`
                SELECT 
                    SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                    SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = ${getGlList[x].id}
                AND "isDelete" = false
                AND "ledgerMode" != 'ACCOUNT_OPENING'
                AND "ledgerMode" != 'STOCK_CLOSING'
                AND DATE("date") BETWEEN DATE(${from}) AND DATE(${to});`;


            let opening = parseFloat((parseFloat(openingTrxSum[0].CR || 0) - parseFloat(openingTrxSum[0].DR || 0)).toFixed(2));
            let cr = parseFloat(parseFloat(trxSum[0].CR || 0).toFixed(2));
            let dr = parseFloat(parseFloat(trxSum[0].DR || 0).toFixed(2));

            let closing = 0;
            if (glId === 10) {
                if (opening < 0) {
                    closing = (cr - (dr + opening));
                } else {
                    closing = ((cr + opening) - cr);
                }
            } else if (glId === 11) {
                if (opening < 0) {
                    closing = ((dr + opening) - cr);
                } else {
                    closing = (dr - (cr + opening));
                }
            } else if (glId === 12) {
                if (opening < 0) {
                    closing = (cr - (dr + opening));
                } else {
                    closing = ((cr + opening) - dr);
                }
            } else if (glId === 13) {
                if (opening < 0) {
                    closing = ((dr + opening) - cr);
                } else {
                    closing = (dr - (cr + opening));
                }
            } else if (glId === 14) {
                if (opening < 0) {
                    closing = (cr - (dr + opening));
                } else {
                    closing = ((cr + opening) - dr);
                }
            } else {
                if (opening < 0) {
                    closing = ((dr + opening) - cr);
                } else {
                    closing = (dr - (cr + opening));
                }
            }

            dt.opening = parseFloat(opening.toFixed(2));
            dt.cr = parseFloat(cr.toFixed(2));
            dt.dr = parseFloat(dr.toFixed(2));
            dt.closing = closing.toFixed(2);

            glIdsArr.push(dt);
        }
        // let filter = glIdsArr.filter((row: any) => row?.cr !== 0 || row?.dr !== 0 || row?.opening !== 0);

        return glIdsArr
    } catch (error) {
        console.log('error::: ', error);
        return [];
    }
}

export const getInventoryOpeningStock = async (db_name: string, isDate: boolean, from: any, to: any) => {
    try {
        const prisma = getPrismaClient(db_name);

        const getOpening = await prisma.product.findMany({
            where: {
                isDelete: false,
                StockAmount: {
                    gt: 0,
                }
            },
            select: {
                id: true,
                name: true,
                StockQty: true,
                PerQtyRate: true,
                StockAmount: true,
            },
        });

        if (isDate) {
            let result = [];
            for (let data of getOpening) {
                result.push({
                    id: data.id,
                    name: data.name,
                    qty: parseFloat((data.StockQty).toFixed(2)),
                    rate: parseFloat(data.StockAmount.toFixed(2))
                })
            }
            return result;
        }

        const getPurchase = await prisma.purchaseItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                taxableAmount: true,
                qty: true,
            },
        });

        const getPurchaseReturn = await prisma.purchaseReturnItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                taxableAmount: true,
                qty: true,
            },
        });

        const getSales = await prisma.salesItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                total: true,
                qty: true,
            },
        });
        const getSalesReturn = await prisma.salesReturnItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                qty: true,
                total: true,
            },
        });

        let finalData: any[] = [];
        for (let data of getOpening) {
            if (data?.id) {
                let purchaseItem = getPurchase.find((value) => value.itemId == data.id);
                let purchaseQty = purchaseItem?._sum?.qty ? Number(purchaseItem._sum.qty) : 0;
                let purchaseTotal = purchaseItem?._sum?.taxableAmount ? Number(purchaseItem._sum.taxableAmount) : 0;

                let returnItem = getPurchaseReturn.find((value) => value.itemId == data.id);
                let returnQty = returnItem?._sum?.qty ? Number(returnItem._sum.qty) : 0;
                let returnTotal = returnItem?._sum?.taxableAmount ? Number(returnItem._sum.taxableAmount) : 0;

                let qty = (Number(data.StockQty) + purchaseQty) - returnQty;
                let total = (Number(data.StockAmount) + purchaseTotal) - returnTotal;

                finalData[data.id] = { id: data.id, qty: qty, name: data.name, total: total }
            }
        }

        for (let pur of getPurchase) {
            if (pur?.itemId) {
                if (finalData[pur?.itemId]) {
                    continue;
                } else {
                    finalData[pur?.itemId] = { id: pur?.itemId, qty: Number(pur._sum.qty), name: "", total: Number(pur._sum.taxableAmount) }
                }
            }
        }

        for (let data of getSales) {
            if (data?.itemId && data?._sum.qty) {
                let returnItem = getSalesReturn.find((value) => value.itemId == data.itemId);
                let returnQty = returnItem?._sum?.qty ? Number(returnItem._sum.qty) : 0;
                let returnTotal = returnItem?._sum?.total ? Number(returnItem._sum.total) : 0;

                let qty = Number(data._sum.qty) - returnQty;
                let total = Number(data._sum.qty) - returnTotal;

                finalData[data.itemId].saleQty = qty;
                finalData[data.itemId].saleTotal = total;

            }
        }
        let result = [];
        for (let data of finalData) {
            if (data) {
                let purchaseQty = data?.qty || 0;
                let saleQty = data?.saleQty || 0;
                let purchaseRate = data?.total || 0;
                let saleRate = data?.saleTotal || 0;

                let closingAmt = 0;
                if (purchaseQty !== 0) {
                    let rt = purchaseRate / purchaseQty;
                    closingAmt = rt * (purchaseQty - saleQty)
                } else {
                    closingAmt = purchaseRate - saleRate;
                }

                result.push({
                    id: data.id,
                    name: data.name,
                    qty: parseFloat((purchaseQty - saleQty).toFixed(2)),
                    rate: parseFloat(closingAmt.toFixed(2))
                });
            }
        }

        return result;

    } catch (error) {
        return [{
            id: 0,
            name: "",
            qty: 0,
            rate: 0
        }];
    }
}

export const getInventoryStock = async (db_name: string, from: any, to: any, getOpening: any) => {
    try {
        const prisma = getPrismaClient(db_name);

        const getPurchase = await prisma.purchaseItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                taxableAmount: true,
                qty: true,
            },
        });

        const getPurchaseReturn = await prisma.purchaseReturnItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                taxableAmount: true,
                qty: true,
            },
        });

        const getSales = await prisma.salesItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                total: true,
                qty: true,
            },
        });
        const getSalesReturn = await prisma.salesReturnItems.groupBy({
            by: "itemId",
            where: {
                isCancel: false,
                isDelete: false,
                isExpense: false,
                invoiceDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                }
            },
            _sum: {
                qty: true,
                total: true,
            },
        });

        let finalData: any[] = [];
        for (let data of getOpening) {
            if (data?.id) {
                let purchaseItem = getPurchase.find((value) => value.itemId == data.id);
                let purchaseQty = purchaseItem?._sum?.qty ? Number(purchaseItem._sum.qty) : 0;
                let purchaseTotal = purchaseItem?._sum?.taxableAmount ? Number(purchaseItem._sum.taxableAmount) : 0;

                let returnItem = getPurchaseReturn.find((value) => value.itemId == data.id);
                let returnQty = returnItem?._sum?.qty ? Number(returnItem._sum.qty) : 0;
                let returnTotal = returnItem?._sum?.taxableAmount ? Number(returnItem._sum.taxableAmount) : 0;

                let qty = (Number(data.qty) + purchaseQty) - returnQty;
                let total = (Number(data.rate) + purchaseTotal) - returnTotal;

                console.log("name", "opening", "purchaseQty", "purchase", "return", returnQty);
                console.log(data.name, Number(data.rate), purchaseQty, purchaseTotal, returnQty, returnTotal);


                finalData[data.id] = { qty: qty, name: data.name, total: total }
            }
        }

        for (let data of getSales) {
            if (data?.itemId && data?._sum.qty) {
                let returnItem = getSalesReturn.find((value) => value.itemId == data.itemId);
                let returnQty = returnItem?._sum?.qty ? Number(returnItem._sum.qty) : 0;
                let returnTotal = returnItem?._sum?.total ? Number(returnItem._sum.total) : 0;

                let qty = Number(data._sum.qty) - returnQty;
                let total = Number(data._sum.total) - returnTotal;

                console.log("name", "salesQty", "salesTotal");
                console.log(finalData[data.itemId].name, qty, total);


                finalData[data.itemId].saleQty = qty;
                finalData[data.itemId].saleTotal = total;

            }
        }

        let closing = 0;
        for (let data of finalData) {
            if (data) {
                let purchaseQty = data?.qty || 0;
                let saleQty = data?.saleQty || 0;
                let purchaseRate = data?.total || 0;
                let saleRate = data?.saleTotal || 0;

                let closingAmt = 0;
                if (purchaseQty !== 0) {
                    let rate = purchaseRate / purchaseQty;
                    closingAmt = rate * (purchaseQty - saleQty);
                    console.log(data.name, (purchaseQty - saleQty), rate, closingAmt);
                } else {
                    closingAmt = purchaseRate - saleRate;
                }

                closing += parseFloat(closingAmt.toFixed(2));
            }
        }

        return closing;
    } catch (e: any) {
        console.log(e);
        return 0;
    }
}

export const getAccountOpeningStock = async (db_name: string, from: Moment, companyInfo: any) => {
    try {
        const prisma = getPrismaClient(db_name);

        let opening = 0;
        let financialFrom = moment(new Date(companyInfo.financialFrom));
        if (financialFrom.isSame(from)) {
            const openingTrxSum: any = await prisma.$queryRaw`
                SELECT 
                "ledgerId","date",
                SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = 34
                AND "ledgerMode" = 'STOCK_OPENING'
                AND "isDelete" = false
                AND DATE("date") = DATE(${from.format("YYYY-MM-DD")});`

            opening = Number(openingTrxSum[0].DR) - Number(openingTrxSum[0].CR);
        }

        const trxSum: any = await prisma.$queryRaw`
                SELECT 
                "ledgerId","date",
                (CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                (CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = 34
                AND "ledgerMode" = 'STOCK_CLOSING'
                AND "isDelete" = false
                AND DATE("date") < DATE(${from.format("YYYY-MM-DD")})
                ORDER BY DATE("date") DESC;`

        let acc: any = {};
        for (let row of trxSum) {
            if (!acc[row.ledgerId]) {
                opening += Number(row.DR) - Number(row.CR);
                acc[row.ledgerId] = {
                    ledgerId: row.ledgerId,
                    CR: row.CR,
                    DR: row.DR
                }
            }
        }

        return opening;
    } catch (error) {
        console.log('error::: ', error);
        return 0;
    }
}

export const getAccountClosingStock = async (db_name: string, from: Moment, to: Moment) => {
    try {
        const prisma = getPrismaClient(db_name);

        const trxSum: any = await prisma.$queryRaw`
                SELECT
                "ledgerId","date", 
                (CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                (CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
                FROM transaction
                WHERE "groupId" = 34
                AND "ledgerMode" = 'STOCK_CLOSING'
                AND "isDelete" = false
                AND DATE("date") BETWEEN DATE(${from.format("YYYY-MM-DD")}) AND DATE(${to.format("YYYY-MM-DD")})
                ORDER BY DATE("date") DESC;`;

        let closing = 0;
        let acc: any = {};
        for (let row of trxSum) {
            if (!acc[row.ledgerId]) {
                closing += Number(row.DR) - Number(row.CR);
                acc[row.ledgerId] = {
                    ledgerId: row.ledgerId,
                    CR: row.CR,
                    DR: row.DR
                }
            }
        }
        return closing;
    } catch (error) {
        console.log('error::: ', error);
        return 0;
    }
}

export const getLedgerOpening = async (db_name: string, id: number, from: Moment, to: Moment, companyInfo: any) => {
    try {
        const prisma = getPrismaClient(db_name);
        const financialFrom = moment(new Date(companyInfo.financialFrom));

        let openingTrxSum: any = await prisma.$queryRaw`
            SELECT 
                SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
            FROM transaction
            WHERE "ledgerId" = ${id}
            AND "ledgerMode" = 'ACCOUNT_OPENING'
            AND "isDelete" = false;`;

        let opening = 0;
        if (!financialFrom.isSame(from)) {
            let trxSum: any = await prisma.$queryRaw`
            SELECT 
                SUM(CASE WHEN "txType" = 'CR' THEN "amount" ELSE 0 END) AS "CR",
                SUM(CASE WHEN "txType" = 'DR' THEN "amount" ELSE 0 END) AS "DR"
            FROM transaction
            WHERE "ledgerId" = ${id}
            AND "ledgerMode" != 'ACCOUNT_OPENING'
            AND "ledgerMode" != 'STOCK_CLOSING'
            AND DATE("date") < DATE(${from.format("YYYY-MM-DD")})
            AND "isDelete" = false;`;


        } else {
            opening = Number(openingTrxSum[0].CR) - Number(openingTrxSum[0].DR)
        }

        return opening;
    } catch (error) {
        console.log('error::: ', error);
        return 0;
    }
}
