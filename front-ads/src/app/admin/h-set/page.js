// /admin/h-set/page.js
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, RefreshCw, Search } from 'lucide-react';

export default function ImageGenerationDashboard() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  
  // 더미 데이터: 이미지 생성 시간 목록
  const imageGenerationTimes = [
    {
      id: 'img001',
      modelId: 'sdxl-turbo/dreamshaper',
      promptHash: '8f7d23a9d9f2a',
      status: 'completed',
      createdAt: '2025-03-11T14:30:00Z',
      completedAt: '2025-03-11T14:30:15Z',
      totalTime: 15000, // milliseconds
      queueTime: 5000,
      generationTime: 10000,
      userId: 'user123',
      imageSize: '512x512',
      batchSize: 4
    },
    {
      id: 'img002',
      modelId: 'realistic-vision/v5',
      promptHash: '3e7a12c4f5b9d',
      status: 'completed',
      createdAt: '2025-03-12T09:45:00Z',
      completedAt: '2025-03-12T09:45:25Z',
      totalTime: 25000,
      queueTime: 8000,
      generationTime: 17000,
      userId: 'user456',
      imageSize: '768x768',
      batchSize: 1
    },
    {
      id: 'img003',
      modelId: 'stable-diffusion/v1-5',
      promptHash: '9c8b7a6d5e4f3',
      status: 'error',
      createdAt: '2025-03-12T10:15:00Z',
      completedAt: null,
      totalTime: 12000,
      queueTime: 2000,
      generationTime: 10000,
      userId: 'user789',
      imageSize: '512x512',
      batchSize: 2,
      errorMessage: 'NSFW content detected'
    },
    {
      id: 'img004',
      modelId: 'midjourney/v5',
      promptHash: '2a3b4c5d6e7f8',
      status: 'completed',
      createdAt: '2025-03-12T11:30:00Z',
      completedAt: '2025-03-12T11:30:42Z',
      totalTime: 42000,
      queueTime: 12000,
      generationTime: 30000,
      userId: 'user001',
      imageSize: '1024x1024',
      batchSize: 1
    },
    {
      id: 'img005',
      modelId: 'sdxl-turbo/dreamshaper',
      promptHash: '1a2b3c4d5e6f7',
      status: 'processing',
      createdAt: '2025-03-13T08:20:00Z',
      completedAt: null,
      totalTime: null,
      queueTime: 2000,
      generationTime: null,
      userId: 'user123',
      imageSize: '512x512',
      batchSize: 4
    },
    {
      id: 'img006',
      modelId: 'deepfloyd/if-xl',
      promptHash: '7g6f5e4d3c2b1',
      status: 'completed',
      createdAt: '2025-03-13T09:10:00Z',
      completedAt: '2025-03-13T09:11:32Z',
      totalTime: 92000,
      queueTime: 15000,
      generationTime: 77000,
      userId: 'user222',
      imageSize: '1024x1024',
      batchSize: 2
    },
    {
      id: 'img007',
      modelId: 'realistic-vision/v5',
      promptHash: '5c3d7a9b1e8f2',
      status: 'completed',
      createdAt: '2025-03-13T13:45:00Z',
      completedAt: '2025-03-13T13:45:18Z',
      totalTime: 18000,
      queueTime: 3000,
      generationTime: 15000,
      userId: 'user333',
      imageSize: '512x768',
      batchSize: 1
    },
    {
      id: 'img008',
      modelId: 'stable-diffusion/v1-5',
      promptHash: '9d8c7b6a5f4e3',
      status: 'completed',
      createdAt: '2025-03-14T10:25:00Z',
      completedAt: '2025-03-14T10:25:35Z',
      totalTime: 35000,
      queueTime: 10000,
      generationTime: 25000,
      userId: 'user444',
      imageSize: '768x768',
      batchSize: 4
    },
    {
      id: 'img009',
      modelId: 'sdxl-turbo/dreamshaper',
      promptHash: '8e7f6d5c4b3a2',
      status: 'completed',
      createdAt: '2025-03-14T11:10:00Z',
      completedAt: '2025-03-14T11:10:11Z',
      totalTime: 11000,
      queueTime: 1000,
      generationTime: 10000,
      userId: 'user555',
      imageSize: '512x512',
      batchSize: 1
    },
    {
      id: 'img010',
      modelId: 'midjourney/v5',
      promptHash: '1f2e3d4c5b6a7',
      status: 'in-queue',
      createdAt: '2025-03-14T12:00:00Z',
      completedAt: null,
      totalTime: null,
      queueTime: 60000, // still in queue
      generationTime: null,
      userId: 'user666',
      imageSize: '1024x1024',
      batchSize: 2
    },
    {
      id: 'img011',
      modelId: 'stable-diffusion/v1-5',
      promptHash: '3c4d5e6f7g8h9',
      status: 'completed',
      createdAt: '2025-03-14T12:15:00Z',
      completedAt: '2025-03-14T12:15:22Z',
      totalTime: 22000,
      queueTime: 7000,
      generationTime: 15000,
      userId: 'user777',
      imageSize: '512x512',
      batchSize: 2
    },
    {
      id: 'img012',
      modelId: 'deepfloyd/if-xl',
      promptHash: '4b5c6d7e8f9g0',
      status: 'error',
      createdAt: '2025-03-14T13:20:00Z',
      completedAt: null,
      totalTime: 5000,
      queueTime: 2000,
      generationTime: 3000,
      userId: 'user888',
      imageSize: '1024x1024',
      batchSize: 1,
      errorMessage: 'Server overloaded'
    },
  ];

  // 필터 함수
  const filterImageTimes = () => {
    let filtered = [...imageGenerationTimes];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.modelId.toLowerCase().includes(query) || 
        item.promptHash.toLowerCase().includes(query) ||
        item.userId.toLowerCase().includes(query)
      );
    }
    
    // 기간 필터링
    const now = new Date();
    if (periodFilter === 'today') {
      const today = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => new Date(item.createdAt) >= today);
    } else if (periodFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(item => new Date(item.createdAt) >= weekAgo);
    } else if (periodFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(item => new Date(item.createdAt) >= monthAgo);
    }
    
    // 정렬
    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'fastest') {
      filtered.sort((a, b) => (a.totalTime || Infinity) - (b.totalTime || Infinity));
    } else if (sort === 'slowest') {
      filtered.sort((a, b) => (b.totalTime || Infinity) - (a.totalTime || Infinity));
    }
    
    return filtered;
  };

  const filteredData = filterImageTimes();
  
  // 상태별로 분리
  const completedItems = filteredData.filter(item => item.status === 'completed');
  const processingItems = filteredData.filter(item => item.status === 'processing');
  const queuedItems = filteredData.filter(item => item.status === 'in-queue');
  const errorItems = filteredData.filter(item => item.status === 'error');
  
  // 시간 포맷 함수
  const formatTime = (ms) => {
    if (!ms && ms !== 0) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // 상태별 스타일
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'in-queue':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 상태 한글화
  const translateStatus = (status) => {
    const translations = {
      'completed': '완료',
      'processing': '처리 중',
      'in-queue': '대기 중',
      'error': '오류'
    };
    return translations[status] || status;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold">이미지 생성 시간 분석</h1>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <p className="text-sm text-gray-500">총 생성 요청</p>
            <p className="text-2xl font-bold">{imageGenerationTimes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <p className="text-sm text-gray-500">평균 생성 시간</p>
            <p className="text-2xl font-bold">
              {formatTime(
                completedItems.reduce((acc, item) => acc + item.generationTime, 0) / 
                (completedItems.length || 1)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <p className="text-sm text-gray-500">평균 대기 시간</p>
            <p className="text-2xl font-bold">
              {formatTime(
                filteredData.reduce((acc, item) => acc + (item.queueTime || 0), 0) / 
                (filteredData.length || 1)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-24">
            <p className="text-sm text-gray-500">오류율</p>
            <p className="text-2xl font-bold">
              {((errorItems.length / imageGenerationTimes.length) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="모델 ID, 해시, 사용자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="모든 기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 기간</SelectItem>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="week">일주일</SelectItem>
              <SelectItem value="month">한 달</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="최신순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="fastest">빠른순</SelectItem>
              <SelectItem value="slowest">느린순</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-1 border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('grid')}
            >
              격자
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              목록
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">전체 ({filteredData.length})</TabsTrigger>
          <TabsTrigger value="completed">완료 ({completedItems.length})</TabsTrigger>
          <TabsTrigger value="processing">처리 중 ({processingItems.length})</TabsTrigger>
          <TabsTrigger value="in-queue">대기 중 ({queuedItems.length})</TabsTrigger>
          <TabsTrigger value="error">오류 ({errorItems.length})</TabsTrigger>
        </TabsList>
        
        {['all', 'completed', 'processing', 'in-queue', 'error'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredData
                  .filter(item => tabValue === 'all' || item.status === tabValue)
                  .map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div className="truncate flex-1">
                            <p className="font-medium text-sm truncate" title={item.modelId}>
                              {item.modelId}
                            </p>
                            <p className="text-xs text-gray-500 truncate" title={item.promptHash}>
                              {item.promptHash}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(item.status)}`}>
                            {translateStatus(item.status)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">총 시간:</span>
                          <span className="font-medium">{formatTime(item.totalTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">대기 시간:</span>
                          <span className="font-medium">{formatTime(item.queueTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">생성 시간:</span>
                          <span className="font-medium">{formatTime(item.generationTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">크기:</span>
                          <span className="font-medium">{item.imageSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">배치:</span>
                          <span className="font-medium">{item.batchSize}</span>
                        </div>
                      </div>
                      <div className="p-4 pt-0 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>{formatDate(item.createdAt)}</span>
                          <span>{item.userId}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-md shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          모델 ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          총 시간
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          대기 시간
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          생성 시간
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이미지 크기
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          생성 일시
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          사용자
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData
                        .filter(item => tabValue === 'all' || item.status === tabValue)
                        .map(item => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div>
                                <p className="font-medium" title={item.modelId}>{item.modelId}</p>
                                <p className="text-gray-500 text-xs" title={item.promptHash}>{item.promptHash}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(item.status)}`}>
                                {translateStatus(item.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatTime(item.totalTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatTime(item.queueTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatTime(item.generationTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {item.imageSize}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatDate(item.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {item.userId}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* 페이지네이션 (선택적) */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          총 {filteredData.length}개의 항목 중 1-{Math.min(10, filteredData.length)}개 표시
        </p>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={true}>
            이전
          </Button>
          <span className="text-sm">
            1 / 1
          </span>
          <Button variant="outline" size="sm" disabled={true}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};
