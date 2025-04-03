// /components/public/ads/PublicAdCard.js
import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';

export const PublicAdCard = ({ ad }) => {
  // 이미지/비디오 오류 상태 관리
  const [mediaError, setMediaError] = useState(false);
  
  // 미디어 렌더링 함수
  const renderMedia = () => {
    // 썸네일이 없는 경우
    if (!ad.thumbnail) {
      return (
        <div className="w-full aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-gray-500">
          <span className="text-lg font-medium text-blue-600">{ad.title || '제목 없음'}</span>
        </div>
      );
    }
    
    // 미디어 오류가 발생한 경우
    if (mediaError) {
      return (
        <div className="w-full aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-gray-500">
          <span className="text-lg font-medium text-blue-600">{ad.title || '제목 없음'}</span>
        </div>
      );
    }
    
    // 미디어 타입에 따른 처리
    const isVideo = ad.media_type === 'video';
    
    if (isVideo) {
      return (
        <video 
          src={ad.thumbnail} 
          className="w-full aspect-video object-cover"
          muted
          loop
          autoPlay
          playsInline
          controls={false}
          onError={() => setMediaError(true)}
        />
      );
    } else {
      // 이미지 URL 프록시 처리
      const imageUrl = process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(ad.thumbnail)}`
        : ad.thumbnail;
        
      return (
        <img
          src={imageUrl}
          alt={ad.title || '광고 이미지'}
          className="w-full aspect-video object-cover"
          onError={() => setMediaError(true)}
        />
      );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-hidden">
        {renderMedia()}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-2">{ad.title || '제목 없음'}</CardTitle>
      </CardHeader>
    </Card>
  );
};