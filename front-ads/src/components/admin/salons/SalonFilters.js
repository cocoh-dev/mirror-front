import { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const SalonFilters = ({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onSortChange
}) => {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
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
