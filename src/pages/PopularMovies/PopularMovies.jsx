import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../MovieSearch/MovieSearch.css';
import fetchPopularMovies from "../../services/apiCalls";
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/Spinner';

const MAX_PAGES = 10;

const PopularMovies = () => {
  const { apiKey } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['popularMovies', currentPage],
    queryFn: () => fetchPopularMovies(apiKey, currentPage),
    enabled: !!apiKey, // no ejecutes hasta tener la apiKey
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
  

  if (isLoading) return <Spinner />;
  if (error) return <p>Error al obtener películas: {error.message}</p>;

  const movies = data?.results || [];

  return (
    <div className="movie-list">
      <h1 className='movie-list-title'>Películas Populares</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div key={movie.id} className="movie-card">
              <h2 className="movie-title">{movie.title}</h2>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-image"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span className='pagination-page'>Página {currentPage} de {MAX_PAGES}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= MAX_PAGES}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PopularMovies;
