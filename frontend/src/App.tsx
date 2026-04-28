import { useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormularioPage from './pages/FormularioPage';
import EditarPage from './pages/EditarPage';
import { useParticipantes } from './context/useParticipantes';

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { error, limpiarError } = useParticipantes();

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-blue-900 hover:bg-blue-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="min-w-0" onClick={() => setMenuAbierto(false)}>
              <h1 className="text-lg md:text-2xl font-extrabold text-blue-900 tracking-tight uppercase truncate">
                Sistema de Registro de Eventos
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-semibold">
                UTN - Programacion 4
              </p>
            </Link>

            <button
              type="button"
              className="md:hidden px-3 py-2 rounded-lg border border-slate-300 text-blue-900 font-bold"
              onClick={() => setMenuAbierto((valorActual) => !valorActual)}
              aria-label="Abrir menu"
              aria-expanded={menuAbierto}
            >
              {menuAbierto ? 'X' : 'MENU'}
            </button>

            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/" className={linkClassName}>
                Participantes
              </NavLink>
              <NavLink to="/nuevo" className={linkClassName}>
                Nuevo
              </NavLink>
            </nav>
          </div>

          {menuAbierto && (
            <nav className="md:hidden mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
              <NavLink
                to="/"
                className={linkClassName}
                onClick={() => setMenuAbierto(false)}
              >
                Participantes
              </NavLink>
              <NavLink
                to="/nuevo"
                className={linkClassName}
                onClick={() => setMenuAbierto(false)}
              >
                Nuevo
              </NavLink>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div
            className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
            role="alert"
          >
            <p className="text-sm font-medium">{error}</p>
            <button
              type="button"
              onClick={limpiarError}
              className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              aria-label="Cerrar mensaje de error"
            >
              Cerrar
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nuevo" element={<FormularioPage />} />
          <Route path="/editar/:id" element={<EditarPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
