import { differenceBy } from "lodash";
import { Action, Prisma, PrismaClient, generalLedger } from "../../prisma/generated/child";
import prisma, { getPrismaClient } from "./prisma";
import { Decimal, DefaultArgs } from "../../prisma/generated/child/runtime/library";

export async function glAncestors(acc_db: string, glId: number) {
    const prisma = getPrismaClient(acc_db);

    const glList: generalLedger[] = await prisma.$queryRaw`
        WITH RECURSIVE "Ancestors" AS (
        SELECT "id","name","parent" FROM "generalLedger" WHERE id = ${glId}
        UNION ALL
        SELECT n.id,n.name,n.parent FROM "generalLedger" n
        JOIN "Ancestors" d ON n.parent = d.id AND n."isDelete" = false
        )
        SELECT * FROM "Ancestors";`;

    return glList;
}

export async function glDescendants(acc_db: string, glId: number): Promise<any[]> {
    const prisma = getPrismaClient(acc_db);

    const glList: any = await prisma.$queryRaw`
        WITH RECURSIVE "Descendants" AS (
        SELECT "id","name","parent" FROM "generalLedger" WHERE id = ${glId}
        UNION ALL
        SELECT n.id,n.name,n.paren FROM "generalLedger" n
        JOIN "Descendants" d ON d.parent = n.id AND n."isDelete" = false
        WHERE n.id NOT IN(1,2,3,4)
        )
        SELECT * FROM "Descendants";`;

    return glList;
}

export async function updateLedgerSummary(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, ledgerId: number, amount: Decimal, type: 'CR' | 'DR', userId: number, isDelete: boolean) {
    try {
        const ledgerSummary = await tx.ledgerSummary.findFirst({ where: { ledgerId: ledgerId } });
        if (ledgerSummary) {
            let debit = ledgerSummary.debit;
            let credit = ledgerSummary.credit;
            let closing = ledgerSummary.closing;
            if (isDelete) {
                if (type === 'CR') {
                    credit.minus(amount);
                    closing.minus(amount)
                } else {
                    debit.minus(amount);
                    closing.plus(amount)
                }
            } else {
                if (type === 'CR') {
                    credit.plus(amount);
                    closing.plus(amount)
                } else {
                    debit.plus(amount);
                    closing.minus(amount)
                }
            }
            await tx.ledgerSummary.updateMany({
                where: { ledgerId: ledgerId },
                data: {
                    credit: credit,
                    debit: debit,
                    closing: closing,
                    updateBy: userId
                }
            });
        } else {
            if (type === 'CR') {
                await tx.ledgerSummary.create({
                    data: {
                        ledgerId: ledgerId,
                        credit: amount,
                        debit: 0,
                        closing: 0,
                        createBy: userId
                    }
                });
            } else {
                await tx.ledgerSummary.create({
                    data: {
                        ledgerId: ledgerId,
                        credit: 0,
                        debit: amount,
                        closing: 0,
                        createBy: userId
                    }
                });
            }
        }
        return true;
    } catch (error) {
        return false;
    }

}

export async function increaseRemainQty(db_name: string, deliveryNoteId: number, itemId: number, qty: number) {
    const prisma = getPrismaClient(db_name);

    const dNItem = await prisma.deliveryNoteItems.updateMany({
        where: {
            deliveryNoteId: deliveryNoteId,
            itemId: itemId,
            isExpense: false,
            isDelete: false
        },
        data: {
            remainQty: {
                decrement: qty
            }
        }
    });
}

export async function decrementRemainQty(db_name: string, deliveryNoteId: number, itemId: number, qty: number) {
    const prisma = getPrismaClient(db_name);

    const dNItem = await prisma.deliveryNoteItems.updateMany({
        where: {
            deliveryNoteId: deliveryNoteId,
            itemId: itemId,
            isExpense: false,
            isDelete: false
        },
        data: {
            remainQty: {
                decrement: qty
            }
        }
    });
}

