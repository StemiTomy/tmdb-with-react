import { Routes, Route } from 'react-router-dom'
import Movies from '../Movies/Movies'
import Popular from '../Popular/Popular'
import Register from "../../pages/Register/Register";
import Login from '../Login/Login';
import { useAuth } from '../../services/AuthContext';
import ProtectedRoutes from '../../services/ProtectedRoutes';
import AuthenticatedRoutes from '../../services/AuthenticatedRoutes';

export const Body = () => {
    const { apiKey, login } = useAuth();

    // abajo hay 2 Rutas protegidas que depende de si el usuario esta autenticado o no redirigen
    // a un sitio u a otro, con o sin prompts.
    return (
        <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route path="/*" element={<Popular apiKey={apiKey} />} />
                <Route path="/movies" element={<Movies apiKey={apiKey} />} />
            </Route>
            <Route element={<AuthenticatedRoutes redirectTo="/profile" />}>
                <Route path="/register" element={<Register onLogin={login} />} />
                <Route path="/login" element={<Login onLogin={login} />} />
            </Route>
        </Routes>
    )
}