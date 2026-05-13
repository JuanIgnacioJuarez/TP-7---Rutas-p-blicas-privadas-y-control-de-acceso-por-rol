import { createContext, useEffect, useReducer, useState } from 'react';
import { Participante } from '../models/Participante';
import { participantesReducer } from '../reducers/participantesReducer';
import { useAuth } from './AuthContext';

export interface ContextType {
  participantes: Participante[];
  error: string | null;
  limpiarError: () => void;
  agregar: (p: Participante) => void;
  eliminar: (id: number) => void;
  editar: (p: Participante) => void;
  resetear: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ParticipantesContext = createContext<ContextType | undefined>(undefined);

export const ParticipantesProvider = ({ children }: { children: React.ReactNode }) => {
  const [participantes, dispatch] = useReducer(participantesReducer, []);
  const [error, setError] = useState<string | null>(null);
  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/participantes`;

  const { token } = useAuth();

  // GET inicial
  useEffect(() => {
    if (!token) return;
    fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'GET_PARTICIPANTES', payload: data }))
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar el listado de participantes.');
      });
  }, [API_URL, token]);

  const agregar = (p: Participante) => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(p)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((nuevo) => dispatch({ type: 'AGREGAR', payload: nuevo }))
      .catch((err) => {
        console.error('Error al guardar participante:', err);
        setError(`Hubo un error al guardar: ${err.message}`);
      });
  };

  const editar = (p: Participante) => {
    fetch(`${API_URL}/${p.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(p)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((actualizado) => dispatch({ type: 'EDITAR', payload: actualizado }))
      .catch((err) => {
        console.error('Error al editar participante:', err);
        setError(`Hubo un error al editar: ${err.message}`);
      });
  };

  const eliminar = (id: number) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        dispatch({ type: 'ELIMINAR', payload: id });
      })
      .catch((err) => {
        console.error('Error al eliminar participante:', err);
        setError(`Hubo un error al eliminar: ${err.message}`);
      });
  };

  const resetear = () => {
    dispatch({ type: 'RESET', payload: [] });
  };

  const limpiarError = () => setError(null);

  return (
    <ParticipantesContext.Provider
      value={{ participantes, error, limpiarError, agregar, eliminar, editar, resetear }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
};
