// /components/admin/ads/AdTable.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import {
  CalendarDays,
  DollarSign,
  Eye,
  MoreHorizontal,
  Edit2,
  Trash2,
  Pause,
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";

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
              <TableHead>노출 범위</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad, index) => (
              <TableRow
                key={ad.id || `${ad.title}-${index}`}
                className="cursor-pointer hover:bg-muted/50"
                onClick={(e) => {
                  // 이벤트 버블링 방지 - adsActions의 클릭이 행 클릭으로 전파되지 않도록
                  if (e.target.closest(".ads-actions")) return;
                  onView(ad);
                }}
              >
                <TableCell className="font-medium">
                  {ad.id || index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{ad.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {ad.type || "태블릿"}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={ad.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">
                      {ad.campaign?.start_date
                        ? format(parseISO(ad.campaign.start_date), "yyyy-MM-dd")
                        : ""}
                      {" ~ "}
                      {ad.campaign?.end_date
                        ? format(parseISO(ad.campaign.end_date), "yyyy-MM-dd")
                        : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span>
                      ₩{" "}
                      {ad.campaign?.budget
                        ? Math.floor(ad.campaign.budget).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500">
                    {ad.targetedSalonCount || "-"}
                  </span>
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
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(ad);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span>상세보기</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(ad);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>수정</span>
                      </DropdownMenuItem>
                      {ad.status === "active" ? (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 일시중지 기능 구현
                            console.log("일시중지:", ad.id);
                          }}
                        >
                          <Pause className="h-4 w-4" />
                          <span>일시중지</span>
                        </DropdownMenuItem>
                      ) : ad.status === "paused" ? (
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 재개 기능 구현
                            console.log("재개:", ad.id);
                          }}
                        >
                          <Play className="h-4 w-4" />
                          <span>재개</span>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 삭제 기능 구현
                          console.log("삭제:", ad.id);
                        }}
                      >
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
