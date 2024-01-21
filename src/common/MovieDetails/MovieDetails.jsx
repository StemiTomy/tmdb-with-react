import React, { useEffect, useState } from 'react';
import { fetchMovieDetails, fetchDirector, fetchMovieCast, fetchSimilarMovies } from "../../services/apiCalls";
import { useParams, Link } from 'react-router-dom';
import './MovieDetails.css'

const MovieDetails = ({ apiKey }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const { id } = useParams();
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const details = await fetchMovieDetails(id, apiKey);
        setMovieDetails(details);
        const directorName = await fetchDirector(id, apiKey);
        setDirector(directorName);
        const castData = await fetchMovieCast(id, apiKey);
        setCast(castData);
        const movies = await fetchSimilarMovies(id, apiKey);
        setSimilarMovies(movies);
      } catch (error) {
        console.error('Error loading movie details, director, reparto o similarMovies: ', error);
      }
    };

    loadMovieDetails();
  }, [id, apiKey]); // apiKey no sé hasta qué punto

  // arreglar el login para meter un setTimeOut
  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  // detalles pelicula
  const getYear = (dateString) => {
    return dateString.split('-')[0];
  };

  // cambiar código a US para usa y ES si estamos en españa
  const getCertification = (releaseDates, countryCode = 'ES') => {
    const countryData = releaseDates.find(rd => rd.iso_3166_1 === countryCode);
    return countryData ? countryData.release_dates[0].certification : 'N/A';
  };

  const getFormattedReleaseDate = (dateString) => {
    const date = new Date(dateString);
    const countryCode = 'ES'; // Suponiendo que la aplicación esté en español
    return `${date.toLocaleDateString('es-ES')} (${countryCode})`;
  };

  const formatRuntime = minutes => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  const languageMap = {
    'en': 'Inglés',
    'es': 'Castellano',
    // Agrega más mapeos aquí si es necesario
  };

  return (
    <div className='movie-details'>
      {/*<p>Lista de géneros: {movieDetails.genres}</p>*/}

      {/* <div class="blurred" style={{backgroundImage: "url('https://media.themoviedb.org/t/p/w300_and_h450_multi_faces_filter(blur)/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg')"}}></div> */}
      <div className="background-img"
        style={{
          backgroundImage: `url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movieDetails.backdrop_path}')`,
          height: '100%', // Ejemplo de altura, ajústalo según tus necesidades
          width: '100vw',
          backgroundPosition: 'left calc((50vw - 170px) - 340px) top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <div className='background-blur' style={{
          backgroundImage: 'linear-gradient(to right, rgba(31.5, 10.5, 10.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 10.5, 10.5, 0.84) 50%, rgba(31.5, 10.5, 10.5, 0.84) 100%)'
        }}>
          <div className='movie-info'>
            <div className='movie-poster-wrapper'>
              <img className='movie-poster' src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${movieDetails.poster_path}`} alt={`${movieDetails.title} poster`} />
              <div className='movie-poster-info'>
                <ul>
                  {movieDetails.genres.map((genre) => (
                    <li key={genre.id}>
                      <Link to={`/genre/${genre.id}?name=${genre.name}`}>{genre.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='movie-header-wrapper'>
              <div className='movie-header-info'>

                <div className='movie-info-div'>
                  <h2>
                    <a href="">{movieDetails.title}</a>
                    <span>({getYear(movieDetails.release_date)})</span>
                  </h2>
                  <div>
                    <span className='certification'>{getCertification(movieDetails.release_dates)}</span>
                    <span className='release'>{getFormattedReleaseDate(movieDetails.release_date)}</span>
                    <span className='runtime'>{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                </div>

                <div className='movie-info-div'>
                  <h3 className='tagline'>{movieDetails.tagline}</h3>

                  <h3>Sinopsis</h3>
                  <div>{movieDetails.overview}</div>

                  <h3 className='language-h3'>Idioma original: <span className='language'>{languageMap[movieDetails.original_language] || movieDetails.original_language}</span></h3>

                  <h3 className='director-h3'>Director: <span className='director'>{director}</span></h3> {/* Muestra el nombre del director */}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seccion actores ('.slice(0,10)' hace que solo los 10 principales) */}
      <div className='content-wrapper'>
        <div className='cast-list'>
          <h2 className='cast-list-title'>Reparto principal</h2>
          <div className="cast-scroller">
            <ol className="cast-cards">
              {cast.slice(0, 10).map((actor, index) => (
                <li className="card" key={index}>
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w138_and_h175_face${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-image"
                    />
                  )}
                  <p className="actor-name">{actor.name}</p>
                  <p className="character-name">{actor.character}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Seccion peliculas parecidas */}

        <div className="movie-list">
          <h2 className='movie-list-title'>Películas Similares</h2>
          <div className="movie-grid">
            {similarMovies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="movie-card">
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
      </div>

    </div>
  );
};

export default MovieDetails;