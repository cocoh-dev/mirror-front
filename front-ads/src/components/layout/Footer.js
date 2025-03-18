// components/layout/Footer.js
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:w-1/3 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} 주식회사 코코에이치. 모든 권리 보유.
            </p>
          </div>
          
          <div className="flex items-center space-x-6 mb-4 md:mb-0 md:w-1/3 justify-center">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              고객센터
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 md:w-1/3 flex items-center justify-center md:justify-end">
            <span className="text-sm text-muted-foreground mr-2">Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
          </div>
        </div>
        
        <div className="mt-6 flex flex-col items-center text-center text-xs text-muted-foreground">
          <p>사업자등록번호: 703-88-02575 | 대표: 탁진학 | 주소: 대구 동대구로 465, 대구스케일업 허브 812호</p>
          <p className="mt-1">고객센터: 053-721-8051 (평일 09:00-18:00, 주말 및 공휴일 휴무)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;