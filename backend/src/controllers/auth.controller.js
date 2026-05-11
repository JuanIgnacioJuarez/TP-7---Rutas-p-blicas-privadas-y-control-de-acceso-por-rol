const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar al usuario en la base de datos
        const result = await pool.query(
            "SELECT * FROM usuarios_db WHERE username = $1 AND password = $2",
            [username, password]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = result.rows[0];

        // Generar el Token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol },
            process.env.JWT_SECRET || "mi_super_secreto_tp7",
            { expiresIn: "2h" } // El token expira en 2 horas
        );

        // Devolvemos los datos del usuario y el token
        res.json({
            user: { id: user.id, username: user.username, rol: user.rol },
            token
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { login };