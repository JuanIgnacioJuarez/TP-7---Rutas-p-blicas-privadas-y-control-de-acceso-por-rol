import React, { useState } from 'react';
import { Participante } from '../models/Participante';

interface FiltrosData {
  nombre: string;
  nivel: string;
  modalidad: string;
}

interface Props {
  filtros: FiltrosData;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosData>>;
  onLimpiar: () => void;
  onReset: () => void;
  totalRegistrados: number;
  participantesAExportar: Participante[];
}

const Filtros: React.FC<Props> = ({
  filtros,
  setFiltros,
  onLimpiar,
  onReset,
  totalRegistrados,
  participantesAExportar
}) => {
  const [mostrarConfirmacionReset, setMostrarConfirmacionReset] = useState(false);

  const exportarDatos = () => {
    if (!participantesAExportar.length) return;

    const encabezado = ['id', 'nombre', 'email', 'edad', 'pais', 'nivel', 'modalidad', 'tecnologias'];
    const filas = participantesAExportar.map((p) => [
      p.id ?? '',
      p.nombre ?? '',
      p.email ?? '',
      p.edad ?? '',
      p.pais ?? '',
      p.nivel ?? '',
      p.modalidad ?? '',
      p.tecnologias?.join(' | ') ?? ''
    ]);

    const escapeCsv = (valor: string | number) => `"${String(valor).replace(/"/g, '""')}"`;
    const contenidoCsv = [encabezado, ...filas]
      .map((fila) => fila.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    const fecha = new Date().toISOString().slice(0, 10);
    enlace.href = url;
    enlace.download = `participantes-${fecha}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-bold text-gray-700">Filtros de Busqueda</h2>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button
            type="button"
            onClick={exportarDatos}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={!participantesAExportar.length}
            aria-label="Exportar participantes en formato CSV"
          >
            Exportar datos
          </button>

          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold text-xs">
            Registrados: {totalRegistrados}
          </span>

          <button
            type="button"
            onClick={onLimpiar}
            className="text-xs bg-gray-100 px-2 py-1.5 rounded hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={() => setMostrarConfirmacionReset(true)}
            className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            title="Resetear datos"
            aria-label="Resetear todos los participantes"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="filtro-nombre" className="text-xs font-semibold text-gray-600">
            Buscar por nombre
          </label>
          <input
            id="filtro-nombre"
            type="text"
            placeholder="Buscar nombre..."
            className="border border-gray-200 p-2 rounded-lg text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filtro-modalidad" className="text-xs font-semibold text-gray-600">
            Modalidad
          </label>
          <select
            id="filtro-modalidad"
            className="border border-gray-200 p-2 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-blue-200 outline-none"
            value={filtros.modalidad}
            onChange={(e) => setFiltros({ ...filtros, modalidad: e.target.value })}
          >
            <option value="Todas">Todas las modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Hibrido">Hibrido</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="filtro-nivel" className="text-xs font-semibold text-gray-600">
            Nivel
          </label>
          <select
            id="filtro-nivel"
            className="border border-gray-200 p-2 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-blue-200 outline-none"
            value={filtros.nivel}
            onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
          >
            <option value="Todos">Todos los niveles</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      {mostrarConfirmacionReset && (
        <div
          className="absolute inset-0 bg-white/95 z-10 rounded-xl flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmacion-reset-titulo"
        >
          <div className="max-w-sm w-full border border-red-100 rounded-xl p-4 bg-white shadow">
            <h3 id="confirmacion-reset-titulo" className="text-sm font-bold text-gray-800 mb-2">
              Confirmar reset de datos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta accion elimina del listado actual todos los participantes cargados en memoria.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                onClick={() => {
                  onReset();
                  setMostrarConfirmacionReset(false);
                }}
              >
                Confirmar
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                onClick={() => setMostrarConfirmacionReset(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Filtros;
