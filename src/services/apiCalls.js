import axios from 'axios'

const ROOT_API_TMDB = 'https://api.themoviedb.org/3/';

// TMDB apiCalls
export const bringMovies = async (criteria, apiKey, page = 1) => {
  return await axios.get(`${ROOT_API_TMDB}search/movie?query=${encodeURIComponent(criteria)}&include_adult=false&language=en-US&page=${page}&api_key=${apiKey}`)
}

export const fetchMoviesByGenre = async (genreId, apiKey) => {
  try {
    const response = await axios.get(`${ROOT_API_TMDB}discover/movie?with_genres=${genreId}&language=en-US&page=1&api_key=${apiKey}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};
