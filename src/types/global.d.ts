declare module 'convert-rupees-into-words';

type ledgerMode = "LEDGER" | "ACCOUNT" | "ACCOUNT_OPENING" | "STOCK_OPENING" | "STOCK_CLOSING" | "GST" | "DISCOUNT" | "ROUNDOFF" | "PARTICULAR" | "CONTRA" | "PAYMENT" | "RECEIPT" | "JV"

type txMode = "SALES_ORDER" | "DELIVERY_NOTE" | "SALES" | "PURCHASE" | "PURCHASE_ORDER" | "RECEIPT_NOTE" | "CREDIT" | "DEBIT" | "CONTRA" | "PAYMENT" | "RECEIPT" | "JOURNAL" | "NA"

type txType = "CR" | "DR"

type txParams = {
    txMode: txMode
    voucherId?: number
    groupId: number
    refId?: number
    date: Date
    ledgerId: number
    amount: number
    txType: txType
    ledgerMode: ledgerMode
    userId: number
}