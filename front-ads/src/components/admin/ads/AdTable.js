// /components/admin/ads/AdTable.jsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent } from '@/components/ui/card';
  import { Progress } from '@/components/ui/progress';
  import { StatusBadge } from './StatusBadge';
  import { 
    CalendarDays, 
    DollarSign, 
    Eye, 
    MoreHorizontal, 
    Edit2, 
    Trash2,
    Pause,
    Play 
  } from 'lucide-react';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  
  export const AdTable = ({ ads, onView }) => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>기간</TableHead>
                <TableHead>예산</TableHead>
                <TableHead>사용량</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => {
                    // 이벤트 버블링 방지 - adsActions의 클릭이 행 클릭으로 전파되지 않도록
                    if (e.target.closest('.ads-actions')) return;
                    onView(ad);
                  }}
                >

                  <TableCell className="font-medium">{ad.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{ad.title}</div>
                    <div className="text-sm text-muted-foreground">{ad.type}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ad.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{ad.startDate} ~ {ad.endDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>₩{ad.budget?.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={(ad.spent / ad.budget) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₩{ad.spent?.toLocaleString()}</span>
                        <span>{Math.round((ad.spent / ad.budget) * 100)}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right ads-actions">
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
    );
  };