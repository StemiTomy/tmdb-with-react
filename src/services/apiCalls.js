import axios from 'axios'

const ROOT_API_TMDB = 'https://api.themoviedb.org/3/';

// export const loginMe = async (body) => {
//     return await axios.post(`https://dummyjson.com/auth/login`, body)
// }

export const bringMovies = async (criteria, apiKey) => {
    return await axios.get(`${ROOT_API_TMDB}search/movie?query=${criteria}&include_adult=false&language=en-US&page=4&api_key=${apiKey}`)
}
export const fetchPopularMovies = async (apiKey) => {
    try {
      const response = await axios.get(`${ROOT_API_TMDB}movie/popular?language=en-US&page=1&api_key=${apiKey}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  };

export default fetchPopularMovies;  // Exporta la función por defecto