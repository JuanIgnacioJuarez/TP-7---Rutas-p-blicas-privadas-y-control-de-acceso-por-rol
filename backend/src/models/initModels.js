const { pool } = require("../config/db")

async function createTables() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS participantes (
            id BIGSERIAL PRIMARY KEY,
            nombre VARCHAR(120) NOT NULL,
            email VARCHAR(120),
            edad INT,
            pais VARCHAR(80),
            nivel VARCHAR(60),
            modalidad VARCHAR(60),
            tecnologias JSONB DEFAULT '[]'::jsonb,
            acepta_terminos BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id BIGSERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'CONSULTA'))
        )
    `);

    console.log("Tablas sincronizadas correctamente en la base de datos.")
}

module.exports = { createTables };