import { useEffect, useState } from 'react';
//import { faBookmark as solidBookmark, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { fetchMovieDetails, fetchCredits, fetchSimilarMovies } from '../../api';
import { useParams, Link } from 'react-router-dom';
import './MovieDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card, Typography } from 'antd';

const { Title } = Typography;

const MovieDetails = ({ apiKey }) => {
  const { i18n } = useTranslation();
  const [movieDetails, setMovieDetails] = useState(null);
  const { id } = useParams();
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const details = await fetchMovieDetails(id, i18n.language);
        setMovieDetails(details);
  
        const { director: directorName, cast: castData } = await fetchCredits(id, i18n.language);
        setDirector(directorName);
        setCast(castData);
  
        const similar = await fetchSimilarMovies(id, i18n.language);
        setSimilarMovies(similar.results || []);
      } catch (error) {
        console.error('Error loading movie details or credits:', error);
      }
    };
  
    loadMovieDetails();
  }, [id, apiKey, i18n.language]); // apiKey no sé hasta qué punto

  // arreglar el login para meter un setTimeOut
  if (!movieDetails) {
    return <div>Loading...</div>; // TODO: arreglar esto...
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
                    <a href="">{movieDetails.title}</a> {/** TODO: arreglar que no haya ningún link ni nada, ya veremos lo que haremos*/}
                    <span>({getYear(movieDetails.release_date)})</span>
                  </h2>
                  <div>
                    <span className='certification'>{getCertification(movieDetails.release_dates)}</span>
                    <span className='release'>{getFormattedReleaseDate(movieDetails.release_date)}</span>
                    <span className='runtime'>{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                </div>

                {/*<div className='icons'>
                  <FontAwesomeIcon icon={faHeart} className="fa-heart-solid" onClick={() => handleFavoriteClick(movieDetails.id, movieDetails.title)} />
                  <FontAwesomeIcon icon={faBookmark} className="fa-bookmark-solid" onClick={() => handleFavoriteClick(movieDetails.id)} />
                </div>*/}

                <div className='icons'>
                  <FontAwesomeIcon icon="user" className="fa-heart-solid"  />
                  <FontAwesomeIcon icon="search" className="fa-bookmark-solid"/>
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

        {/* Sección de películas similares con Ant Design */}
        <div className="movie-list" style={{ padding: '2rem' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Películas Similares
          </Title>
          <Row gutter={[16, 24]} justify="center">
            {similarMovies.map((movie) => (
              <Col
                key={movie.id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
              >
                <Link to={`/movie/${movie.id}`}>
                  <Card
                    hoverable
                    cover={
                      movie.poster_path ? (
                        <img
                          alt={movie.title}
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          style={{ borderRadius: '8px', height: '300px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          height: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f0f0f0',
                          borderRadius: '8px'
                        }}>
                          Sin imagen
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={movie.title}
                      style={{ textAlign: 'center', fontWeight: 'bold' }}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

      </div>

    </div>
  );
};

MovieDetails.propTypes = {
  apiKey: PropTypes.func.isRequired,
};

export default MovieDetails;
