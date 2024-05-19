import axios from 'axios'

const ROOT_API_TMDB = 'https://api.themoviedb.org/3/';

// TMDB apiCalls
export const bringMovies = async (criteria, apiKey, page = 1) => {
  return await axios.get(`${ROOT_API_TMDB}search/movie?query=${encodeURIComponent(criteria)}&include_adult=false&language=en-US&page=${page}&api_key=${apiKey}`)
}

export const fetchMovieDetails = async (movieId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/${movieId}?api_key=${apiKey}`);
    const movieDetails = response.data;

    // Clasificaciones por edades
    const responseReleaseDates = await axios.get(`${ROOT_API_TMDB}movie/${movieId}/release_dates?api_key=${apiKey}`);
    movieDetails.release_dates = responseReleaseDates.data.results;

    return movieDetails;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const fetchDirector = async (movieId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/${movieId}/credits?api_key=${apiKey}`);
    const crew = response.data.crew;
    const directorData = crew.find(person => person.job === 'Director');
    return directorData ? directorData.name : '';
  } catch (error) {
    console.error('Error loading director details: ', error);
    throw error;
  }
};

export const fetchMovieCast = async (movieId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/${movieId}/credits?api_key=${apiKey}`);
    const cast = response.data.cast;
    return cast;
  } catch (error) {
    console.error('Error loading movie cast details: ', error);
    throw error;
  }
};

export const fetchMoviesByGenre = async (genreId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}discover/movie?with_genres=${genreId}&language=en-US&page=1&api_key=${apiKey}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const fetchPopularMovies = async (apiKey, page = 1) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/popular?language=en-US&page=${page}&api_key=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const fetchSimilarMovies = async (movieId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/${movieId}/similar?api_key=${apiKey}&language=es`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};

// DDBB calls
/*
export const handleFavoriteClick = async (movieId, movieTitle) => {
  try {
    const token = localStorage.getItem('token');
    console.log(movieId, movieTitle, token)

    await axios.post('/favorites', { movieId, movieTitle }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token // Incluye el token en el encabezado de autorización
      },
    });
    
  } catch (error) {
    console.error('Error al guardar la película como favorita', error);
  }
};

export const handleWatchLaterClick = async (movieId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('/api/user/watchlater', movieId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error al guardar la película para ver más tarde', error);
  }
};
*/
export default fetchPopularMovies; 