// app/admin/not-found.js
export default function AdminNotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8 text-center max-w-md">
          요청하신 관리자 페이지는 현재 준비 중입니다. 불편을 드려 죄송합니다.
        </p>
        <a 
          href="/admin"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          관리자 대시보드로 돌아가기
        </a>
      </div>
    );
  }