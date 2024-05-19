import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import MovieSearch from '../MovieSearch/MovieSearch'
import PopularMovies from '../PopularMovies/PopularMovies'
import Register from "../Register/Register";
import Login from '../Login/Login';
import { useAuth } from '../../services/AuthContext';
import ProtectedRoutes from '../../services/ProtectedRoutes';
import AuthenticatedRoutes from '../../services/AuthenticatedRoutes';
import MovieDetails from '../../common/MovieDetails/MovieDetails';
import MovieGenre from '../MovieGenre/MovieGenre';
import Profile from '../Profile/Profile';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../firebaseConfig'; // Ajusta la ruta según sea necesario

export const Body = () => {
    const { apiKey, login } = useAuth();

    const useAuthObserver = (onLogin, onLogout) => {
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    // Usuario está logeado, puedes obtener información del usuario aquí
                    const uid = user.uid;
                    console.log(`Usuario logeado: ${uid}`);
                    onLogin(uid); // Puedes pasar la información del usuario a tu aplicación
                } else {
                    // Usuario está deslogeado
                    console.log('Usuario deslogeado');
                    onLogout(); // Puedes manejar el estado de deslogueo aquí
                }
            });

            return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
        }, [onLogin, onLogout]);
    };

    useAuthObserver();

    // abajo hay 2 Rutas protegidas que depende de si el usuario esta autenticado o no redirigen
    // a un sitio u a otro, con o sin prompts.
    return (
        <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route path="/*" element={<PopularMovies apiKey={apiKey} />} />
                <Route path="/movieSearch" element={<MovieSearch apiKey={apiKey} />} />
                <Route path="/profile" element={<Profile apiKey={apiKey} />} />
                <Route path="/movie/:id" element={<MovieDetails apiKey={apiKey} />} />
                <Route path="/genre/:genreId" element={<MovieGenre apiKey={apiKey} />} />
            </Route>
            <Route element={<AuthenticatedRoutes redirectTo="/profile" />}>
                <Route path="/register" element={<Register onLogin={login} />} />
                <Route path="/login" element={<Login onLogin={login} />} />
            </Route>
        </Routes>
    )
}