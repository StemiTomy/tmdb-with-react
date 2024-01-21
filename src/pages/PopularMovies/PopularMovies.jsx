import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../MovieSearch/MovieSearch.css';
import fetchPopularMovies from "../../services/apiCalls";

const PopularMovies = ({ apiKey }) => {
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
    </div>
  );
};

export default PopularMovies;
