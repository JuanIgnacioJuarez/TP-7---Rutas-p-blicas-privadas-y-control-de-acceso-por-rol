import { useNavigate } from 'react-router-dom';
import Formulario from '../components/Formulario';

function FormularioPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Nuevo Participante</h2>
      <Formulario onSuccess={() => navigate('/')} />
    </div>
  );
}

export default FormularioPage;
