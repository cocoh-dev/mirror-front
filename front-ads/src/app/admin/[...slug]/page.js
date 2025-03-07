'use client';

import { use } from 'react';
import Link from 'next/link';

export default function CatchAllAdminPage({ params }) {
  // React.use()를 사용하여 params 객체 언래핑
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  
  // 구현된 페이지 목록
  const implementedPages = ['dashboard', 'members', 'ads', 'salons'];
  
  // 첫 번째 세그먼트를 기준으로 구현 여부 확인
  const firstSegment = slug[0];
  
  if (!implementedPages.includes(firstSegment)) {
    // 준비 중인 페이지 메시지 표시
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h2 className="text-2xl font-semibold mb-4">페이지 준비 중</h2>
        <p className="mb-8 text-center max-w-md text-muted-foreground">
          요청하신 &apos;{slug.join('/')}&apos; 페이지는 현재 개발 중입니다.
          빠른 시일 내에 서비스를 제공해 드리겠습니다.
        </p>
        <Link 
          href="/admin"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          관리자 대시보드로 돌아가기
        </Link>
      </div>
    );
  }
  
  // 구현된 페이지는 notFound()를 호출하여 404 처리
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 text-center max-w-md text-muted-foreground">
        요청하신 페이지는 존재하지 않습니다.
      </p>
      <Link
        href="/admin"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        관리자 대시보드로 돌아가기
      </Link>
    </div>
  );
}