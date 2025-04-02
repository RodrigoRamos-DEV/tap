// src/services/authService.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Apenas até /api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor para adicionar token JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'Servidor não respondeu' });
    } else {
      return Promise.reject({ message: 'Erro ao configurar requisição' });
    }
  }
);

// Exportações individuais para compatibilidade com seu código existente
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, password, code) => {
  try {
    const response = await API.post('/auth/register', { email, password, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateRegistrationCode = async (code) => {
  try {
    const response = await API.get(`/auth/codes/validate/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await API.post('/profiles', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileBySlug = async (slug) => {
  try {
    const response = await API.get(`/profiles/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfiles = async () => {
  try {
    const response = await API.get('/profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (slug) => {
  try {
    const response = await API.delete(`/profiles/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateCodes = async (quantity) => {
  try {
    const response = await API.post('/admin/codes', { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveCodes = async () => {
  try {
    const response = await API.get('/admin/codes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Exportação padrão com todas as funções (opcional)
const authService = {
  loginUser,
  registerUser,
  validateRegistrationCode,
  createProfile,
  getProfileBySlug,
  getUserProfiles,
  deleteProfile,
  generateCodes,
  getActiveCodes
};

export default authService;