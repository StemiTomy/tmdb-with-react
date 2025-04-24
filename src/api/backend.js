import axios from 'axios';

// Puedes usar esto localmente durante desarrollo:
const LOCAL_API = 'http://127.0.0.1:8000';

// O usar tu dominio personalizado para producción:
const PROD_API = 'https://tmdb.steluttomoiaga.com';

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || LOCAL_API, // configurable por .env
  withCredentials: true, // si usas cookies/sesiones
});

// Registro de usuario
export const registerUserOld2 = async (userData) => {
  try {
    const response = await backendApi.post('/api/auth/registration/', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error(error.response?.data?.detail || 'Error en el registro');
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await backendApi.post('/api/autenticacion/registro/', userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error(error.response?.data?.detail || 'Error en el registro');
  }
};

export const registerUserOLD = async ({ email, password1, password2 }) => {
    const response = await backendApi.post(
      '/accounts/signup/',
      new URLSearchParams({
        email,
        password1,
        password2,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  };

export const loginUserOLD = async ({ email, password }) => {
    const response = await backendApi.post('/api/auth/login/', {
      email,
      password,
    });
    return response.data;
};

export const loginUser = async ({ email, password }) => {
    const response = await backendApi.post(
      '/accounts/login/',
      new URLSearchParams({
        login: email,
        password: password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  };
