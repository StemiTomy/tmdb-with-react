// Movies.jsx
import React from 'react';
import './MovieSearch.css';
import { Link } from 'react-router-dom';
import { useSearch } from '../../common/SearchContext';

const MovieSearch = () => {
  const { movies, criteria, currentPage, setCurrentPage, totalPages } = useSearch();

  return (
    <div className="movie-list">
      <h1 className='movie-list-title'>{criteria && `'${criteria}'`}</h1>
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
        <span className='pagination-page'>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default MovieSearch;
