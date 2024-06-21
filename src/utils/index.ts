import { Request } from "express";
import fs from 'fs';
import path from 'path';
import numWords from 'convert-rupees-into-words';

export function getClientIp(req: Request): string {
    if (req.headers['x-forwarded-for']) {
        // try to get from x-forwarded-for if it set (behind reverse proxy)
        return req.headers['x-forwarded-for'].toString().split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
        // no proxy, try getting from connection.remoteAddress
        return req.connection.remoteAddress;
    } else {
        // if non above, fallback.
        return req.ip || "";
    }
}

export function isValidPassword(password: string): boolean {
    return password.length >= 8 && /[a-zA-Z0-9]/.test(password);
}

export function isValidPANNumber(panNumber: string): boolean {
    const panRegex = /^([A-Z]{5})([0-9]{4})([A-Z])$/;

    // Ensure PAN number is a string and has the correct length
    if (typeof panNumber !== 'string' || panNumber.length !== 10) {
        return false;
    }

    // Convert PAN to uppercase for case-insensitive validation
    const uppercasePAN = panNumber.toUpperCase();

    // Check if the PAN number matches the regular expression
    return panRegex.test(uppercasePAN);
}

export function isValidGSTNumber(gstNumber: string): boolean {

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    // Ensure GST number is a string and has the correct length
    if (typeof gstNumber !== 'string' || gstNumber.length !== 15) {
        return false;
    }

    // Check if the GST number matches the regular expression
    return gstRegex.test(gstNumber);
}

export function replaceNullWithString(data: any) {
    Object.keys(data).map(function (key, index) {
        if (data[key] == null) {
            data[key] = "";
        }
    });

    return data;
}

export async function uploadFiles(file: any, dir: string): Promise<string> {

    let upload_path: string = "";

    let dateData: any = new Date();
    const [month, day, year] = [
        dateData.getMonth(),
        dateData.getDate(),
        dateData.getFullYear(),
    ];
    var dirName = day + "-" + month + "-" + year;
    let dir_path: string;

    dir_path = `/${dir}/` + dirName + "/";
    upload_path = process.cwd() + "/public" + dir_path;

    if (!fs.existsSync(upload_path)) {
        fs.mkdirSync(upload_path, { recursive: true });
    }
    var cv_name = dateData.getTime() + path.extname(file.name);
    upload_path = upload_path + cv_name;

    file.mv(upload_path, async (err: any) => {
        if (err) {
            return "error in file upload";
        }
    });

    return dir_path + cv_name;
}

export async function getInWord(billValue: number): Promise<string | null> {
    return numWords(billValue)
}

export function getPdfSetting() {
}