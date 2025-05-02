import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoutes from './ProtectedRoutes';
import AuthenticatedRoutes from './AuthenticatedRoutes';
import Spinner from '../components/Spinner';
import Register2 from '../pages/auth/Register2';
import Login2 from '../pages/auth/Login2';

const MovieSearch = lazy(() => import('../pages/MovieSearch/MovieSearch'));
const PopularMovies = lazy(() => import('../pages/PopularMovies/PopularMovies'));
const MovieDetails = lazy(() => import('../common/MovieDetails/MovieDetails'));
const MovieGenre = lazy(() => import('../pages/MovieGenre/MovieGenre'));
const Profile = lazy(() => import('../pages/Profile/Profile'));

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/*" element={<PopularMovies />} />
          <Route path="/movieSearch" element={<MovieSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/genre/:genreId" element={<MovieGenre />} />
        </Route>

        <Route element={<AuthenticatedRoutes redirectTo="/profile" />}>
          <Route path="/register" element={<Register2 />} />
          <Route path="/login" element={<Login2 />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
