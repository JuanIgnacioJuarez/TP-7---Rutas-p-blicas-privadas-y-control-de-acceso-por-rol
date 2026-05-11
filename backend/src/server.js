require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { ensureDatabaseExists } = require("./config/db");
const { createTables } = require("./models/initModels");
const participantesRoutes = require("./routes/routes");

const authRoutes = require("./routes/auth.routes");
const { verificarToken, esAdmin } = require("./middlewares/auth.middleware");

const app = express();
const PORT = Number(process.env.PORT || 8080);

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de rutas
app.use("/participantes", participantesRoutes);
// Ruta pública para login
app.use("/auth", authRoutes);
// Aplicamos verificarToken a todas las rutas de participantes
app.use("/participantes", verificarToken, participantesRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Inicialización
async function startServer() {
  try {
    // 1. Nos aseguramos que la base de datos exista
    await ensureDatabaseExists();
    
    // 2. Creamos las tablas (Participantes y Usuarios)
    await createTables();

    // 3. Levantamos el servidor
    app.listen(PORT, () => {
      console.log(`Backend escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el backend:", error);
    process.exit(1);
  }
}

startServer();