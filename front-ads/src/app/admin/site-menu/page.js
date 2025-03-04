// app/admin/site-menu/page.js
'use client';

export default function SiteMenuPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">사이트 메뉴 관리</h1>
      </div>
      
      <div className="grid gap-4">
        <div className="p-6 bg-muted/50 rounded-lg flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-muted-foreground">이 페이지는 현재 개발 중입니다.</p>
        </div>
      </div>
    </div>
  );
}