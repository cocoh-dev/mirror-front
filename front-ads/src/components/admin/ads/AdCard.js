// /components/admin/ads/AdCard.jsx
import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from './StatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CalendarDays, 
  MoreHorizontal, 
  DollarSign, 
  Eye, 
  Edit2,
  Trash2,
  Pause,
  Play,
} from 'lucide-react';

export const AdCard = ({ ad, onView }) => {
  // 이미지/비디오 오류 상태 관리
  const [mediaError, setMediaError] = useState(false);
  
  // 미디어 렌더링 함수
  const renderMedia = () => {
    // 미디어가 없는 경우
    if (!ad.media || ad.media.length === 0) {
      return (
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
          <ImageIcon className="mr-2 h-5 w-5" />
          <span>이미지 없음</span>
        </div>
      );
    }
    
    // 미디어 오류가 발생한 경우
    if (mediaError) {
      return (
        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
          <ImageIcon className="mr-2 h-5 w-5" />
          <span>미디어 로드 실패</span>
        </div>
      );
    }
    
    const media = ad.media[0]; // 첫 번째 미디어
    const url = media.url;
    
    // 파일 확장자 또는 타입으로 비디오 확인
    const isVideo = url && (
      url.endsWith('.mp4') || 
      url.endsWith('.webm') || 
      url.endsWith('.mov') || 
      (media.type && media.type.includes('video'))
    );
    
    if (isVideo) {
      return (
        <video 
          src={url} 
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
      return (
        
        // <Image
        //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(url)}`}
        //   alt={ad.title}
        //   width={1200} // 적절한 크기로 조정하세요
        //   height={675} // 16:9 비율 유지(aspect-video)
        //   className="w-full aspect-video object-cover"
        //   onError={() => setMediaError(true)}
        // />

        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(url)}`}
          alt={ad.title}
          className="w-full h-50 object-cover"
          onError={(e) => {
            console.error('이미지 로딩 실패:', media.url);
            console.log(e);
            // e.target.src = '/fallback-image.png'; // 대체 이미지 설정
          }}
        />
      );
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]"
      onClick={(e) => {
        // 이벤트 버블링 방지 - SalonActions의 클릭이 Card 클릭으로 전파되지 않도록
        if (e.target.closest('.salon-actions')) return;
        onView(ad);
      }}
      >
      <div className="overflow-hidden">
        {renderMedia()}
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ad.title}</CardTitle>
          </div>
          <StatusBadge status={ad.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <CalendarDays className="mr-1 h-3 w-3" />
          <span className="text-xs">{ad.startDate} ~ {ad.endDate}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <span>{ad.budget?.toLocaleString()}₩</span>
        </div>
        
        <div className="space-y-1 mt-2">
          <span className='text-sm text-muted-foreground'>노출 범위 : {ad.targetedSalonCount}</span>
        </div>
        
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <DropdownMenu className="ads-actions">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>작업</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>상세보기</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              <span>수정</span>
            </DropdownMenuItem>
            {ad.status === 'active' ? (
              <DropdownMenuItem className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                <span>일시중지</span>
              </DropdownMenuItem>
            ) : ad.status === 'paused' ? (
              <DropdownMenuItem className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>재개</span>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>삭제</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};