import { useRouter } from 'next/navigation';
import { AlertTriangle, Home, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 500, 404 등 전체 페이지 에러를 표시하기 위한 컴포넌트
export const ErrorPage = ({
  statusCode = 500,
  title = "문제가 발생했습니다",
  subtitle = "일시적인 시스템 오류입니다. 잠시 후 다시 시도해 주세요.",
  imageUrl, // 선택적 이미지
  showHomeButton = true,
  showBackButton = true,
  showRefreshButton = true,
  customActions, // 추가 액션 버튼
  backPath, // 뒤로가기 경로 (기본은 브라우저 history.back())
}) => {
  const router = useRouter();

  // 상태 코드별 기본 메시지 설정
  const defaultMessages = {
    404: {
      title: "페이지를 찾을 수 없습니다",
      subtitle: "요청하신 페이지가 존재하지 않거나 삭제되었습니다."
    },
    403: {
      title: "접근 권한이 없습니다",
      subtitle: "이 페이지를 볼 수 있는 권한이 없습니다."
    },
    500: {
      title: "서버 오류가 발생했습니다",
      subtitle: "일시적인 서버 오류입니다. 잠시 후 다시 시도해 주세요."
    }
  };

  // 상태 코드에 따른 기본 메시지 적용
  const displayTitle = title || defaultMessages[statusCode]?.title || defaultMessages[500].title;
  const displaySubtitle = subtitle || defaultMessages[statusCode]?.subtitle || defaultMessages[500].subtitle;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Error illustration" 
            className="mx-auto w-64 h-64 object-contain mb-6" 
          />
        ) : (
          <div className="mx-auto flex justify-center mb-6">
            <AlertTriangle size={86} className="text-destructive" />
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
        <div className="text-muted-foreground mb-8">{displaySubtitle}</div>
        
        <div className="space-y-3">
          {showRefreshButton && (
            <Button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} />
              새로고침
            </Button>
          )}
          
          <div className="flex gap-3">
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => backPath ? router.push(backPath) : window.history.back()}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                뒤로가기
              </Button>
            )}
            
            {showHomeButton && (
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home size={16} />
                홈으로
              </Button>
            )}
          </div>
          
          {customActions && (
            <div className="mt-4">
              {customActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 사용 예시: 라우트 페이지 내 에러 상태 처리
// return <ErrorPage statusCode={404} customActions={<Button>관리자에게 문의</Button>} />;

// 또는 Next.js error.js 파일 내에서 사용
// export default function Error({ error, reset }) {
//   return (
//     <ErrorPage
//       statusCode={500}
//       subtitle="일시적인 오류가 발생했습니다."
//       customActions={
//         <Button onClick={reset}>다시 시도</Button>
//       }
//     />
//   );
// }