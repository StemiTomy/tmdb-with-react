import React, { useState, useEffect } from 'react';
import '../Movies/Movies.css';
import fetchPopularMovies from "../../services/apiCalls";

const Popular = ({ apiKey }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularMovies = await fetchPopularMovies(apiKey);
        setMovies(popularMovies);
      } catch (error) {
        console.error('Error al obtener las películas populares:', error);
      }
    };
    fetchData();
  }, [apiKey]);

  return (
    <div className="movie-list">
      <h1>Listado de Películas Populares</h1>
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

export default Popular;
