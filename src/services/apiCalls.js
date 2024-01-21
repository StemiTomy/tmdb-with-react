import axios from 'axios'

const ROOT_API_TMDB = 'https://api.themoviedb.org/3/';
// se puede cambiar el page a 4 por ejemplo
export const bringMovies = async (criteria, apiKey) => {
  return await axios.get(`${ROOT_API_TMDB}search/movie?query=${encodeURIComponent(criteria)}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`)
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

export const fetchPopularMovies = async (apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}movie/popular?language=en-US&page=1&api_key=${apiKey}`);
    return response.data.results;
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

export default fetchPopularMovies; 