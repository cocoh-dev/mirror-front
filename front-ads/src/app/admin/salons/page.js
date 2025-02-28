'use client';

import { useState } from 'react';
import {
  Building,
  CheckCircle,
  ChevronDown,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit2,
  Star,
  Grid,
  List,
  XCircle,
  Eye
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

// 더미 데이터
const salons = [
  {
    id: '1',
    name: '스타일리시 살롱',
    address: '서울시 강남구 테헤란로 123',
    owner: '김미영',
    ownerEmail: 'miyoung.kim@example.com',
    phone: '02-1234-5678',
    status: 'verified',
    rating: 4.8,
    reviewCount: 125,
    subscriptionType: 'premium',
    registeredDate: '2023-10-15',
    image: '/images/salon1.jpg'
  },
  {
    id: '2',
    name: '뷰티 헤어',
    address: '서울시 서초구 반포대로 45',
    owner: '박준호',
    ownerEmail: 'junho.park@example.com',
    phone: '02-9876-5432',
    status: 'verified',
    rating: 4.5,
    reviewCount: 98,
    subscriptionType: 'standard',
    registeredDate: '2023-11-22',
    image: '/images/salon2.jpg'
  },
  {
    id: '3',
    name: '컬러풀 살롱',
    address: '서울시 용산구 이태원로 56',
    owner: '이지은',
    ownerEmail: 'jieun.lee@example.com',
    phone: '02-4567-8901',
    status: 'pending',
    rating: 0,
    reviewCount: 0,
    subscriptionType: 'free',
    registeredDate: '2024-02-05',
    image: '/images/salon3.jpg'
  },
  {
    id: '4',
    name: '맨즈 그루밍',
    address: '서울시 마포구 홍대입구로 78',
    owner: '최동현',
    ownerEmail: 'donghyun.choi@example.com',
    phone: '02-3456-7890',
    status: 'verified',
    rating: 4.7,
    reviewCount: 85,
    subscriptionType: 'premium',
    registeredDate: '2023-09-10',
    image: '/images/salon4.jpg'
  },
  {
    id: '5',
    name: '내추럴 뷰티',
    address: '서울시 성동구 왕십리로 34',
    owner: '최세라',
    ownerEmail: 'sera.choi@example.com',
    phone: '02-8765-4321',
    status: 'rejected',
    rating: 0,
    reviewCount: 0,
    subscriptionType: 'free',
    registeredDate: '2024-01-30',
    image: '/images/salon5.jpg'
  },
];

// 상태 뱃지 컴포넌트
const StatusBadge = ({ status }) => {
  const variants = {
    verified: { variant: 'default', label: '인증됨', icon: CheckCircle },
    pending: { variant: 'outline', label: '심사중', icon: null },
    rejected: { variant: 'destructive', label: '반려됨', icon: XCircle },
  };
  
  const { variant, label, icon: Icon } = variants[status] || variants.pending;
  
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
};

// 구독 뱃지 컴포넌트
const SubscriptionBadge = ({ type }) => {
  const variants = {
    free: { variant: 'outline', label: '무료' },
    standard: { variant: 'secondary', label: '스탠다드' },
    premium: { variant: 'default', label: '프리미엄' },
  };
  
  const { variant, label } = variants[type] || variants.free;
  
  return <Badge variant={variant}>{label}</Badge>;
};

// 살롱 카드 컴포넌트 (그리드 뷰용)
const SalonCard = ({ salon }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-muted flex items-center justify-center">
        <Building className="h-10 w-10 text-muted-foreground" />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{salon.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {salon.address}
            </CardDescription>
          </div>
          <StatusBadge status={salon.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mt-2">
          <div>대표: {salon.owner}</div>
          <div>연락처: {salon.phone}</div>
          <div className="flex items-center mt-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
            <span>{salon.rating > 0 ? salon.rating : '평가없음'}</span>
            {salon.reviewCount > 0 && (
              <span className="ml-1 text-xs">({salon.reviewCount})</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <SubscriptionBadge type={salon.subscriptionType} />
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

export default function SalonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">미용실 관리</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          미용실 추가
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="verified">인증됨</TabsTrigger>
            <TabsTrigger value="pending">심사중</TabsTrigger>
            <TabsTrigger value="rejected">반려됨</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="미용실 검색..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select defaultValue="newest">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
          
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
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>미용실명</TableHead>
                  <TableHead>주소</TableHead>
                  <TableHead>대표</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>구독</TableHead>
                  <TableHead>평점</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salons.map((salon) => (
                  <TableRow key={salon.id}>
                    <TableCell className="font-medium">{salon.id}</TableCell>
                    <TableCell>{salon.name}</TableCell>
                    <TableCell>{salon.address}</TableCell>
                    <TableCell>{salon.owner}</TableCell>
                    <TableCell>{salon.phone}</TableCell>
                    <TableCell>
                      <StatusBadge status={salon.status} />
                    </TableCell>
                    <TableCell>
                      <SubscriptionBadge type={salon.subscriptionType} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                        <span>{salon.rating > 0 ? salon.rating : '-'}</span>
                        {salon.reviewCount > 0 && (
                          <span className="ml-1 text-xs">({salon.reviewCount})</span>
                        )}
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
      )}
    </div>
  );
}