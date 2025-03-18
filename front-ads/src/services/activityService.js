// /services/activityService.js
import api from '@/lib/api';

/**
 * 활동 검색 API
 * @param {Object} params 검색 파라미터
 * @returns {Promise<Object>} 활동 목록 및 페이지네이션 정보
 */
export const searchActivities = async (params = {}) => {
  try {
    const response = await api.get(`/api/activity`, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('활동 검색 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 특정 사용자의 활동 조회 API
 * @param {number} userId 사용자 ID
 * @param {number} limit 결과 제한 수
 * @returns {Promise<Object>} 사용자 활동 목록
 */
export const getUserActivities = async (userId, limit = 20) => {
  try {
    const response = await api.get(`/api/users/${userId}/activity`, {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('사용자 활동 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 특정 유형의 활동 조회 API
 * @param {string} type 활동 유형
 * @param {number} limit 결과 제한 수
 * @returns {Promise<Object>} 활동 목록
 */
export const getActivitiesByType = async (type, limit = 50) => {
  try {
    const response = await api.get(`/api/activity/type/${type}`, {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('활동 유형별 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 특정 살롱 관련 활동 조회 API
 * @param {number} salonId 살롱 ID
 * @param {number} limit 결과 제한 수
 * @returns {Promise<Object>} 살롱 관련 활동 목록
 */
export const getSalonActivities = async (salonId, limit = 50) => {
  try {
    const response = await api.get(`/api/salons/${salonId}/activity`, {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('살롱 활동 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 활동 통계 조회 API
 * @param {number} period 기간 (일 단위)
 * @returns {Promise<Object>} 활동 통계 정보
 */
export const getActivityStats = async (period = 30) => {
  try {
    const response = await api.get(`/api/activity/stats`, {
      params: { period }
    });
    
    return response.data;
  } catch (error) {
    console.error('활동 통계 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 주간 활동 리포트 조회 API
 * @returns {Promise<Object>} 주간 활동 리포트
 */
export const generateWeeklyReport = async () => {
  try {
    const response = await api.get(`/api/activity/report/weekly`);
    
    return response.data;
  } catch (error) {
    console.error('주간 리포트 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 모든 활동 유형 조회 API
 * @returns {Promise<Object>} 활동 유형 목록
 */
export const getAllActivityTypes = async () => {
  try {
    const response = await api.get('/api/activity/types');
    
    return response.data;
  } catch (error) {
    console.error('활동 유형 조회 오류:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * 활동 CSV 내보내기 API
 * @param {Object} params 검색 파라미터
 * @returns {Promise<Blob>} CSV 파일 Blob
 */
export const exportActivitiesCSV = async (params = {}) => {
  try {
    const response = await api.get(`/api/activity/export`, {
      params,
      responseType: 'blob'
    });
    
    // 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `activities-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  } catch (error) {
    console.error('활동 내보내기 오류:', error);
    throw error.response?.data || error.message;
  }
};