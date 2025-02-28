// /admin/salons/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SalonFilters } from '@/components/admin/salons/SalonFilters';
import { SalonGrid } from '@/components/admin/salons/SalonGrid';
import { SalonPageHeader } from '@/components/admin/salons/SalonPageHeader';
import { SalonTable } from '@/components/admin/salons/SalonTable';
import { TableSkeleton, GridSkeleton } from '@/components/admin/salons/SkeletonLoaders';

import { searchSalons, deleteSalon, updateSalonStatus } from '@/services/salonService';

export default function SalonsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // 상태 관리
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  // API에서 데이터 가져오기
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['salons', currentPage, itemsPerPage, searchParams],
    queryFn: () => searchSalons({
      page: currentPage,
      limit: itemsPerPage,
      keyword: searchParams.keyword,
      status: searchParams.status !== 'all' ? searchParams.status : undefined,
      sortBy: searchParams.sortBy,
      sortOrder: searchParams.sortOrder
    }),
    keepPreviousData: true
  });

  // 미용실 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSalon(id),
    onSuccess: () => {
      toast.success('미용실이 삭제되었습니다.');
      queryClient.invalidateQueries(['salons']);
    },
    onError: (error) => {
      toast.error('미용실 삭제 중 오류가 발생했습니다.');
      console.error('미용실 삭제 실패:', error);
    }
  });

  // 미용실 상태 변경 mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateSalonStatus(id, status),
    onSuccess: () => {
      toast.success('미용실 상태가 변경되었습니다.');
      queryClient.invalidateQueries(['salons']);
    },
    onError: (error) => {
      toast.error('상태 변경 중 오류가 발생했습니다.');
      console.error('미용실 상태 변경 실패:', error);
    }
  });

  // 이벤트 핸들러
  const handleAddSalon = () => {
    router.push('/admin/salons/add');
  };

  const handleViewSalon = (salon) => {
    router.push(`/admin/salons/${salon.id}`);
  };

  const handleEditSalon = (salon) => {
    router.push(`/admin/salons/${salon.id}/edit`);
  };

  const handleDeleteSalon = (salon) => {
    if (window.confirm(`정말로 "${salon.name}" 미용실을 삭제하시겠습니까?`)) {
      deleteMutation.mutate(salon.id);
    }
  };

  const handleStatusChange = (salon, newStatus) => {
    statusMutation.mutate({ id: salon.id, status: newStatus });
  };

  const handleSearchChange = (value) => {
    setSearchParams(prev => ({ ...prev, keyword: value }));
    setCurrentPage(1); // 검색어 변경 시 첫 페이지로 이동
  };

  const handleStatusFilterChange = (status) => {
    setSearchParams(prev => ({ ...prev, status }));
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption) => {
    // 정렬 옵션에 따른 sortBy 및 sortOrder 설정
    const sortMappings = {
      'newest': { sortBy: 'created_at', sortOrder: 'DESC' },
      'oldest': { sortBy: 'created_at', sortOrder: 'ASC' },
      'name': { sortBy: 'name', sortOrder: 'ASC' },
      'rating': { sortBy: 'rating', sortOrder: 'DESC' }
    };

    const { sortBy, sortOrder } = sortMappings[sortOption] || sortMappings.newest;
    setSearchParams(prev => ({ ...prev, sortBy, sortOrder }));
  };

  // 에러 처리
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-destructive text-lg">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => queryClient.invalidateQueries(['salons'])}>
          다시 시도
        </Button>
      </div>
    );
  }

  // 데이터 추출
  const salons = data?.data || [];
  console.log(salons);
  const pagination = data?.pagination || { totalItems: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      <SalonPageHeader onAddSalon={handleAddSalon} />
      
      <SalonFilters 
        searchQuery={searchParams.keyword}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSortChange={handleSortChange}
        activeTab={searchParams.status}
        onTabChange={handleStatusFilterChange}
      />
      
      {isLoading ? (
        viewMode === 'grid' ? <GridSkeleton /> : <TableSkeleton />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <SalonGrid 
              salons={salons}
              onView={handleViewSalon}
              onEdit={handleEditSalon}
              onDelete={handleDeleteSalon}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <SalonTable 
              salons={salons}
              onView={handleViewSalon}
              onEdit={handleEditSalon}
              onDelete={handleDeleteSalon}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* 페이지네이션 컴포넌트 */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총 {pagination.totalItems}개의 미용실 중 {(currentPage - 1) * itemsPerPage + 1}-
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
        </>
      )}
      
      {/* 로딩 인디케이터 */}
      {(deleteMutation.isLoading || statusMutation.isLoading) && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>작업 처리 중...</span>
        </div>
      )}
    </div>
  );
}