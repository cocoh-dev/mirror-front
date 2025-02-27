'use client';

import { socialLogin } from '@/services/authService';
import { Button } from '@/components/ui/button';

export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">또는 소셜 계정으로 로그인</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] hover:text-black text-black"
        onClick={() => socialLogin('kakao')}
      >
        <KakaoIcon className="h-5 w-5" />
        카카오로 로그인
      </Button>

      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02A54A] text-white"
        onClick={() => socialLogin('naver')}
      >
        <NaverIcon className="h-5 w-5" />
        네이버로 로그인
      </Button>

      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-black"
        onClick={() => socialLogin('google')}
      >
        <GoogleIcon className="h-5 w-5" />
        Google로 로그인
      </Button>
    </div>
  );
}

// 아이콘 컴포넌트들
function KakaoIcon({ className }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 3C17.148 3 21.333 6.318 21.333 10.344C21.333 14.37 17.148 17.689 12 17.689C11.173 17.689 10.373 17.6 9.614 17.433C9.069 17.778 7.362 18.882 7.112 19.033C6.862 19.183 6.605 19.075 6.683 18.778C6.762 18.48 7.203 17.104 7.472 16.363C5.464 15.191 2.667 12.96 2.667 10.344C2.667 6.318 6.852 3 12 3Z" 
        fill="black"
      />
    </svg>
  );
}

function NaverIcon({ className }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M16.273 12.845L7.376 3H3V21H7.726V11.155L16.624 21H21V3H16.273V12.845Z" 
        fill="white"
      />
    </svg>
  );
}

function GoogleIcon({ className }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.68 17.57V20.29H19.07C21.06 18.47 22.56 15.64 22.56 12.25Z" 
        fill="#4285F4"
      />
      <path 
        d="M12 23C14.97 23 17.48 22.02 19.07 20.29L15.68 17.57C14.75 18.19 13.52 18.57 12 18.57C9.24 18.57 6.91 16.76 6.02 14.26H2.5V17.08C4.08 20.47 7.77 23 12 23Z" 
        fill="#34A853"
      />
      <path 
        d="M6.02 14.26C5.79 13.57 5.66 12.84 5.66 12.09C5.66 11.34 5.79 10.61 6.02 9.92V7.1H2.5C1.84 8.6 1.48 10.28 1.48 12.09C1.48 13.9 1.84 15.58 2.5 17.08L6.02 14.26Z" 
        fill="#FBBC05"
      />
      <path 
        d="M12 5.61C13.62 5.61 15.06 6.18 16.19 7.25L19.19 4.25C17.48 2.63 14.97 1.65 12 1.65C7.77 1.65 4.08 4.18 2.5 7.57L6.02 10.39C6.91 7.89 9.24 5.61 12 5.61Z" 
        fill="#EA4335"
      />
    </svg>
  );
}