import { Link, useNavigate, useParams } from 'react-router-dom';
import Formulario from '../components/Formulario';
import { useParticipantes } from '../context/useParticipantes';

function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { participantes } = useParticipantes();

  const participante = participantes.find((p) => p.id === Number(id));

  if (!participante) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Participante no encontrado</h2>
        <p className="text-gray-600 mb-4">
          No existe un participante con id <strong>{id}</strong>.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Editar Participante</h2>
      <Formulario
        key={participante.id}
        participanteAEditar={participante}
        onCancelarEdicion={() => navigate('/')}
        onSuccess={() => navigate('/')}
      />
    </div>
  );
}

export default EditarPage;

