// services/salonService.js
import api from '@/lib/api';

// 미용실 목록 조회
export const getSalons = async () => {
  try {
    const response = await api.get('/api/admin/salons');
    return response.data;
  } catch (error) {
    console.error('미용실 목록 조회 실패:', error);
    throw error;
  }
};