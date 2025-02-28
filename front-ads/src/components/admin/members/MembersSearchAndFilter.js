// /components/admin/members/MembersSearchAndFilter.js
import { Search, Filter, Download } from 'lucide-react';
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

export default function MembersSearchAndFilter({ 
  searchTerm, 
  onSearchInput, 
  onSearch, 
  onFilterChange 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <form onSubmit={onSearch} className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="이름 또는 이메일로 검색..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchInput}
        />
      </form>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>필터</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>회원 상태</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onFilterChange('status', 'active')}>활성 회원</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('status', 'inactive')}>비활성 회원</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('status', 'suspended')}>정지된 회원</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>회원 유형</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onFilterChange('role', 'user')}>일반 회원</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('role', 'admin')}>관리자</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('role', 'superadmin')}>슈퍼관리자</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button variant="outline" className="gap-1">
        <Download className="h-4 w-4" />
        <span>내보내기</span>
      </Button>
    </div>
  );
}