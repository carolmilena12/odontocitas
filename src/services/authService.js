// src/services/authService.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
  const response = await axios.post(`${API}/auth/login`, credentials);
  return response.data;
};
