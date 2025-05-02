import axios from 'axios';
import { events } from './events';

const LOCAL_API = 'http://127.0.0.1:8000';

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || LOCAL_API,
  withCredentials: true,
});

backendApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await backendApi.post('/api/auth/token/refresh/', {});
        return backendApi(originalRequest);
      } catch (refreshError) {
        console.error('Fallo en refresh token:', refreshError);

        if (events.onSessionExpired) {
          events.onSessionExpired();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ************ API AUTH ************

export const registerUser = async (userData) => {
  try {
    const response = await backendApi.post('/api/autenticacion/registro/', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    // throw new Error(error.response?.data?.detail || 'Error en el registro');
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const response = await backendApi.post('/api/auth/login/', {
    email,
    password
  });
  return response.data;
};


export const fetchUserAuth = async () => {
  try {
    const response = await backendApi.get('/api/auth/user/');
    console.table(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user auth:', error);
    throw new Error(error.response?.data?.detail || 'No estás autenticado');
  }
};


// ************ API TMDB ************

export const fetchPopularMovies = async (page = 1, language, region = '') => {
  try {
    const response = await backendApi.get('/api/tmdb/populares/', {
      params: {
        page,
        language,
        ...(region && { region }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener las películas');
  }
};

export const fetchMovieDetails = async (movieId, language) => {
  try {
    const response = await backendApi.get(`/api/tmdb/movie/${movieId}/`, {
      params: { language }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener los detalles');
  }
};

export const fetchCredits = async (movieId, language) => {
  try {
    const response = await backendApi.get(`/api/tmdb/movie/${movieId}/credits/`, {
      params: { language }
    });
    const { crew, cast } = response.data;

    const director = crew.find(person => person.job === 'Director');
    return {
      director: director ? director.name : '',
      cast: cast || [],
    };
  } catch (error) {
    console.error('Error loading credits:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener los créditos');
  }
};

export const fetchSimilarMovies = async (movieId, language) => {
  try {
    const response = await backendApi.get(`/api/tmdb/movie/${movieId}/similar`, {
      params: { language }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error(error.response?.data?.error || 'Error al obtener los detalles');
  }
};

// ************ PERFIL ************

export const actualizarFotoDePerfil = async (formData) => {
  try {
    const response = await backendApi.post('/api/actualizar-foto-de-perfil/', formData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const fetchFotoDePerfil = async () => {
  try {
    const response = await backendApi.get('/api/obtener-foto-de-perfil/');
    console.table(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user auth:', error);
    throw new Error(error.response?.data?.detail || 'No estás autenticado');
  }
};
