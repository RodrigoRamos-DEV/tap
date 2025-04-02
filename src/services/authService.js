import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Altere para sua URL de API

// Configuração básica do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({ message: 'Sem resposta do servidor' });
    } else {
      return Promise.reject({ message: 'Erro ao configurar a requisição' });
    }
  }
);

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    // Armazene o token JWT ou dados do usuário conforme necessário
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email, password, code) => {
  try {
    const response = await api.post('/register', { email, password, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// authService.js - Adicione estas funções:

export const validateRegistrationCode = async (code) => {
  try {
    const response = await api.get(`/codes/validate/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProfile = async (userId, cardData, slug) => {
  try {
    const response = await api.post('/profiles', { userId, cardData, slug });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funções de admin (protegidas)
export const generateCodes = async (quantity) => {
  try {
    const response = await api.post('/admin/codes', { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveCodes = async () => {
  try {
    const response = await api.get('/admin/codes');
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Adicione esta função ao seu authService.js
export const getProfileBySlug = async (slug) => {
  try {
    const response = await api.get(`/profiles/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Adicione estas funções
export const getUserProfiles = async () => {
  try {
    const response = await api.get('/profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfile = async (slug) => {
  try {
    const response = await api.delete(`/profiles/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};