import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORT}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Handle authentication errors
    if (error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle server errors
    const errorMessage = error.response.data?.message || 'An error occurred';
    throw new Error(errorMessage);
  }
);

// Authentication API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  // Get current user
  getMe: async () => {
    return await api.get('/auth/me');
  },
};

// Contact API functions
export const contactAPI = {
  // Get all contacts
  getAllContacts: async () => {
    return await api.get('/contacts');
  },

  // Search contacts
  searchContacts: async (query) => {
    return await api.get('/contacts/search', { params: { q: query } });
  },

  // Get single contact
  getContact: async (id) => {
    return await api.get(`/contacts/${id}`);
  },

  // Create contact
  createContact: async (contactData) => {
    return await api.post('/contacts', contactData);
  },

  // Update contact
  updateContact: async (id, contactData) => {
    return await api.put(`/contacts/${id}`, contactData);
  },

  // Delete contact
  deleteContact: async (id) => {
    return await api.delete(`/contacts/${id}`);
  },
};

export default api;
