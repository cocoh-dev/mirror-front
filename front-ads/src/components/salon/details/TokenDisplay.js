import React, { useState } from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

const TokenDisplay = ({ token }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token)
      .then(() => {
        toast.success('토큰이 클립보드에 복사되었습니다.');
      })
      .catch(err => {
        toast.error('토큰 복사 중 오류가 발생했습니다.');
        console.error('토큰 복사 실패:', err);
      });
  };

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm text-gray-500">Token:</p>
      <p className="text-sm text-gray-500">
        {isVisible ? token : '*'.repeat(token.length)}
      </p>
      <div className="flex items-center space-x-1">
        <button 
          onClick={() => setIsVisible(!isVisible)} 
          className="text-gray-500 hover:text-gray-700"
          title={isVisible ? "토큰 숨기기" : "토큰 보기"}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button 
          onClick={handleCopyToken} 
          className="text-gray-500 hover:text-gray-700"
          title="토큰 복사"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TokenDisplay;