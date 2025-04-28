// app/page.js
import Image from "next/image";
import { ArrowRight, Scissors, BarChart, UserPlus, Calendar, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - 다크 모드 대응 */}
      <section className="relative bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-800 dark:to-violet-900 py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              미용실 그 이상의 가능성을 열다
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              미용실 원장님과 광고주를 위한 최적의 플랫폼. 
              효율적인 경영과 타겟 마케팅의 새로운 기준을 경험하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-100 hover:text-blue dark:border-gray-400 dark:text-blue-200 dark:hover:bg-blue-300 dark:hover:text-white">
                미용실 원장님 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" 
              className="bg-white text-red-600 hover:bg-red-100 hover:text-red dark:border-gray-400 dark:text-red-200 dark:hover:bg-red-300 dark:hover:text-white">
                광고주 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 다크 모드 대응 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">두 세계를 연결하는 플랫폼</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              미용실 원장님에게는 효율적인 경영 도구를, 광고주에게는 정확한 타겟팅 기회를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="dark:text-white">스마트 예약 관리</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  손님 예약부터 일정 관리까지 한 곳에서 간편하게
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  복잡한 예약 시스템을 직관적인 인터페이스로 단순화하여 효율적인 시간 관리가 가능합니다. 
                  노쇼 알림과 자동 리마인더로 예약 관리가 더욱 편리해집니다.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="dark:text-white">실시간 경영 분석</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  데이터 기반 의사결정으로 매출 증대
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  일별, 월별, 연도별 매출 추이와 인기 서비스 분석을 통해 비즈니스 성장을 위한 통찰력을 얻으세요. 
                  직관적인 대시보드로 경영 현황을 한눈에 파악할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="dark:text-white">고객 관계 관리</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  고객 데이터를 활용한 맞춤형 서비스
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  고객의 방문 이력, 선호 스타일, 사용 제품 등을 체계적으로 관리하여 개인화된 서비스를 제공하세요. 
                  충성 고객을 위한 리워드 시스템으로 재방문률을 높일 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="dark:text-white">지역 기반 타겟 마케팅</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  정확한 위치 기반 잠재고객 접근
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  광고주는 특정 지역, 인구 통계, 관심사에 맞춰 정밀한 광고 타겟팅이 가능합니다. 
                  행정구역별, 반경별 다양한 옵션으로 효과적인 광고 집행이 가능합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mb-4">
                  <Scissors className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="dark:text-white">미용실 특화 솔루션</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  미용업계를 위해 설계된 맞춤형 기능
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  재고 관리, 스타일리스트 스케줄 조정, 서비스 메뉴 관리 등 미용실 운영에 필요한 모든 기능을 제공합니다. 
                  디자이너별 성과 분석으로 효율적인 인력 관리가 가능합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:border-gray-800 dark:bg-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="dark:text-white">광고 효과 측정</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  광고 성과를 실시간으로 확인
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  노출수, 클릭률, 전환율 등 상세한 광고 성과 지표를 실시간으로 확인할 수 있습니다. 
                  데이터 기반 의사결정으로 마케팅 ROI를 극대화하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Salon Owners - 다크 모드 대응 */}
      <section className="py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 dark:text-white">미용실 원장님을 위한<br />올인원 솔루션</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                복잡한 미용실 운영을 간편하게 만들어 드립니다. 예약, 고객 관리, 매출 분석까지 - 비즈니스에만 집중할 수 있도록 모든 관리 업무를 디지털화하세요.
              </p>
              <ul className="space-y-4">
                {[
                  '예약부터 결제까지 원스톱 관리',
                  '고객 데이터 및 방문 이력 자동 저장',
                  '직관적인 매출 및 성과 대시보드',
                  '직원 스케줄 및 성과 관리',
                  '재고 관리 및 발주 알림'
                ].map((item, i) => (
                  <li key={i} className="flex items-start dark:text-gray-300">
                    <div className="mr-3 mt-1 w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 
              bg-black text-white
              hover:bg-gray-400
              dark:bg-neutral-700 dark:hover:bg-gray-400 dark:text-white">
                원장님 솔루션 더 알아보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
            <Image
              src="/images/salon.png"
              alt="광고 관리 대시보드"
              width={800}
              height={450}
              className="rounded-lg"
            />
            </div>
          </div>
        </div>
      </section>

      {/* For Advertisers - 다크 모드 대응 */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 bg-gray-200 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
            <Image
              src="/images/ad-dashboard.png"
              alt="광고 관리 대시보드"
              width={800}
              height={450}
              className="rounded-lg"
            />
          </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6 dark:text-white">광고주를 위한<br />정밀 타겟팅 솔루션</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                광고 효율을 극대화할 수 있는 정확한 타겟팅 시스템을 제공합니다. 지역, 관심사, 인구통계에 따라 잠재 고객에게 직접 도달하세요.
              </p>
              <ul className="space-y-4">
                {[
                  '행정구역별, 반경별 위치 타겟팅',
                  '미용/뷰티 관심 고객층 직접 접근',
                  '시간대별 스케줄링으로 효율 극대화',
                  '상세한 성과 분석 및 리포트',
                  '다양한 광고 형식 지원'
                ].map((item, i) => (
                  <li key={i} className="flex items-start dark:text-gray-300">
                    <div className="mr-3 mt-1 w-5 h-5 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 
              bg-black text-white
              hover:bg-gray-400
              dark:bg-neutral-700 dark:hover:bg-gray-400 dark:text-white">
                광고 솔루션 더 알아보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - 다크 모드 대응 */}
      <section className="py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">파트너들의 이야기</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              우리 플랫폼을 통해 성장하고 있는 미용실과 광고주들의 실제 경험담을 확인하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-100 dark:border-blue-900 dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <CardTitle className="dark:text-white">김미용 원장님</CardTitle>
                <CardDescription className="dark:text-gray-400">서울 강남구 &apos;Style Hub&apos; 대표</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  &quot;예약 관리와 고객 데이터 관리가 너무 쉬워졌어요. 덕분에 고객 서비스에 더 집중할 수 있게 되었고, 재방문율도 30% 이상 높아졌습니다. 직원들도 더 효율적으로 일할 수 있게 되었죠.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-900 dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <CardTitle className="dark:text-white">박태영 마케팅 팀장</CardTitle>
                <CardDescription className="dark:text-gray-400">뷰티브랜드 &apos;Glow Korea&apos; 광고 담당</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  &quot;정확한 위치 타겟팅 덕분에 광고 ROI가 이전보다 두 배 이상 높아졌습니다. 특히 지역별 캠페인 분석을 통해 어떤 지역에서 어떤 제품이 더 인기 있는지 파악할 수 있게 되었어요.&quot;
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 dark:border-green-900 dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <CardTitle className="dark:text-white">이준서 원장님</CardTitle>
                <CardDescription className="dark:text-gray-400">부산 해운대구 &apos;Wave Hair&apos; 대표</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  &quot;매출 분석 기능이 정말 유용해요. 어떤 서비스가 가장 인기 있는지, 어떤 시간대에 예약이 몰리는지 정확히 파악할 수 있게 되었습니다. 덕분에 인력 배치와 재고 관리가 훨씬 효율적으로 바뀌었어요.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA - 다크 모드 대응 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-800 dark:to-violet-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            미용실과 광고주를 위한 새로운 시작
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            지금 바로 시작하여 비즈니스 성장의 새로운 기회를 경험하세요.
            첫 달 무료 체험으로 부담 없이 시작할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="
            bg-white text-blue-600 hover:bg-blue-100 hover:text-blue
            dark:border-gray-400 dark:text-blue dark:hover:bg-blue-300 dark:hover:text-white">
              무료 체험 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {/* <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-gray-400 dark:text-gray-200 dark:hover:bg-gray-800">
              데모 신청하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
}