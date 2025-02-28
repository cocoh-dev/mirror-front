// services/memberService.js
import api from '@/lib/api';

// 전체 회원 조회 (페이지네이션 포함)
export const getMembers = async (params = {}) => {
  try {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('회원 목록 조회 실패:', error);
    throw error;
  }
};