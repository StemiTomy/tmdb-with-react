import { Routes, Route } from 'react-router-dom'
import MovieSearch from '../MovieSearch/MovieSearch'
import PopularMovies from '../PopularMovies/PopularMovies'
import Register from "../../pages/Register/Register";
import Login from '../Login/Login';
import { useAuth } from '../../services/AuthContext';
import ProtectedRoutes from '../../services/ProtectedRoutes';
import AuthenticatedRoutes from '../../services/AuthenticatedRoutes';
import MovieDetails from '../../common/MovieDetails/MovieDetails';
import MovieGenre from '../MovieGenre/MovieGenre.jsx';

export const Body = () => {
    const { apiKey, login } = useAuth();

    // abajo hay 2 Rutas protegidas que depende de si el usuario esta autenticado o no redirigen
    // a un sitio u a otro, con o sin prompts.
    return (
        <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route path="/*" element={<PopularMovies apiKey={apiKey} />} />
                <Route path="/movieSearch" element={<MovieSearch apiKey={apiKey} />} />
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