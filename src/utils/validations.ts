import { NextFunction, Request, Response } from "express";
import { validationResult, body } from 'express-validator'
import { glDescendants } from "../helpers/general";
import { StatusCodes } from 'http-status-codes';

const validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, errors: errors.array() });
    };
};

export const loginValidator = validate([
    body('email', 'email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'password does not Empty').not().isEmpty(),
]);

export const userInsertValidator = validate([
    body('name', 'name does not Empty').not().isEmpty(),
    body('email', 'email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'password required min 1 lowercase,1 uppercase,1 number,1 symbol and 6 character length').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
    body('gcode', 'gcode does not Empty').not().isEmpty(),
    body('type', 'gcode does not Empty').isIn(['SuperAdmin', 'Admin', 'User']),
]);

export const userUpdateValidator = validate([
    body('id', 'id does not Empty').not().isEmpty(),
    body('id', 'Invalid id').isNumeric(),
    body('name', 'name does not Empty').not().isEmpty(),
    body('email', 'email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('gcode', 'gcode does not Empty').not().isEmpty(),
    body('type', 'type does not Empty').isIn(['SuperAdmin', 'Admin', 'User']),
]);

export const userStatusValidator = validate([
    body('id', 'id does not Empty').not().isEmpty(),
    body('id', 'Invalid id').isNumeric(),
    body('status', 'status does not Empty').not().isEmpty(),
    body('status', 'status value should be boolean').isBoolean({ strict: true }),
]);

export const deleteValidator = validate([
    body('id', 'id does not Empty').not().isEmpty(),
    body('id', 'Invalid id').isNumeric(),
]);

export const GLinsertValidator = validate([
    body('name', 'id does not Empty').not().isEmpty(),
    body('parent', 'invalid parent id').isNumeric(),
    body('parent', 'parent does not Empty').not().isEmpty(),
]);

export const GLUpdateValidator = validate([
    body('id', 'id does not Empty').not().isEmpty(),
    body('id', 'Invalid id').isNumeric(),
    body('name', 'id does not Empty').not().isEmpty(),
    body('parent', 'invalid parent id').isNumeric(),
    body('parent', 'parent does not Empty').not().isEmpty(),
]);

export const tcs = validate([
    body('db_name', 'db_name does not Empty').not().isEmpty(),
    body('id',).custom((value: any) => {
        if (value) {
            const isNumeric = typeof value === 'number';
            if (!isNumeric) {
                throw new Error('Invalid id');
            }
            return true;
        }
        return true;
    }),

    body('name', 'section name does not Empty').not().isEmpty(),
    body('withoutPan', 'withoutPan rate does not Empty').not().isEmpty(),
    body('withPan', 'withPan rate does not Empty').not().isEmpty(),
    body('thresholdAmt', 'thresholdAmt does not Empty').not().isEmpty(),
]);

export const getPaginationValidator = validate([
    body('page', 'page does not Empty').not().isEmpty(),
    body('page').custom((value) => { const isNumeric = typeof value === 'number'; if (!isNumeric) { throw new Error('Page number should be in numeric'); } return true; }),
    body('limit', 'limit does not Empty').not().isEmpty(),
    body('limit').custom((value) => { const isNumeric = typeof value === 'number'; if (!isNumeric) { throw new Error('limit number should be in numeric'); } return true; }),
    body('db_name', 'db_name does not Empty').not().isEmpty(),
]);

export const ledgerInsertValidator = async (req: Request, res: Response, next: NextFunction) => {
    const addressGl = [7, 25, 16, 33, 10, 11, 12, 13, 14, 15];
    const taxTransactionGl = [20, 25, 23, 29, 32, 5, 16, 33, 24];
    const transactionBankGl = [7, 29, 32, 5, 16, 23, 33, 24, 10, 11, 12, 13, 14, 15];
    const bankDetailGl = [20, 25];

    const glIds: any = await glDescendants(req.body.db_name, req.body.gl)

    for (let i in glIds) {
        if (addressGl.includes(glIds[i].id)) {

            await body('address', 'address is not required ..!').isEmpty().run(req)
            await body('state', 'state is not required ..!').isEmpty().run(req)
            await body('city', 'city is not required ..!').isEmpty().run(req)
            await body('pin', 'pin is not required ..!').isEmpty().run(req)
        }
        if (taxTransactionGl.includes(glIds[i])) {
            await body('pan', 'pan is not required ..!').isEmpty().run(req)
            await body('gstDetail', 'gstDetail is not required ..!').isEmpty().run(req)
            await body('gstType', 'gstType is not required ..!').isEmpty().run(req)
            await body('gst', 'gst is not required ..!').isEmpty().run(req)
            await body('taxability', 'taxability is not required ..!').isEmpty().run(req)
            await body('igst', 'igst is not required ..!').isEmpty().run(req)
            await body('cgst', 'cgst is not required ..!').isEmpty().run(req)
            await body('sgst', 'sgst is not required ..!').isEmpty().run(req)
            await body('isTds', 'isTds is not required ..!').isEmpty().run(req)
            await body('tdsPer', 'tdsPer is not required ..!').isEmpty().run(req)

        }
        if (transactionBankGl.includes(glIds[i])) {
            await body('transactionBank', 'transactionBank is not required ..!').isEmpty().run(req)
        }
        if (bankDetailGl.includes(glIds[i])) {
            await body('bank', 'bank is not required ..!').isEmpty().run(req)
            await body('branch', 'branch is not required ..!').isEmpty().run(req)
            await body('bankAc', 'bankAc is not required ..!').isEmpty().run(req)
            await body('bankIfsc', 'bankIfsc is not required ..!').isEmpty().run(req)
        }

    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({ errors: errors.array() });
};