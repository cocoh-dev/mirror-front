/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3100',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.ngrok-free.app', // ngrok 도메인 패턴
          pathname: '/**',
        },
        // ncloud 이미지를 직접 참조할 경우를 대비
        {
          protocol: 'https',
          hostname: 'ads-api.kr.object.ncloudstorage.com',
          pathname: '/**',
        }
      ],
    },
  };
  
  export default nextConfig;