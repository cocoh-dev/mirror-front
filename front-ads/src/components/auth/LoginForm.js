import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/services/authService';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { useAuth } from '@/components/auth/AuthProvider';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      router.push(returnUrl);
    } catch (err) {
      console.error('Login error details:', err);
      
      // 에러 구조 확인 및 적절한 메시지 추출
      const errorMessage = 
        err.response?.data?.message ||  // 서버에서 온 에러 메시지
        err.response?.data?.error ||    // 다른 형식의 서버 에러
        err.message ||                  // Axios 에러 메시지
        'Failed to login. Please check your credentials.';
        
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          로그인 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">비밀번호</Label>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        {/* Social Login Buttons */}
        <div className="mt-6">
          <SocialLoginButtons returnUrl={returnUrl} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-700">
            회원가입
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}