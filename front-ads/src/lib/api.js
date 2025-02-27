import axios from 'axios';

// Create an axios instance with the base URL of your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for cookie-based auth
  withCredentials: true,
});

export default api;