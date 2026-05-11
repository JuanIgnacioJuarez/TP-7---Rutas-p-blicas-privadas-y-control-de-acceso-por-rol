const { pool } = require("../config/db");

// Funciones auxiliares
function parseTecnologias(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : parsed ? [String(parsed)] : [];
        } catch {
            return value.split(",").map((item) => item.trim()).filter(Boolean);
        }
    }
    return [];
}

function mapRow(row) {
    return {
        id: Number(row.id),
        nombre: row.nombre || "",
        email: row.email || "",
        edad: row.edad ?? 0,
        pais: row.pais || "",
        nivel: row.nivel || "",
        modalidad: row.modalidad || "",
        tecnologias: parseTecnologias(row.tecnologias),
        aceptaTerminos: Boolean(row.acepta_terminos)
    };
}

// Métodos CRUD
const obtenerParticipantes = async (_req, res) => {
    try {
        const result = await pool.query("SELECT * FROM participantes ORDER BY id ASC");
        res.json(result.rows.map(mapRow));
    } catch (error) {
        console.error("GET /participantes error:", error);
        res.status(500).json({ error: "Error al obtener participantes" });
    }
};

const crearParticipante = async (req, res) => {
    try {
        const p = req.body;
        const result = await pool.query(
            `INSERT INTO participantes
            (nombre, email, edad, pais, nivel, modalidad, tecnologias, acepta_terminos)
            VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
            RETURNING *`,
            [
                p.nombre, p.email || null, Number.isFinite(Number(p.edad)) ? Number(p.edad) : 0,
                p.pais || null, p.nivel || null, p.modalidad || null,
                JSON.stringify(Array.isArray(p.tecnologias) ? p.tecnologias : []),
                Boolean(p.aceptaTerminos)
            ]
        );
        res.status(201).json(mapRow(result.rows[0]));
    } catch (error) {
        console.error("POST /participantes error:", error);
        res.status(500).json({ error: "Error al crear participante" });
    }
};

const editarParticipante = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const p = req.body;
        const result = await pool.query(
            `UPDATE participantes
            SET nombre = $1, email = $2, edad = $3, pais = $4, nivel = $5, modalidad = $6, tecnologias = $7::jsonb, acepta_terminos = $8
            WHERE id = $9 RETURNING *`,
            [
                p.nombre, p.email || null, Number.isFinite(Number(p.edad)) ? Number(p.edad) : 0,
                p.pais || null, p.nivel || null, p.modalidad || null,
                JSON.stringify(Array.isArray(p.tecnologias) ? p.tecnologias : []),
                Boolean(p.aceptaTerminos), id
            ]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: "Participante no encontrado" });
        return res.json(mapRow(result.rows[0]));
    } catch (error) {
        console.error("PUT /participantes/:id error:", error);
        return res.status(500).json({ error: "Error al editar participante" });
    }
};

const eliminarParticipante = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await pool.query("DELETE FROM participantes WHERE id = $1", [id]);

        if (result.rowCount === 0) return res.status(404).json({ error: "Participante no encontrado" });
        return res.status(204).send();
    } catch (error) {
        console.error("DELETE /participantes/:id error:", error);
        return res.status(500).json({ error: "Error al eliminar participante" });
    }
};

module.exports = {
    obtenerParticipantes,
    crearParticipante,
    editarParticipante,
    eliminarParticipante
};