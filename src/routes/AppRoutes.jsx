import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoutes from './ProtectedRoutes';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import Spinner from '../components/Spinner';
import Register2 from '../pages/auth/Register2';
import Login2 from '../pages/auth/Login2';

// 🧠 Lazy imports (solo se descargan si se visitan)
const MovieSearch = lazy(() => import('../pages/MovieSearch/MovieSearch'));
const PopularMovies = lazy(() => import('../pages/PopularMovies/PopularMovies'));
const Register = lazy(() => import('../pages/Register/Register'));
const Login = lazy(() => import('../pages/Login/Login'));
const MovieDetails = lazy(() => import('../common/MovieDetails/MovieDetails'));
const MovieGenre = lazy(() => import('../pages/MovieGenre/MovieGenre'));
const Profile = lazy(() => import('../pages/Profile/Profile'));

export const AppRoutes = () => {
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
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route element={<ProtectedRoutes />}>
                    <Route path="/*" element={<PopularMovies apiKey={apiKey} />} />
                    <Route path="/movieSearch" element={<MovieSearch apiKey={apiKey} />} />
                    <Route path="/profile" element={<Profile apiKey={apiKey} />} />
                    <Route path="/movie/:id" element={<MovieDetails apiKey={apiKey} />} />
                    <Route path="/genre/:genreId" element={<MovieGenre apiKey={apiKey} />} />
                </Route>
                <Route element={<AuthenticatedRoutes redirectTo="/profile" />}>
                    {/* <Route path="/register" element={<Register/>} />    esto es la auth para firebase    */}
                    <Route path="/register" element={<Register2/>} />
                    {/* <Route path="/login" element={<Login/>} /> esto es la auth para firebase*/}
                    <Route path="/login" element={<Login2/>} />
                </Route>
            </Routes>
        </Suspense>
    )
}