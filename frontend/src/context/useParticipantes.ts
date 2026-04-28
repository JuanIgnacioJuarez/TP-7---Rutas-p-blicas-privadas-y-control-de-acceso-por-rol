import { useContext } from 'react';
import { ParticipantesContext } from './ParticipantesContext';

export const useParticipantes = () => {
  const context = useContext(ParticipantesContext);
  if (!context) throw new Error('useParticipantes debe usarse dentro del Provider');
  return context;
};
