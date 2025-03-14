import { AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const InlineError = ({ 
  title,
  message, 
  variant = 'default', // 'default', 'destructive'
  onDismiss,
  className,
  icon
}) => {
  // 기본 아이콘은 AlertCircle, variant에 따라 다르게 설정 가능
  const IconComponent = icon || (variant === 'destructive' ? XCircle : AlertCircle);

  return (
    <Alert 
      variant={variant}
      className={cn("flex items-center justify-between", className)}
    >
      <div className="flex-1">
        <div className="flex gap-2 items-center">
          <IconComponent className="h-4 w-4" />
          {title && <AlertTitle>{title}</AlertTitle>}
        </div>
        {message && <AlertDescription>{message}</AlertDescription>}
      </div>
      
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 ml-2"
          onClick={onDismiss}
        >
          <XCircle className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </Button>
      )}
    </Alert>
  );
};

// 사용 예시:
// <InlineError 
//   title="API 연결 오류"
//   message="서버에 연결할 수 없습니다. 나중에 다시 시도해주세요." 
//   variant="destructive"
//   onDismiss={() => setShowError(false)}
// />