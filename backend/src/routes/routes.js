const { Router } = require("express");
const { 
    obtenerParticipantes, 
    crearParticipante, 
    editarParticipante, 
    eliminarParticipante 
} = require("../controllers/participantes.controller");

const router = Router();

router.get("/", obtenerParticipantes);
router.post("/", crearParticipante);
router.put("/:id", editarParticipante);
router.delete("/:id", eliminarParticipante);

module.exports = router;