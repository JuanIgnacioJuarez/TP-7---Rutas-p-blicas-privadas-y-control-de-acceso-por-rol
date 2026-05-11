require("dotenv").config();
const { Client, Pool } = require("pg");

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const pool = new Pool ({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

async function ensureDatabaseExists() {
    const bootstrapClient = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres"
    });

    await bootstrapClient.connect();
    const dbCheck = await bootstrapClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [DB_NAME]);

    if (dbCheck.rowCount === 0) {
        await bootstrapClient.query(`CREATE DATABASE "${DB_NAME}"`);
        console.log(`Base de datos "${DB_NAME}" creada exitosamente.`);
    }
    await bootstrapClient.end();
}

module.exports = { pool, ensureDatabaseExists };
