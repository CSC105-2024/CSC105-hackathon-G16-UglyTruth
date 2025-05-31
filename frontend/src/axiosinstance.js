import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for adding auth token
Axios.interceptors.request.use(
  (config) => {
    // Add detailed logging for debugging
    console.log(`Request to ${config.url} with method ${config.method}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
Axios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error);
    
    if (error.response && error.response.status === 401) {
      console.log('Authentication error, redirecting to login');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { Axios };
