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

export const searchSalons = async (options) => {
  const { 
    city, 
    district, 
    keyword, 
    page = 1, 
    limit = 10, 
    sortBy = 'created_at', 
    sortOrder = 'DESC',
    status
  } = options;

  try {
    const params = new URLSearchParams();
    
    // 옵션들을 쿼리 파라미터로 추가
    if (city) params.append('city', city);
    if (district) params.append('district', district);
    if (keyword) params.append('keyword', keyword);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (status) params.append('status', status);

    const response = await api.get(`/api/salons/search?${params.toString()}`);
    
    return response.data;
  } catch (error) {
    console.error('미용실 검색 실패:', error);
    throw error;
  }
};

export const getSalonById = async (id) => {
  try {
    const response = await api.get(`/api/salons/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`미용실 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

export const getSalonByIdAdmin = async (id) => {
  try {
    const response = await api.get(`/api/admin/salon/${id}`);
    return response.data;
  } catch (error) {
    console.error(`미용실 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

export const createSalon = async (salonData) => {
  try {
    const response = await api.post('/api/salons', salonData);
    return response.data;
  } catch (error) {
    console.error('미용실 추가 실패:', error);
    throw error;
  }
};

export const updateSalon = async (id, salonData) => {
  try {
    const response = await api.put(`/api/salons/${id}`, salonData);
    return response.data;
  } catch (error) {
    console.error(`미용실 ID ${id} 수정 실패:`, error);
    throw error;
  }
};

export const deleteSalon = async (id) => {
  try {
    const response = await api.delete(`/api/salons/${id}`);
    return response.data;
  } catch (error) {
    console.error(`미용실 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

export const updateSalonStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/salons/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`미용실 ID ${id} 상태 변경 실패:`, error);
    throw error;
  }
};