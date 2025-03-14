'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Layout,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const MenuItem = ({ icon: Icon, label, href, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = children && children.length > 0;
  const pathname = usePathname();
  const isActive = href && pathname === href;

  const content = (
    <div 
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
        hasChildren ? "justify-between cursor-pointer" : "hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "transparent"
      )}
      onClick={() => hasChildren && setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{label}</span>
      </div>
      {hasChildren && (
        <div className="text-muted-foreground">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {href ? (
        <Link href={href} className="block w-full">
          {content}
        </Link>
      ) : (
        content
      )}
      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-border">
          {children}
        </div>
      )}
    </div>
  );
};

const AdminSidebar = () => {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      
      <ScrollArea className="flex-1 py-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
            관리자 메뉴
          </h2>
          <div className="space-y-1">
            <MenuItem icon={Home} label="대시보드" href="/admin" />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <MenuItem icon={Layout} label="사이트 제작/관리" defaultOpen>
              <MenuItem label="메뉴 관리" href="/admin/menu" />
              <MenuItem label="사이트 메뉴 관리" href="/admin/site-menu" />
            </MenuItem>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <MenuItem icon={Users} label="회원" defaultOpen>
              <MenuItem label="회원 목록" href="/admin/members" />
              <MenuItem label="회원 설정" href="/admin/member-settings" />
            </MenuItem>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <MenuItem icon={Box} label="콘텐츠">
              <MenuItem label="광고" href="/admin/ads" />
              <MenuItem label="스폰서" href="/admin/companies" />
              <MenuItem label="미용실" href="/admin/salons" />
              <MenuItem label="구독" href="/admin/subscription" />
              <MenuItem label="H.set" href="/admin/h-set" />
              <MenuItem label="게시판" href="/admin/boards" />
              <MenuItem label="페이지" href="/admin/pages" />
              <MenuItem label="문서" href="/admin/documents" />
              <MenuItem label="댓글" href="/admin/comments" />
              <MenuItem label="파일" href="/admin/files" />
              <MenuItem label="스케줄러" href="/admin/scheduler" />
              <MenuItem label="휴지통" href="/admin/trash" />
            </MenuItem>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <MenuItem icon={Settings} label="설정">
              <MenuItem label="시스템 설정" href="/admin/system-settings" />
              <MenuItem label="관리자 화면 설정" href="/admin/admin-settings" />
              <MenuItem label="시스템 로그 설정" href="/admin/logs" />
            </MenuItem>
          </div>
        </div>
      </ScrollArea>
      
      {/* User section at bottom */}
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard">
            <Layout className="h-4 w-4" />
            <span>사용자 화면으로</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;