// /admin/ads/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Grid,
  List,
  Download,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// API 서비스
import { getAds } from '@/services/adService';

// 분리된 컴포넌트 가져오기
import { AdCard, AdTable } from '@/components/admin/ads';

export default function AdsPage() {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [currentTab, setCurrentTab] = useState('all');
  
  // 데이터 상태
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 광고 목록 불러오기
  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await getAds();
      console.log(response);
      setAds(response.ads || []);
      setError(null);
    } catch (error) {
      setError('광고 목록을 불러오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '광고 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchAds();
  }, []);

  // 필터링된 광고 데이터 계산
  const filteredAds = ads.filter(ad => {
    // 탭 필터링
    if (currentTab !== 'all' && ad.status !== currentTab) {
      return false;
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ad.title.toLowerCase().includes(query) ||
        ad.company.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // 검색 핸들러
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // 탭 변경 핸들러
  const handleTabChange = (value) => {
    setCurrentTab(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">광고 관리</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Download className="h-4 w-4" />
            <span>내보내기</span>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            광고 추가
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">진행중</TabsTrigger>
            <TabsTrigger value="pending">대기중</TabsTrigger>
            <TabsTrigger value="paused">일시중지</TabsTrigger>
            <TabsTrigger value="inactive">종료됨</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="광고 검색..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-none rounded-l-md"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" />
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-none rounded-r-md"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 로딩 상태 */}
        {loading ? (
          <Card>
            <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">광고 목록을 불러오는 중...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchAds}
              >
                다시 시도
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TabsContent value={currentTab} className="space-y-4">
            {filteredAds.length > 0 ? (
              viewMode === 'list' ? (
                <AdTable ads={filteredAds} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
              )
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? '검색 결과가 없습니다.' 
                      : currentTab === 'all' 
                        ? '등록된 광고가 없습니다.' 
                        : `${currentTab === 'active' 
                          ? '진행중인' 
                          : currentTab === 'pending' 
                            ? '대기중인' 
                            : currentTab === 'paused' 
                              ? '일시중지된' 
                              : '종료된'} 광고가 없습니다.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}