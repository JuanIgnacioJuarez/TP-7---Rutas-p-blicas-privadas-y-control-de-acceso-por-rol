import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Participante } from '../models/Participante';
import { useParticipantes } from '../context/useParticipantes';

interface Props {
  p: Participante;
}

const ParticipanteCard: React.FC<Props> = ({ p }) => {
  const [confirmar, setConfirmar] = useState(false);
  const { eliminar } = useParticipantes();
  const navigate = useNavigate();

  const obtenerEstiloNivel = (nivel: string) => {
    switch (nivel) {
      case 'Principiante':
        return 'bg-green-100 border-green-400';
      case 'Intermedio':
        return 'bg-yellow-100 border-yellow-400';
      case 'Avanzado':
        return 'bg-red-100 border-red-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`relative p-4 rounded-xl shadow-sm border ${obtenerEstiloNivel(p.nivel)} transition-colors`}
    >
      <AnimatePresence>
        {confirmar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-4 rounded-xl text-center"
            role="dialog"
            aria-modal="true"
            aria-label={`Confirmar eliminacion de ${p.nombre}`}
          >
            <p className="text-sm font-bold mb-3 italic text-gray-800">Eliminar registro?</p>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  if (p.id) eliminar(p.id);
                  setConfirmar(false);
                }}
                className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{p.nombre}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {p.pais || 'Argentina'}
            {p.email && (
              <span className="ml-1 opacity-70 block text-[10px] truncate max-w-[150px]">{p.email}</span>
            )}
          </p>
        </div>
        <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded-full text-gray-400 border border-gray-200">
          ID: {p.id ? p.id.toString().slice(-4) : '----'}
        </span>
      </div>

      <div className="space-y-1.5 border-t border-black/5 pt-3 mt-2 text-[13px]">
        <p className="text-gray-700">
          <strong>Modo:</strong> {p.modalidad}
        </p>
        <p className="text-gray-700">
          <strong>Nivel:</strong> {p.nivel}
        </p>
        <p className="text-blue-700 font-medium text-xs">
          <strong>Tecnologias:</strong> {p.tecnologias?.length ? p.tecnologias.join(' | ') : 'Ninguna'}
        </p>
      </div>

      <div className="mt-4 flex gap-2 border-t border-black/5 pt-3">
        <button
          type="button"
          onClick={() => p.id && navigate(`/editar/${p.id}`)}
          className="flex-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 rounded hover:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          aria-label={`Editar participante ${p.nombre}`}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setConfirmar(true)}
          className="flex-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 rounded hover:bg-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          aria-label={`Eliminar participante ${p.nombre}`}
        >
          Eliminar
        </button>
      </div>
    </motion.div>
  );
};

export default ParticipanteCard;

