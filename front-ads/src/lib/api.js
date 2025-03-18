// lib/api.js 수정
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true // 중요: 쿠키를 포함하도록 설정
});

export default api;