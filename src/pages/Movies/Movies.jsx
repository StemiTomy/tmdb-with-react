// Movies.jsx
import React from 'react';
import './Movies.css';
import { useSearch } from '../../common/SearchContext';

const Movies = () => {
  const { movies, criteria } = useSearch();

  return (
    <div className="movie-list">
      <h1>Búsqueda: {criteria && `para "${criteria}"`}</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
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
        ))}
      </div>
    </div>
  );
};

export default Movies;
