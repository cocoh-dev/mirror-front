// /admin/ads/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit2,
  Pause,
  Play
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";

import { getAds ,getAdsList, deleteAd, scheduleAd } from '@/services/adService';

// 상태 뱃지 컴포넌트
const StatusBadge = ({ status }) => {
  const variants = {
    active: { variant: 'default', label: '진행중' },
    inactive: { variant: 'secondary', label: '종료됨' },
    pending: { variant: 'outline', label: '대기중' },
    paused: { variant: 'warning', label: '일시중지' },
  };
  
  const { variant, label } = variants[status] || variants.inactive;
  
  return <Badge variant={variant}>{label}</Badge>;
};

export default function AdsPage() {
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
  
  // 광고 삭제 처리
  const handleDeleteAd = async (id) => {
    if (window.confirm('정말 이 광고를 삭제하시겠습니까?')) {
      try {
        await deleteAd(id);
        toast({
          title: '성공',
          description: '광고가 삭제되었습니다.',
        });
        fetchAds(); // 목록 다시 불러오기
      } catch (error) {
        toast({
          title: '오류',
          description: '광고 삭제 중 문제가 발생했습니다.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // 광고 일시중지/재개 처리
  const handleToggleAdStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await updateAd(id, { status: newStatus });
      toast({
        title: '성공',
        description: `광고가 ${newStatus === 'active' ? '활성화' : '일시중지'} 되었습니다.`,
      });
      fetchAds(); // 목록 다시 불러오기
    } catch (error) {
      toast({
        title: '오류',
        description: '상태 변경 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  // 컴포넌트 마운트시 광고 목록 불러오기
  useEffect(() => {
    fetchAds();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">광고 관리</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          광고 추가
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="active">진행중</TabsTrigger>
            <TabsTrigger value="pending">대기중</TabsTrigger>
            <TabsTrigger value="paused">일시중지</TabsTrigger>
            <TabsTrigger value="inactive">종료됨</TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="광고 검색..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead>업체</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>예산</TableHead>
                    <TableHead>사용량</TableHead>
                    <TableHead>클릭수</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-muted-foreground">{ad.type}</div>
                      </TableCell>
                      <TableCell>{ad.company}</TableCell>
                      <TableCell>
                        <StatusBadge status={ad.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                          {/* <span className="text-xs">{ad.startDate} ~ {ad.endDate}</span> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                          {/* <span>₩{ad.budget.toLocaleString()}</span> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* <div className="space-y-1">
                          <Progress value={(ad.spent / ad.budget) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>₩{ad.spent.toLocaleString()}</span>
                            <span>{Math.round((ad.spent / ad.budget) * 100)}%</span>
                          </div>
                        </div> */}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-3 w-3 text-muted-foreground" />
                          {/* <span>{ad.clicks.toLocaleString()} / {ad.impressions.toLocaleString()}</span> */}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 다른 탭 내용은 비슷하므로 생략 */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">진행중인 광고만 표시합니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}