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

// src/services/salonService.js에 추가할 함수들

/**
 * 미용실에 디스플레이 추가
 * @param {string} salonId - 미용실 ID
 * @param {Object} displayData - 디스플레이 데이터
 * @returns {Promise<Object>} - 추가된 디스플레이 정보
 */
export const addDisplay = async (displayData) => {
  try {
    const response = await api.post('/api/displays', displayData);
    // axios는 이미 JSON을 파싱하므로 response.data를 바로 반환
    return response.data;
  } catch (error) {
    // axios 에러 처리
    const errorMessage = error.response?.data?.message || '디스플레이 추가 중 오류가 발생했습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 미용실의 디스플레이 정보 수정
 * @param {string} salonId - 미용실 ID
 * @param {string} displayId - 디스플레이 ID
 * @param {Object} displayData - 수정할 디스플레이 데이터
 * @returns {Promise<Object>} - 수정된 디스플레이 정보
 */
export const updateDisplay = async (salonId, displayId, displayData) => {
  try {
    // 이 함수는 나중에 백엔드 API가 구현된 후 수정이 필요합니다.
    // 현재는 백엔드 엔드포인트가 없으므로 임시로 처리합니다.
    console.warn('updateDisplay API 엔드포인트가 아직 구현되지 않았습니다.');
    
    // 실제 구현 시 아래와 같은 형태가 될 수 있습니다.
    /*
    const response = await fetch(`/api/displays/${displayId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...displayData,
        salon_id: salonId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '디스플레이 수정 중 오류가 발생했습니다.');
    }

    return await response.json();
    */
    
    // 임시 구현: 성공했다고 가정하고 데이터 반환
    return { ...displayData, device_id: displayId };
  } catch (error) {
    throw error;
  }
};

/**
 * 미용실의 디스플레이 삭제
 * @param {string} salonId - 미용실 ID
 * @param {string} displayId - 디스플레이 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const deleteDisplay = async (displayId) => {
  try {
    console.log(displayId);
    const response = await api.delete(`/api/displays/${displayId}`);

    if (!response.ok) {
      const error = await response.data;
      throw new Error(error.message || '디스플레이 삭제 중 오류가 발생했습니다.');
    }

    return await response.data;
  } catch (error) {
    throw error;
  }
};