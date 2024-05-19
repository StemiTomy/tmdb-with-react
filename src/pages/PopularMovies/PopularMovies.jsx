import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../MovieSearch/MovieSearch.css';
import fetchPopularMovies from "../../services/apiCalls";
import PropTypes from 'prop-types';

const PopularMovies = ({ apiKey }) => {
  const MAX_PAGES = 10;
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularMovies = await fetchPopularMovies(apiKey, currentPage);
        console.log(popularMovies);
        setMovies(popularMovies.results);
      } catch (error) {
        console.error('Error al obtener las películas populares:', error);
      }
    };
    fetchData();
  }, [apiKey, currentPage]);

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

PopularMovies.propTypes = {
  apiKey: PropTypes.func.isRequired,
};

export default PopularMovies;
