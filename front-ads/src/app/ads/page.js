// /app/ads/page.js
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// API 서비스
import { publicAds } from '@/services/adService';

// 공개용 광고 컴포넌트 import (카드만 사용)
import { PublicAdCard } from '@/components/public/ads/PublicAdCard';

export default function PublicAdsPage() {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // 검색 쿼리 구성하기
  const searchParams = {
    page: currentPage,
    limit: itemsPerPage,
    title: searchQuery || undefined,
    status: 'active', // 항상 active 상태의 광고만 표시
    sortBy: sortBy,
    sortOrder: sortOrder
  };

  // API에서 데이터 가져오기
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['ads', searchParams],
    queryFn: () => publicAds(searchParams),
    keepPreviousData: true
  });

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (value) => {
    const sortOptions = {
      'newest': { sortBy: 'createdAt', sortOrder: 'DESC' },
      'oldest': { sortBy: 'createdAt', sortOrder: 'ASC' },
      'title': { sortBy: 'title', sortOrder: 'ASC' }
    };
    
    const option = sortOptions[value] || sortOptions.newest;
    setSortBy(option.sortBy);
    setSortOrder(option.sortOrder);
    setCurrentPage(1);
  };

  // 데이터 추출
  const ads = data?.ads || [];
  const pagination = data?.pagination || { totalItems: 0, totalPages: 1 };
  
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">추천 광고</h1>
            <p className="text-muted-foreground mt-1">현재 진행 중인 인기 광고를 확인해 보세요</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="광고 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Select defaultValue="newest" onValueChange={handleSortChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="title">제목순</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* 로딩 상태 */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">광고 목록을 불러오는 중...</p>
              </div>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive">{error?.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => refetch()}
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {ads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ads.map((ad) => (
                  <PublicAdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? '검색 결과가 없습니다.' 
                      : '현재 진행 중인 광고가 없습니다.'}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* 페이지네이션 */}
            {ads.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  총 {pagination.totalItems}개의 광고 중 {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, pagination.totalItems)}개 표시
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    이전
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage >= pagination.totalPages || isLoading}
                  >
                    다음
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}