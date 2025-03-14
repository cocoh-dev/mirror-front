import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export const ErrorDisplay = ({ 
  title = "오류가 발생했습니다", 
  message, 
  retryFn, 
  backPath, 
  backLabel = "돌아가기",
  showRetry = true
}) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center p-6">
      <Card className="w-full max-w-md shadow-lg border-destructive/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mt-2">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2">
          {backPath && (
            <Button 
              variant="outline" 
              onClick={() => router.push(backPath)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          )}
          {showRetry && retryFn && (
            <Button 
              onClick={retryFn}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              다시 시도
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};