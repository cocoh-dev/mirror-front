/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/**",
      },
      // Railway 배포 도메인 추가
      {
        protocol: "https",
        hostname: "*.up.railway.app", // Railway 도메인 패턴
        pathname: "/**",
      },
      // 커스텀 도메인이 있는 경우 추가
      {
        protocol: "https",
        hostname: "api.cocoh.kr",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["app.cocoh.kr", "testpgapi.easypay.co.kr"],
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
