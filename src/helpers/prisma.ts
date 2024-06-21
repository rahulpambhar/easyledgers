import { Client, Pool } from "pg";
import { parse } from "pg-connection-string"
import { PrismaClient as PrismaClient1 } from "../../prisma/generated/base";
import { PrismaClient as PrismaClient2 } from "../../prisma/generated/child";
import { readFileSync } from "fs";
import path from "path";

let prisma = new PrismaClient1();
let connections: Map<string, PrismaClient2> = new Map();

export const getPrismaClient = (databaseName: string) => {

    let connection = connections.get(databaseName);
    if (connection) {
        return connection;
    } else {
        const credentials = parse(process.env.DATABASE_URL);
        connection = new PrismaClient2({
            datasources: {
                db: {
                    url: `postgresql://${credentials.user}:${credentials.password}@${credentials.host}:${credentials.port}/${databaseName}`,
                }
            },
            // log: ['query']
        });

        connections.set(databaseName, connection);
        return connection;
    }
};

export const createDatabase = async (databaseName: string) => {
    try {
        const { host, port, user, password, database } = parse(process.env.DATABASE_URL);
        const client = new Client({ host: host as string, port: parseInt(port as string), user, password, database: database as string });
        await client.connect();
        await client.query(`CREATE DATABASE "${databaseName}"`);
        await client.end();

        const pool = new Client({ host: host as string, port: parseInt(port as string), user, password, database: databaseName });
        await pool.connect();

        const tableSchema = readFileSync(path.join(__dirname, '../.././database/database_schema.sql'), "utf8");
        const insertSchema = readFileSync(path.join(__dirname, '../.././database/insert_schema.sql'), "utf8");

        await pool.query(tableSchema);
        await pool.query(insertSchema);
        pool.end();

        return true;
    } catch (e: any) {
        console.log(e);
        return false;
    }
}

export default prisma;