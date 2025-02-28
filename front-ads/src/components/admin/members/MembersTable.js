// /components/admin/members/MembersTable.js
import {
    ChevronDown,
    MoreHorizontal,
    UserPlus,
    UserMinus,
    Mail
  } from 'lucide-react';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
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
  import CustomPagination from '@/components/common/CustomPagination';
  import { StatusBadge, RoleBadge } from '@/components/admin/members/Badges';
  
  export default function MembersTable({
    members,
    pageInfo,
    page,
    itemsPerPage,
    filters,
    onPageChange,
    onSortChange
  }) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle>회원 목록</CardTitle>
          <CardDescription>총 {pageInfo.totalUsers}명의 회원이 등록되어 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSortChange('id')}
                >
                  ID {filters.sortBy === 'id' && <ChevronDown className="inline h-4 w-4" />}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSortChange('name')}
                >
                  이름 {filters.sortBy === 'name' && <ChevronDown className="inline h-4 w-4" />}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSortChange('email')}
                >
                  이메일 {filters.sortBy === 'email' && <ChevronDown className="inline h-4 w-4" />}
                </TableHead>
                <TableHead>상태</TableHead>
                <TableHead>역할</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSortChange('createdAt')}
                >
                  가입일 {filters.sortBy === 'createdAt' && <ChevronDown className="inline h-4 w-4" />}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSortChange('lastLogin')}
                >
                  최근 로그인 {filters.sortBy === 'lastLogin' && <ChevronDown className="inline h-4 w-4" />}
                </TableHead>
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
                    <StatusBadge status={member.status || 'active'} />
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell>{new Date(member.createdAt || member.registeredDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(member.lastLogin).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <MemberActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <CustomPagination 
            currentPage={page}
            totalItems={pageInfo.totalUsers}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>
    );
  }
  
  // 회원 작업 드롭다운 컴포넌트
  function MemberActions() {
    return (
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
    );
  }