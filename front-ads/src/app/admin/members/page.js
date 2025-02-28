'use client';

import { useState } from 'react';
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  UserPlus,
  UserMinus,
  Mail
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// 더미 데이터
const members = [
  {
    id: '1',
    name: '김민준',
    email: 'minjun.kim@example.com',
    status: 'active',
    role: 'member',
    registeredDate: '2023-12-15',
    lastLoginDate: '2024-02-20',
  },
  {
    id: '2',
    name: '이서연',
    email: 'seoyeon.lee@example.com',
    status: 'active',
    role: 'salonOwner',
    registeredDate: '2023-11-22',
    lastLoginDate: '2024-02-25',
  },
  {
    id: '3',
    name: '박지훈',
    email: 'jihun.park@example.com',
    status: 'inactive',
    role: 'member',
    registeredDate: '2024-01-05',
    lastLoginDate: '2024-01-10',
  },
  {
    id: '4',
    name: '최수아',
    email: 'sua.choi@example.com',
    status: 'active',
    role: 'salonOwner',
    registeredDate: '2023-10-30',
    lastLoginDate: '2024-02-27',
  },
  {
    id: '5',
    name: '정도윤',
    email: 'doyun.jung@example.com',
    status: 'suspended',
    role: 'member',
    registeredDate: '2024-01-20',
    lastLoginDate: '2024-01-25',
  },
];

// 상태 뱃지 컴포넌트
const StatusBadge = ({ status }) => {
  const variants = {
    active: { variant: 'default', label: '활성' },
    inactive: { variant: 'outline', label: '비활성' },
    suspended: { variant: 'destructive', label: '정지됨' },
  };
  
  const { variant, label } = variants[status] || variants.inactive;
  
  return <Badge variant={variant}>{label}</Badge>;
};

// 역할 뱃지 컴포넌트
const RoleBadge = ({ role }) => {
  const variants = {
    member: { variant: 'secondary', label: '일반회원' },
    salonOwner: { variant: 'secondary', label: '미용실주' },
    admin: { variant: 'default', label: '관리자' },
    superadmin: { variant: 'default', label: '슈퍼관리자' },
  };
  
  const { variant, label } = variants[role] || variants.member;
  
  return <Badge variant={variant}>{label}</Badge>;
};

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          회원 추가
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="이름 또는 이메일로 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>필터</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>회원 상태</DropdownMenuLabel>
            <DropdownMenuItem>활성 회원</DropdownMenuItem>
            <DropdownMenuItem>비활성 회원</DropdownMenuItem>
            <DropdownMenuItem>정지된 회원</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>회원 유형</DropdownMenuLabel>
            <DropdownMenuItem>일반 회원</DropdownMenuItem>
            <DropdownMenuItem>미용실 주인</DropdownMenuItem>
            <DropdownMenuItem>관리자</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" className="gap-1">
          <Download className="h-4 w-4" />
          <span>내보내기</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle>회원 목록</CardTitle>
          <CardDescription>총 {members.length}명의 회원이 등록되어 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>최근 로그인</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell>{member.registeredDate}</TableCell>
                  <TableCell>{member.lastLoginDate}</TableCell>
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
                          <UserPlus className="h-4 w-4" />
                          <span>승인</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <UserMinus className="h-4 w-4" />
                          <span>비활성화</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>이메일 발송</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          삭제
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
    </div>
  );
}