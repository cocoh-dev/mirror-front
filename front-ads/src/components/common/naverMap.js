'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import api from '@/lib/api';

export const NaverMap = ({ address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const searchAddressFromServer = async (searchAddress) => {
    try {
      const response = await api.get(`/api/geocode?address=${encodeURIComponent(searchAddress)}`);
      
      if (response.data.status === 'OK' && response.data.addresses?.length > 0) {
        return response.data.addresses[0];
      }
      return null;
    } catch (error) {
      console.error('주소 검색 실패:', error);
      return null;
    }
  };

  const initializeMap = async () => {
    if (!address || !mapRef.current || !window.naver) return;

    try {
      const geocodeResult = await searchAddressFromServer(address);
      if (geocodeResult) {
        const { x, y } = geocodeResult; // 경도(x), 위도(y)
        const latLng = new window.naver.maps.LatLng(y, x);
        // 지도가 없으면 새로 생성
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, {
            center: latLng,
            zoom: 17, // 더 가깝게 보이도록 zoom 레벨 조정
          });

          // 마커 생성
          new window.naver.maps.Marker({
            position: latLng,
            map: mapInstanceRef.current
          });
        } else {
          // 지도가 이미 있으면 중심점만 이동
          mapInstanceRef.current.setCenter(latLng);
          mapInstanceRef.current.setZoom(17);
        }
      }
    } catch (error) {
      console.error('지도 초기화 오류:', error);
    }
  };

  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap();
    }
  }, [address]);

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={() => {
          console.log('네이버 지도 API 로드 완료');
          initializeMap();
        }}
        onError={(e) => {
          console.error('네이버 지도 API 로드 실패:', e);
        }}
      />
      <div 
        ref={mapRef} 
        className="w-full h-[250px] bg-gray-200 rounded-md"
      >
        {!address && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            주소를 입력하면 지도가 표시됩니다
          </div>
        )}
      </div>
    </>
  );
};