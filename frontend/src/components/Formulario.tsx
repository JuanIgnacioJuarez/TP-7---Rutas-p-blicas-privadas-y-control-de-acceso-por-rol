import React, { useState } from 'react';
import { Participante } from '../models/Participante';
import { useParticipantes } from '../context/useParticipantes';

interface Props {
  participanteAEditar?: Participante | null;
  onCancelarEdicion?: () => void;
  onSuccess?: () => void;
}

interface ErroresFormulario {
  nombre?: string;
  email?: string;
  edad?: string;
  modalidad?: string;
  tecnologias?: string;
  nivel?: string;
  aceptaTerminos?: string;
}

const estadoInicial = {
  nombre: '',
  email: '',
  edad: 0,
  pais: 'Argentina',
  modalidad: 'Presencial',
  tecnologias: [] as string[],
  nivel: 'Principiante',
  aceptaTerminos: false
};

const Formulario: React.FC<Props> = ({ participanteAEditar, onCancelarEdicion, onSuccess }) => {
  const { agregar, editar } = useParticipantes();
  const [datosForm, setDatosForm] = useState(() =>
    participanteAEditar
      ? {
          nombre: participanteAEditar.nombre,
          email: participanteAEditar.email,
          edad: participanteAEditar.edad,
          pais: participanteAEditar.pais,
          modalidad: participanteAEditar.modalidad,
          tecnologias: participanteAEditar.tecnologias || [],
          nivel: participanteAEditar.nivel,
          aceptaTerminos: participanteAEditar.aceptaTerminos
        }
      : estadoInicial
  );
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const validarFormulario = () => {
    const nuevosErrores: ErroresFormulario = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!datosForm.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (datosForm.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!datosForm.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio.';
    } else if (!emailRegex.test(datosForm.email.trim())) {
      nuevosErrores.email = 'Ingresa un email valido.';
    }

    if (!Number.isInteger(datosForm.edad) || datosForm.edad < 16 || datosForm.edad > 120) {
      nuevosErrores.edad = 'La edad debe estar entre 16 y 120.';
    }

    if (!['Presencial', 'Virtual', 'Hibrido'].includes(datosForm.modalidad)) {
      nuevosErrores.modalidad = 'Selecciona una modalidad valida.';
    }

    if (!['Principiante', 'Intermedio', 'Avanzado'].includes(datosForm.nivel)) {
      nuevosErrores.nivel = 'Selecciona un nivel valido.';
    }

    if (!datosForm.tecnologias.length) {
      nuevosErrores.tecnologias = 'Selecciona al menos una tecnologia.';
    }

    if (!datosForm.aceptaTerminos) {
      nuevosErrores.aceptaTerminos = 'Debes aceptar los terminos y condiciones.';
    }

    return nuevosErrores;
  };

  const cambiarTecnologias = (tec: string) => {
    const actuales = datosForm.tecnologias;
    setDatosForm({
      ...datosForm,
      tecnologias: actuales.includes(tec)
        ? actuales.filter((t) => t !== tec)
        : [...actuales, tec]
    });
  };

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const p = new Participante(
      datosForm.nombre.trim(),
      datosForm.email.trim(),
      datosForm.edad,
      datosForm.pais,
      datosForm.nivel,
      datosForm.modalidad,
      datosForm.tecnologias,
      datosForm.aceptaTerminos
    );

    if (participanteAEditar?.id) {
      p.id = participanteAEditar.id;
      editar(p);
    } else {
      agregar(p);
    }

    setDatosForm(estadoInicial);
    setErrores({});
    onSuccess?.();
  };

  return (
    <form
      onSubmit={enviarFormulario}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100"
    >
      <h2 className="md:col-span-2 text-xl font-bold border-b pb-2 mb-2 text-gray-800">
        {participanteAEditar ? 'Editar Participante' : 'Registro de Participante'}
      </h2>

      <div className="flex flex-col">
        <label htmlFor="nombre" className="text-sm font-semibold mb-1">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={datosForm.nombre}
          required
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-300"
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'error-nombre' : undefined}
          onChange={(e) => setDatosForm({ ...datosForm, nombre: e.target.value })}
        />
        {errores.nombre && (
          <span id="error-nombre" className="text-xs text-red-600 mt-1">
            {errores.nombre}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-semibold mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={datosForm.email}
          required
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-300"
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? 'error-email' : undefined}
          onChange={(e) => setDatosForm({ ...datosForm, email: e.target.value })}
        />
        {errores.email && (
          <span id="error-email" className="text-xs text-red-600 mt-1">
            {errores.email}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="edad" className="text-sm font-semibold mb-1">
          Edad
        </label>
        <input
          id="edad"
          type="number"
          value={datosForm.edad || ''}
          min={16}
          max={120}
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-300"
          aria-invalid={Boolean(errores.edad)}
          aria-describedby={errores.edad ? 'error-edad' : undefined}
          onChange={(e) => setDatosForm({ ...datosForm, edad: parseInt(e.target.value, 10) || 0 })}
        />
        {errores.edad && (
          <span id="error-edad" className="text-xs text-red-600 mt-1">
            {errores.edad}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="pais" className="text-sm font-semibold mb-1">
          Pais
        </label>
        <select
          id="pais"
          className="border p-2 rounded bg-white"
          value={datosForm.pais}
          onChange={(e) => setDatosForm({ ...datosForm, pais: e.target.value })}
        >
          <option value="Argentina">Argentina</option>
          <option value="Chile">Chile</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Mexico">Mexico</option>
          <option value="Espana">Espana</option>
        </select>
      </div>

      <div className="md:col-span-2 p-3 bg-gray-50 rounded text-sm">
        <span className="block font-semibold mb-2">Modalidad de asistencia:</span>
        <div className="flex gap-6">
          {['Presencial', 'Virtual', 'Hibrido'].map((mod) => (
            <label key={mod} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="modalidad"
                checked={datosForm.modalidad === mod}
                onChange={() => setDatosForm({ ...datosForm, modalidad: mod })}
              />{' '}
              {mod}
            </label>
          ))}
        </div>
        {errores.modalidad && <p className="text-xs text-red-600 mt-2">{errores.modalidad}</p>}
      </div>

      <div className="md:col-span-2">
        <label className="block font-semibold mb-2 text-sm">Tecnologias conocidas:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded text-sm">
          {['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'].map((tec) => (
            <label key={tec} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={datosForm.tecnologias.includes(tec)}
                onChange={() => cambiarTecnologias(tec)}
              />{' '}
              {tec}
            </label>
          ))}
        </div>
        {errores.tecnologias && <p className="text-xs text-red-600 mt-2">{errores.tecnologias}</p>}
      </div>

      <div className="md:col-span-2 flex flex-col">
        <label htmlFor="nivel" className="text-sm font-semibold mb-1">
          Nivel de experiencia
        </label>
        <select
          id="nivel"
          className="border p-2 rounded bg-white"
          value={datosForm.nivel}
          aria-invalid={Boolean(errores.nivel)}
          aria-describedby={errores.nivel ? 'error-nivel' : undefined}
          onChange={(e) => setDatosForm({ ...datosForm, nivel: e.target.value })}
        >
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
        {errores.nivel && (
          <span id="error-nivel" className="text-xs text-red-600 mt-1">
            {errores.nivel}
          </span>
        )}
      </div>

      <div className="md:col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="terminos"
          checked={datosForm.aceptaTerminos}
          onChange={(e) => setDatosForm({ ...datosForm, aceptaTerminos: e.target.checked })}
        />
        <label htmlFor="terminos" className="text-xs">
          Acepto los terminos y condiciones del evento
        </label>
      </div>
      {errores.aceptaTerminos && (
        <p className="md:col-span-2 text-xs text-red-600 -mt-2">{errores.aceptaTerminos}</p>
      )}

      <div className="md:col-span-2 flex gap-2 mt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition shadow"
        >
          {participanteAEditar ? 'Actualizar' : 'Finalizar registro'}
        </button>
        {participanteAEditar && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="flex-1 bg-gray-400 text-white py-3 rounded font-bold hover:bg-gray-500 transition shadow"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default Formulario;

