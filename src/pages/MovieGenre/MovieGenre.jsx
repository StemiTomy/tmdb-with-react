import { useEffect, useState } from 'react';
import { fetchMoviesByGenre } from "../../services/apiCalls";
import { useParams, Link, useLocation } from 'react-router-dom';
import '../MovieSearch/MovieSearch.css';
import PropTypes from 'prop-types';

const MovieGenre = ({ apiKey }) => {
    const [movies, setMovies] = useState([]);
    const { genreId } = useParams();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const genreName = query.get('name') || '';

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const moviesByGenre = await fetchMoviesByGenre(genreId, apiKey);
                setMovies(moviesByGenre);
            } catch (error) {
                console.error('Error al cargar películas por género:', error);
            }
        };

        loadMovies();
    }, [genreId, apiKey]);

    if (!movies.length) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='movie-list'>
            <h1 className='movie-list-title'>Películas de `{genreName}`</h1>
            <div className="movie-grid">
                {movies.map((movie) => (
                    <Link to={`/movie/${movie.id}`} key={movie.id}>
                        <div className="movie-card">
                            <h2 className="movie-title">{movie.title}</h2>
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            ) : (
                                <div className="no-image">Imagen no disponible</div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

MovieGenre.propTypes = {
    apiKey: PropTypes.func.isRequired,
};

export default MovieGenre;
