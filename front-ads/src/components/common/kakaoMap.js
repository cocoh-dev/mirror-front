import React, { useEffect, useRef, useState } from 'react';

export const KakaoMap = ({ address }) => {
  const mapContainerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Kakao Maps API가 이미 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      setLoaded(true);
      return;
    }

    // Kakao Maps 스크립트 추가
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setLoaded(true));
    };
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !address || !mapContainerRef.current) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        const map = new window.kakao.maps.Map(mapContainerRef.current, {
          center: coords,
          level: 3
        });

        new window.kakao.maps.Marker({
          position: coords,
          map: map
        });

        map.setCenter(coords);
      } else {
        console.error('주소 검색 실패: ', status);
      }
    });
  }, [loaded, address]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[250px] bg-muted rounded-md"
    >
      {!address && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          주소를 입력하면 지도가 표시됩니다
        </div>
      )}
    </div>
  );
};