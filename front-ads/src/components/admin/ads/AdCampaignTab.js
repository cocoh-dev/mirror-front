// /components/admin/ads/AdCampaignTab.js
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, Clock, InfoIcon } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ko } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export const AdCampaignTab = ({
  adData,
  formData,
  editMode,
  onCampaignChange,
  onSubmit,
  isLoading
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [budget, setBudget] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    if (adData?.AdCampaign) {
      const campaign = adData.AdCampaign;
      
      // 날짜 처리
      if (campaign.start_date) {
        setStartDate(parseISO(campaign.start_date));
      }
      
      if (campaign.end_date) {
        setEndDate(parseISO(campaign.end_date));
      }
      
      // 예산 처리
      setBudget(campaign.budget ? parseFloat(campaign.budget).toString() : '');
      setDailyBudget(campaign.daily_budget ? parseFloat(campaign.daily_budget).toString() : '');
    }
  }, [adData]);

  // 상태 변경 핸들러 함수들을 직접 업데이트하도록 변경
  const handleBudgetChange = (value) => {
    setBudget(value);
    
    // 직접 캠페인 데이터 업데이트
    if (editMode && onCampaignChange) {
      const campaignData = {
        budget: value ? parseFloat(value) : null,
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : null,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null
      };
      
      onCampaignChange(campaignData);
    }
  };
  
  const handleDailyBudgetChange = (value) => {
    setDailyBudget(value);
    
    // 직접 캠페인 데이터 업데이트
    if (editMode && onCampaignChange) {
      const campaignData = {
        budget: budget ? parseFloat(budget) : null,
        daily_budget: value ? parseFloat(value) : null,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null
      };
      
      onCampaignChange(campaignData);
    }
  };
  
  const handleStartDateChange = (date) => {
    setStartDate(date);
    
    // 직접 캠페인 데이터 업데이트
    if (editMode && onCampaignChange) {
      const campaignData = {
        budget: budget ? parseFloat(budget) : null,
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : null,
        start_date: date ? date.toISOString() : null,  // 직접 인자로 받은 date 사용
        end_date: endDate ? endDate.toISOString() : null
      };
      
      onCampaignChange(campaignData);
    }
  };

  // 금액 형식 변환 (예: 10000 -> "10,000")
  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return parseFloat(amount).toLocaleString('ko-KR');
  };

  // 날짜 형식 변환
  const formatDateDisplay = (date) => {
    if (!date) return '-';
    return format(date, 'yyyy년 MM월 dd일', { locale: ko });
  };
  
  // 끝 날짜 변경 핸들러 수정
  const handleEndDateChange = (date) => {
    setEndDate(date);
    // 여기에서 직접 캠페인 데이터를 업데이트하되, date 값을 직접 사용
    if (editMode && onCampaignChange) {
      const campaignData = {
        budget: budget ? parseFloat(budget) : null,
        daily_budget: dailyBudget ? parseFloat(dailyBudget) : null,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: date ? date.toISOString() : null  // endDate 대신 인자로 받은 date 사용
      };
      
      onCampaignChange(campaignData);
    }
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-card dark:bg-card/5 border-b border-border">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">광고 캠페인</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">캠페인 기간 및 예산 설정</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {editMode ? (
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* 예산 설정 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">예산 설정</h3>
                
                <div className="space-y-3">
                  <Label htmlFor="budget" className="text-sm font-semibold text-foreground">
                    총 예산
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                                          <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="1000"
                      value={budget}
                      onChange={(e) => handleBudgetChange(e.target.value)}
                      className="pl-10 transition-all focus:ring-2 focus:ring-ring border-input bg-background"
                      placeholder="예: 100000"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <InfoIcon className="h-3 w-3 mr-1" />
                    캠페인 기간 동안 사용될 총 예산
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="dailyBudget" className="text-sm font-semibold text-foreground">
                    일일 예산
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                                          <Input
                      id="dailyBudget"
                      type="number"
                      min="0"
                      step="100"
                      value={dailyBudget}
                      onChange={(e) => handleDailyBudgetChange(e.target.value)}
                      className="pl-10 transition-all focus:ring-2 focus:ring-ring border-input bg-background"
                      placeholder="예: 5000"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <InfoIcon className="h-3 w-3 mr-1" />
                    하루 동안 사용될 최대 예산
                  </p>
                </div>
              </div>
              
              {/* 기간 설정 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">기간 설정</h3>
                
                <div className="space-y-3">
                  <Label htmlFor="startDate" className="text-sm font-semibold text-foreground">
                    시작일
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? formatDateDisplay(startDate) : "시작 날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={handleStartDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="endDate" className="text-sm font-semibold text-foreground">
                    종료일
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? formatDateDisplay(endDate) : "종료 날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateChange}
                        disabled={(date) => (startDate ? date < startDate : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <InfoIcon className="h-3 w-3 mr-1" />
                    종료일 23:59:59까지 광고가 노출됩니다
                  </p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6 bg-border" />
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={onSubmit} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                {isLoading ? "저장 중..." : "변경사항 저장"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 예산 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground border-b pb-2">예산 정보</h3>
                
                <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">총 예산</h4>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-xl font-bold text-foreground">
                      {adData?.AdCampaign?.budget 
                        ? `${formatCurrency(adData.AdCampaign.budget)}원` 
                        : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">일일 예산</h4>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <p className="text-xl font-bold text-foreground">
                      {adData?.AdCampaign?.daily_budget 
                        ? `${formatCurrency(adData.AdCampaign.daily_budget)}원` 
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 기간 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground border-b pb-2">기간 정보</h3>
                
                <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">캠페인 기간</h4>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <div>
                      <p className="text-foreground">
                        {adData?.AdCampaign?.start_date 
                          ? format(parseISO(adData.AdCampaign.start_date), 'yyyy-MM-dd') 
                          : '-'} 
                        {' ~ '}
                        {adData?.AdCampaign?.end_date 
                          ? format(parseISO(adData.AdCampaign.end_date), 'yyyy-MM-dd') 
                          : '-'}
                      </p>
                      
                      {adData?.AdCampaign?.start_date && adData?.AdCampaign?.end_date && (
                        <p className="text-sm text-muted-foreground mt-1">
                          총 {Math.ceil(
                            (parseISO(adData.AdCampaign.end_date) - parseISO(adData.AdCampaign.start_date)) / 
                            (1000 * 60 * 60 * 24)
                          )}일
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">캠페인 상태</h4>
                  {(() => {
                    const now = new Date();
                    let status = "inactive";
                    let label = "비활성";
                    let color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
                    
                    if (adData?.AdCampaign?.start_date && adData?.AdCampaign?.end_date) {
                      const startDate = parseISO(adData.AdCampaign.start_date);
                      const endDate = parseISO(adData.AdCampaign.end_date);
                      
                      if (now < startDate) {
                        status = "pending";
                        label = "대기중";
                        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
                      } else if (now >= startDate && now <= endDate) {
                        status = "active";
                        label = "진행중";
                        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
                      } else {
                        status = "expired";
                        label = "만료됨";
                        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
                      }
                    }
                    
                    return (
                      <Badge className={`${color} font-medium`}>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {label}
                        </div>
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};