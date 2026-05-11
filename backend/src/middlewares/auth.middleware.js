const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mi_super_secreto_tp7");
        req.user = decoded; // Guardamos los datos del usuario en la request
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

// Middleware extra para verificar si es ADMIN
const esAdmin = (req, res, next) => {
    if (req.user && req.user.rol === "ADMIN") {
        next();
    } else {
        res.status(403).json({ error: "No tienes permisos para esta acción" });
    }
};

module.exports = { verificarToken, esAdmin };