export async function updateTransaction(acc_db: string, data: txParams[]) {
    const prisma = getPrismaClient(acc_db);
    try {
        await prisma.$transaction(async (tx) => {

            const isStockTx = data.filter((row) => row.ledgerMode === "STOCK_CLOSING" || row.ledgerMode === 'STOCK_OPENING');
            let transaction;
            if (isStockTx.length > 0) {
                transaction = await tx.transaction.findMany({ where: { txMode: data[0].txMode, refId: data[0].ledgerId, ledgerId: data[0].ledgerId, isDelete: false } });
            } else {
                transaction = await tx.transaction.findMany({ where: { txMode: data[0].txMode, refId: data[0].refId, isDelete: false } });
            }

            // delete functionality
            const oldTxAccId = transaction.map((row) => row.ledgerId);
            // const newTxAccId = data.map((row) => row.ledgerId);
            const diff = differenceBy(transaction, data, 'ledgerId');
            if (diff.length > 0) {
                const deleteLedgerIds = diff.map((row) => row.ledgerId);
                await tx.transaction.updateMany({
                    where: {
                        txMode: data[0].txMode,
                        refId: data[0].refId,
                        ledgerId: {
                            in: deleteLedgerIds
                        }
                    },
                    data: {
                        isDelete: true
                    }
                });
                for (const index in diff) {
                    await updateLedgerSummary(tx, diff[index].ledgerId, diff[index].amount, diff[index].txType, data[0].userId, true);
                }
            }

            for (let x in data) {
                let txData = data[x];
                if (oldTxAccId.includes(txData.ledgerId)) {
                    let where = { txMode: txData.txMode, refId: txData.refId, ledgerId: txData.ledgerId }
                    await tx.transaction.updateMany({
                        where: where,
                        data: {
                            txMode: txData.txMode,
                            voucherId: txData.voucherId || null,
                            ledgerId: txData.ledgerId,
                            ledgerMode: txData.ledgerMode,
                            groupId: txData.groupId,
                            date: txData.date,
                            amount: txData.amount,
                            txType: txData.txType,
                            refId: txData.refId,
                            updateBy: txData.userId
                        }
                    });
                } else {
                    await tx.transaction.create({
                        data: {
                            txMode: txData.txMode,
                            voucherId: txData.voucherId || null,
                            ledgerId: txData.ledgerId,
                            ledgerMode: txData.ledgerMode,
                            groupId: txData.groupId,
                            date: txData.date,
                            amount: txData.amount,
                            txType: txData.txType,
                            refId: txData.refId,
                            createBy: txData.userId
                        }
                    });
                }
                await updateLedgerSummary(tx, txData.ledgerId, new Decimal(txData.amount), txData.txType, txData.userId, false);
            }
        });
        return true;
    } catch (error) {
        console.error('transaction error :', error);
        return false;
    }
}

export async function getCompanyByDbName(db_name: string) {
    try {
        const company = await prisma.companyDB.findFirst({
            where: {
                db_name: db_name
            },
            include: {
                company: true
            }
        })

        return company?.company;
    } catch (error) {
        return null;
    }
}

export async function getVoucher(acc_db: string, id: number) {
    const prisma = getPrismaClient(acc_db);

    const voucher = await prisma.voucher.findFirst({
        where: {
            id: id
        },
        include: {
            bankLedger: true
        }
    });

    return voucher;
}

export async function getTransport(acc_db: string, id: number) {
    try {
        const prisma = getPrismaClient(acc_db);

        const transport = await prisma.transport.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
            }
        });

        return transport;

    } catch (error) {
        return null;
    }
}

export async function getWarehouse(acc_db: string, id: number) {
    try {
        const prisma = getPrismaClient(acc_db);

        const warehouse = await prisma.warehouse.findFirst({
            where: {
                id: id
            },
        });

        return warehouse;

    } catch (error) {
        return null;
    }
}

