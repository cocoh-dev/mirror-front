/**
 * 전화번호 포맷팅 함수
 * 입력된 숫자에 따라 적절한 하이픈 추가
 * @param {string} phoneNumber - 포맷팅할 전화번호
 * @returns {string} 하이픈이 포함된 포맷팅된 전화번호
 */
export const formatPhoneNumber = (phoneNumber) => {
  // 모든 하이픈 제거 및 숫자만 추출
  const cleaned = phoneNumber.replace(/-/g, '').replace(/[^\d]/g, '');
  
  // 숫자 길이에 따라 다른 포맷 적용
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 7) { // 4~7자리
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else if (cleaned.length <= 11) { // 8~11자리
    // 앞 번호가 02인 경우 (서울 지역번호)
    if (cleaned.startsWith('02')) {
      // 02-XXX-XXXX 형식
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    } 
    // 휴대폰 번호 (010, 011 등으로 시작)
    else if (cleaned.startsWith('010') || cleaned.startsWith('011') || 
            cleaned.startsWith('016') || cleaned.startsWith('017') || 
            cleaned.startsWith('018') || cleaned.startsWith('019')) {
      // 010-XXXX-XXXX 형식
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    // 그 외 지역번호 (031, 032 등으로 시작)
    else {
      // 031-XXX-XXXX 형식
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
  } else {
    // 11자리 초과하는 경우 뒷부분 자르기
    if (cleaned.startsWith('02')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}`;
    } else if (cleaned.startsWith('010') || cleaned.startsWith('011') || 
              cleaned.startsWith('016') || cleaned.startsWith('017') || 
              cleaned.startsWith('018') || cleaned.startsWith('019')) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  }
};
  
  /**
   * 사업자등록번호 포맷팅 함수
   * 000-00-00000 형식으로 하이픈 추가
   * @param {string} businessNumber - 포맷팅할 사업자등록번호
   * @returns {string} 하이픈이 포함된 포맷팅된 사업자등록번호
   */
  export const formatBusinessNumber = (businessNumber) => {
    // 모든 하이픈 제거 및 숫자만 추출
    const cleaned = businessNumber.replace(/-/g, '').replace(/[^\d]/g, '');
    
    // 사업자등록번호 형식 (000-00-00000)으로 변환
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 10)}`;
    }
  };
  
  /**
   * 전화번호에서 하이픈 제거
   * @param {string} phoneNumber - 하이픈이 포함된 전화번호
   * @returns {string} 하이픈이 제거된 숫자만 있는 전화번호
   */
  export const cleanPhoneNumber = (phoneNumber) => {
    return phoneNumber ? phoneNumber.replace(/-/g, '') : '';
  };
  
  /**
   * 사업자등록번호에서 하이픈 제거
   * @param {string} businessNumber - 하이픈이 포함된 사업자등록번호
   * @returns {string} 하이픈이 제거된 숫자만 있는 사업자등록번호
   */
  export const cleanBusinessNumber = (businessNumber) => {
    return businessNumber ? businessNumber.replace(/-/g, '') : '';
  };