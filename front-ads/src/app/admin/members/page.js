// /admin/members/page.js
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/services/memberService';
import MembersHeader from '@/components/admin/members/MembersHeader';
import MembersSearchAndFilter from '@/components/admin/members/MembersSearchAndFilter';
import MembersTable from '@/components/admin/members/MembersTable';
import { TableSkeleton } from '@/components/admin/members/TableSkeleton';

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const LOADING_DELAY = 300; // 300ms 이상 로딩 시 스켈레톤 표시

  // 필터 상태
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    provider: '',
    startDate: '',
    endDate: '',
    sortBy: 'id',
    sortDir: 'DESC'
  });

  // 데이터 가져오기
  const fetchMembers = async () => {
    const params = {
      page,
      limit: ITEMS_PER_PAGE,
      ...filters
    };
    return await getMembers(params);
  };

  // React Query로 데이터 관리
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['members', page, filters],
    queryFn: fetchMembers,
    keepPreviousData: true
  });

  // 로딩 상태에 따라 스켈레톤 표시 여부 결정
  useEffect(() => {
    let loadingTimer;
    
    if (isLoading) {
      loadingTimer = setTimeout(() => {
        setShowSkeleton(true);
      }, LOADING_DELAY);
    } else {
      setShowSkeleton(false);
    }
    
    return () => {
      clearTimeout(loadingTimer);
    };
  }, [isLoading]);

  // 검색어 입력 핸들러
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 실행 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchTerm);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1); // 필터 변경시 첫 페이지로 이동
  };

  // 정렬 변경 핸들러
  const handleSortChange = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'DESC' ? 'ASC' : 'DESC'
    }));
    setPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // isLoading이 true이지만 showSkeleton이 false인 경우 (로딩 시간이 짧은 경우) 아무것도 표시하지 않음
  if (isLoading && !showSkeleton) {
    return (
      <div className="space-y-6">
        <MembersHeader />
        <MembersSearchAndFilter 
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        {/* 이전 데이터를 유지하거나, 빈 상태 표시 */}
        {data ? (
          <MembersTable
            members={data.users || []}
            pageInfo={data.pageInfo || { totalUsers: 0 }}
            page={page}
            itemsPerPage={ITEMS_PER_PAGE}
            filters={filters}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
          />
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-muted-foreground">데이터를 불러오는 중입니다...</p>
          </div>
        )}
      </div>
    );
  }

  if (isLoading && showSkeleton) return <TableSkeleton />;
  if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const members = data?.users || [];
  const pageInfo = data?.pageInfo || { totalUsers: 0 };
  
  return (
    <div className="space-y-6">
      <MembersHeader />
      
      <MembersSearchAndFilter 
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <MembersTable
        members={members}
        pageInfo={pageInfo}
        page={page}
        itemsPerPage={ITEMS_PER_PAGE}
        filters={filters}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  );
}