// services/adService.js
import api from "@/lib/api";

// 광고 목록 조회
export const getAds = async (params = {}) => {
  try {
    const response = await api.get("/api/ads", { params });
    return response.data;
  } catch (error) {
    console.error("광고 목록 조회 실패:", error);
    throw error;
  }
};

// 광고 검색 (새로 추가)
export const searchAds = async (params = {}) => {
  try {
    const response = await api.get("/api/ads/search", { params });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("광고 검색 실패:", error);
    throw error;
  }
};
// 광고 검색 (새로 추가)
export const publicAds = async (params = {}) => {
  try {
    const response = await api.get("/api/public/ads", { params });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("광고 검색 실패:", error);
    throw error;
  }
};

// 광고 상세 조회
export const getAdById = async (id) => {
  try {
    const response = await api.get(`/api/ads/${id}`);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("광고 상세 조회 실패:", error);
    throw error;
  }
};

// 광고 생성
export const createAd = async (adData) => {
  try {
    const response = await api.post("/api/ads", adData);
    return response.data;
  } catch (error) {
    console.error("광고 생성 실패:", error);
    throw error;
  }
};

export const updateAdMedia = async (id, mediaData) => {
  try {
    const response = await api.post(`/api/ads/${id}/media`, mediaData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("광고 미디어 업로드 실패:", error);
    throw error;
  }
};

// 광고 수정
export const updateAd = async (id, adData) => {
  try {
    const response = await api.put(`/api/ads/${id}`, adData);
    return response.data;
  } catch (error) {
    console.error("광고 수정 실패:", error);
    throw error;
  }
};

// 광고 삭제
export const deleteAd = async (id) => {
  try {
    const response = await api.delete(`/api/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error("광고 삭제 실패:", error);
    throw error;
  }
};

// 전체 광고 목록 조회 (페이지네이션 포함)
export const getAdsList = async (params = {}) => {
  try {
    const response = await api.get("/api/ads/list", { params });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("전체 광고 목록 조회 실패:", error);
    throw error;
  }
};

// 디스플레이용 광고 조회
export const getDisplayAds = async () => {
  try {
    const response = await api.get("/api/display/ads");
    return response.data;
  } catch (error) {
    console.error("디스플레이용 광고 조회 실패:", error);
    throw error;
  }
};

// 광고 스케줄 설정
export const scheduleAd = async (scheduleData) => {
  try {
    const response = await api.post("/api/ads/schedule", scheduleData);
    return response.data;
  } catch (error) {
    console.error("광고 스케줄 설정 실패:", error);
    throw error;
  }
};

// 광고 활성화/비활성화 토글
export const toggleAdStatus = async (id, isActive) => {
  try {
    const response = await api.put(`/api/ads/${id}`, { is_active: isActive });
    return response.data;
  } catch (error) {
    console.error("광고 상태 변경 실패:", error);
    throw error;
  }
};

// 태블릿 광고 목록 조회
export const getTabletAds = async () => {
  try {
    const response = await api.get("/api/ads/tablet");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("테블릿 광고 조회 실패:", error);
    throw error;
  }
};

// 태블릿 광고 등록
export const createTabletAd = async (adData) => {
  try {
    const headers = {};

    if (!(adData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await api.post("/api/ads/tablet/size", adData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("태블릿 광고 등록 실패:", error);
    throw error;
  }
};

// 태블릿 활성 태블릿 광고 조회(디스플레이용)
export const getActiveTabletAds = async () => {
  try {
    const response = await api.get("/api/display/tablet-ads");
    return response.data;
  } catch (error) {
    console.error("태블릿 활성 태블릿 광고 조회 실패:", error);
    throw error;
  }
};

// 테블릿 광고 수정
export const updateTabletAd = async (id, adData) => {
  try {
    const response = await api.patch(`/api/ads/tablet/${id}`, adData);
    return response.data;
  } catch (error) {
    console.error("태블릿 광고 수정 실패:", error);
    throw error;
  }
};

// 태블릿 광고 상세 조회
export const getTabletAdById = async (id) => {
  try {
    const response = await api.get(`/api/ads/tablet/${id}`);
    return response.data;
  } catch (error) {
    console.error("태블릿 광고 상세 조회 실패:", error);
    throw error;
  }
};

// 태블릿 광고 삭제
export const deleteTabletAd = async (id) => {
  try {
    const response = await api.delete(`/api/ads/tablet/${id}`);
    return response.data;
  } catch (error) {
    console.error("태블릿 광고 삭제 실패:", error);
    throw error;
  }
};