export async function getLedger(acc_db: string, id: number) {
    try {
        const prisma = getPrismaClient(acc_db);

        const warehouse = await prisma.ledger.findFirst({
            where: {
                id: id
            },
        });
        return warehouse;

    } catch (error) {
        return null;
    }
}

export async function getSate(acc_db: string, name: string) {
    try {

        const sate = await prisma.state.findFirst({
            where: {
                name
            },
            select: {
                id: true,
                name: true,
                code: true
            }
        });
        return sate;

    } catch (error) {
        return null;
    }
}

export async function nextInvoice(db_name: string, prefix: string, numberMethod: string, voucherId: number, entity: txMode): Promise<string> {
    const prisma = getPrismaClient(db_name);
    let inv: string = "";
    let lastInvoice;
    if (entity === 'SALES_ORDER') {
        lastInvoice = await prisma.salesOrder.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'DELIVERY_NOTE') {
        lastInvoice = await prisma.deliveryNote.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'SALES') {
        lastInvoice = await prisma.sales.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'CREDIT') {
        lastInvoice = await prisma.salesReturn.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'PURCHASE_ORDER') {
        lastInvoice = await prisma.purchaseOrder.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'RECEIPT_NOTE') {
        lastInvoice = await prisma.receiptNote.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'PURCHASE') {
        lastInvoice = await prisma.purchase.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'DEBIT') {
        lastInvoice = await prisma.purchaseReturn.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'PAYMENT') {
        lastInvoice = await prisma.payment.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'RECEIPT') {
        lastInvoice = await prisma.receipt.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else if (entity === 'CONTRA') {
        lastInvoice = await prisma.contra.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    } else {
        lastInvoice = await prisma.journalVoucher.findFirst({ where: { voucherId: voucherId, isDelete: false }, orderBy: { id: 'desc' } });
    }

    if (numberMethod === "Automatic") {
        if (!lastInvoice) {
            return `1`;
        }
        let numericalPart: number = parseInt(lastInvoice?.invoiceNo.replace(`${prefix}-`, ""));
        numericalPart++;
        inv = numericalPart.toString()
    } else if (numberMethod === "Automatic_Manual") {
        if (!lastInvoice) {
            return `${prefix}-1`;
        }
        let numericalPart: number = parseInt(lastInvoice?.invoiceNo.replace(`${prefix}-`, ""));
        numericalPart++;
        inv = `${prefix}-` + numericalPart.toString().padStart(0, '0');
    }

    return inv;
}

export async function checkInvoiceNo(db_name: string, entity: txMode, invoiceNo: string) {
    const prisma = getPrismaClient(db_name);

    let data;
    if (entity === 'SALES_ORDER') {
        data = await prisma.salesOrder.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'DELIVERY_NOTE') {
        data = await prisma.deliveryNote.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'SALES') {
        data = await prisma.sales.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'CREDIT') {
        data = await prisma.salesReturn.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'PURCHASE_ORDER') {
        data = await prisma.purchaseOrder.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'RECEIPT_NOTE') {
        data = await prisma.receiptNote.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'PURCHASE') {
        data = await prisma.purchase.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'DEBIT') {
        data = await prisma.purchaseReturn.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'PAYMENT') {
        data = await prisma.payment.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'RECEIPT') {
        data = await prisma.receipt.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else if (entity === 'CONTRA') {
        data = await prisma.contra.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    } else {
        data = await prisma.journalVoucher.findFirst({ where: { invoiceNo: { equals: invoiceNo, mode: "insensitive" }, isDelete: false } });
    }

    return data;
}

export async function activityLog(acc_db: string, action: Action, table: string, data: any, createBy: number) {
    const prisma = getPrismaClient(acc_db);
    try {
        await prisma.activityLog.create({
            data: {
                action: action,
                table: table,
                body: data,
                createBy: createBy
            },
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}