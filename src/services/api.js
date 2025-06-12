// src/api.js

import axios from 'axios';

// Define the base URL for your API.
// It's a good practice to use an environment variable for this.
const API_BASE_URL = 'http://localhost:5555'; // Your backend server URL

// Create a new axios instance with a predefined configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Use 'withCredentials: true' if your backend uses session cookies for auth
  // instead of tokens. If you use both, you can leave this here.
  withCredentials: true, 
});

/**
 * Request Interceptor
 * * This function will run before every request is sent.
 * It's the perfect place to automatically add an authentication token to headers.
 */
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * * This function will run after a response is received.
 * It's ideal for handling global errors, like a 401 (Unauthorized) error.
 */
api.interceptors.response.use(
  (response) => {
    // If the request was successful (status 2xx), just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response?.status === 401) {
      console.error('UNAUTHORIZED ACCESS - Redirecting to login.');
      // Clear any invalid auth data from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also remove user data if you store it
      
      // Redirect the user to the login page
      // This is a failsafe to ensure users re-authenticate
      window.location.href = '/login'; 
    }
    
    // For all other errors, we pass them along to be handled by the
    // try/catch block in the component that made the API call.
    return Promise.reject(error);
  }
);

export default api;