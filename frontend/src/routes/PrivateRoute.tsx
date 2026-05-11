import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

// 1. Definimos exactamente qué props recibe este componente
interface PrivateRouteProps {
    children: ReactNode;
    rol?: "ADMIN" | "CONSULTA"; // Es opcional (?) porque no todas las rutas exigen un rol específico
}

export default function PrivateRoute({ children, rol }: PrivateRouteProps) {
    const { user } = useAuth();

    // Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene, redirigir a una ruta segura
    if (rol && user.rol !== rol) {
        return <Navigate to="/lista" />; 
    }

    return children;
}