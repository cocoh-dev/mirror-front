"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    const handleParams = () => {
      try {
        const shopOrderNo = searchParams.get("shopOrderNo");
        const goodName = searchParams.get("goodName");
        const amount = searchParams.get("amount");

        if (!shopOrderNo || !goodName || !amount) {
          setError("필수 파라미터가 누락되었습니다.");
          return;
        }

        // 팝업창으로 열린 경우 부모 창으로 리다이렉트
        if (window.opener) {
          setIsPopup(true);
          // 부모 창으로 결제 완료 메시지 전송
          // window.opener.postMessage("PAYMENT_SUCCESS", "*");

          // // 부모 창으로 리다이렉트
          // window.opener.location.href = `/success?shopOrderNo=${shopOrderNo}&goodName=${encodeURIComponent(
          //   goodName
          // )}&amount=${amount}`;

          // // 현재 창 닫기 시도
          // const closeWindow = () => {
          //   try {
          //     window.close();
          //   } catch (e) {
          //     console.error("window.close() failed:", e);
          //   }
          // };

          // // 여러 번 시도
          // closeWindow();
          // setTimeout(closeWindow, 500);
          // setTimeout(closeWindow, 1000);
          // setTimeout(closeWindow, 2000);
        }
      } catch (err) {
        console.error("처리 중 오류 발생:", err);
        setError("결제 처리 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    handleParams();
  }, [searchParams]);

  useEffect(() => {
    if (!isPopup) {
      setTimeout(() => {
        window.close();
      }, 100);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            결제 결과를 처리중입니다...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="w-[400px] dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500">오류 발생</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[400px] dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-green-500">결제 완료</CardTitle>
          <CardDescription>결제가 성공적으로 완료되었습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">주문번호</p>
            <p className="font-medium">{searchParams.get("shopOrderNo")}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">상품명</p>
            <p className="font-medium">
              {decodeURIComponent(searchParams.get("goodName"))}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">결제금액</p>
            <p className="font-medium">
              {Number(searchParams.get("amount")).toLocaleString()}원
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">로딩중...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
