// /admin/salons/page.js
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

import { SalonActions } from '@/components/admin/salons/SubscriptionBadge';
import { SalonCard } from '@/components/admin/salons/SalonCard';
import { SalonFilters } from '@/components/admin/salons/SalonFilters';
import { SalonGrid } from '@/components/admin/salons/SalonGrid';
import { SalonPageHeader } from '@/components/admin/salons/SalonPageHeader';
import { SalonRating } from '@/components/admin/salons/SalonRating';
import { SalonTable } from '@/components/admin/salons/SalonTable';
import { StatusBadge } from '@/components/admin/members/Badges';
import { SubscriptionBadge } from '@/components/admin/salons/SubscriptionBadge';

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

export default function SalonsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('newest');
  
  // 이벤트 핸들러
  const handleAddSalon = () => {
    console.log('미용실 추가 버튼 클릭');
    // 여기에 모달 열기 또는 페이지 이동 로직 추가
  };
  
  const handleViewSalon = (salon) => {
    console.log('상세보기', salon);
    // 상세 보기 로직
  };
  
  const handleEditSalon = (salon) => {
    console.log('수정하기', salon);
    // 수정 로직
  };
  
  const handleDeleteSalon = (salon) => {
    console.log('삭제하기', salon);
    // 삭제 로직
  };
  
  const handleSortChange = (value) => {
    setSortOption(value);
    // 정렬 로직
  };
  
  // 필터링된 미용실 목록
  const filteredSalons = salons.filter(salon => 
    salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    salon.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <SalonPageHeader onAddSalon={handleAddSalon} />
      
      <SalonFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSortChange={handleSortChange}
      />
      
      {viewMode === 'grid' ? (
        <SalonGrid 
          salons={filteredSalons}
          onView={handleViewSalon}
          onEdit={handleEditSalon}
          onDelete={handleDeleteSalon}
        />
      ) : (
        <SalonTable 
          salons={filteredSalons}
          onView={handleViewSalon}
          onEdit={handleEditSalon}
          onDelete={handleDeleteSalon}
        />
      )}
    </div>
  );
}