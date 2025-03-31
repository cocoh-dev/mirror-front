// app/admin/salons/components/SalonFilters.js
import { useState, useEffect } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const SalonFilters = ({ 
  searchQuery = '', 
  onSearchChange,
  viewMode,
  onViewModeChange,
  onSortChange,
  activeTab = 'all',
  onTabChange
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  // 검색어 입력 시 지연 시간 후 검색 실행 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        onSearchChange(localSearchQuery);
      }
    }, 500); // 500ms 디바운스
    
    return () => clearTimeout(timer);
  }, [localSearchQuery, onSearchChange, searchQuery]);
  
  // 검색어 초기값 업데이트
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="approved">인증됨</TabsTrigger>
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
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
        
        <Select defaultValue="newest" onValueChange={onSortChange}>
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
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-none rounded-r-md"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};