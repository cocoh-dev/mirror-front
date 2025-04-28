// components/QueryProvider.js
'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,     //쿼리가 유지되는 시간 5분
        cacheTime: 1000 * 60 * 10,    //쿼리가 캐시에 저장되는 시간 10분
        refetchOnWindowFocus: false,  //브라우저 창이 포커스 될 때 자동으로 리패치 하지 않게 설정
        retry: 1,                     //실패 시 재시도 횟수 
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}