import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para manejar mensajes de error
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Limpiamos errores previos
    
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user);
                navigate('/lista'); // Redirigimos al área privada
            } else {
                // Si el backend devuelve 401 u otro error
                setError('Credenciales incorrectas. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error de red al iniciar sesión', error);
            setError('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-12 md:mt-24 px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
        
                {/* Cabecera del formulario */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2">
                        Iniciar Sesión
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">
                        Registro de Participantes
                    </p>
                </div>

                {/* Mensaje de error visual */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-semibold text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Input Usuario */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="username">
                            Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-slate-50 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors bg-slate-50 focus:bg-white"
                            required
                        />
                    </div>

                    {/* Botón Login */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}