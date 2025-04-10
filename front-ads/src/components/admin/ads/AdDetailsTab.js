// /components/admin/ads/AdDetailsTab.js
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, PauseCircle, PlayCircle } from 'lucide-react';

export const AdDetailsTab = ({ 
  adData, 
  formData, 
  editMode, 
  onInputChange, 
  onSubmit, 
  isLoading 
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onInputChange(name, type === 'checkbox' ? checked : value);
  };

  const handleSelectChange = (value) => {
    onInputChange('type', value);
  };

  // 광고 일시중지/재개 토글 핸들러
  const handlePauseToggle = (isPaused) => {
    // isPaused가 true면 'paused', false면 기존 활성 상태 또는 'active'로 설정
    const newStatus = isPaused ? 'paused' : (formData.status === 'paused' ? 'active' : formData.status);
    onInputChange('status', newStatus);
  };

  // 상태 뱃지 스타일 및 텍스트 매핑
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: '진행중', variant: 'active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      pending: { label: '대기중', variant: 'pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      paused: { label: '일시중지', variant: 'paused', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      inactive: { label: '만료됨', variant: 'inactive', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    if (status) {
      return (
        <Badge className={config.color}>
          {config.label}
        </Badge>
      );
    }
    
    return null;
  };

  // 현재 상태가 일시중지인지 확인
  const isPaused = formData.status === 'paused';
  // 일시중지 가능한 상태인지 확인 (활성 또는 일시중지 상태만 토글 가능)
  const canTogglePause = formData.status === 'active' || formData.status === 'paused';
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-card dark:bg-card/5 border-b border-border">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">광고 기본 정보</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">광고의 기본적인 속성과 설정</CardDescription>
          </div>
          {!editMode && (
            <div className="flex items-center gap-2">
              {getStatusBadge(formData.status)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {editMode ? (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-5">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-foreground">
                  광고 제목
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="transition-all focus:ring-2 focus:ring-ring bg-background border-input"
                  placeholder="광고 제목을 입력하세요"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="type" className="text-sm font-semibold text-foreground">
                  광고 유형
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-ring border-input bg-background transition-all">
                    <SelectValue placeholder="광고 유형 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground border-border">
                    <SelectItem value="sponsor">기업 광고</SelectItem>
                    <SelectItem value="salon">미용실 광고</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <InfoIcon className="h-3 w-3 mr-1" />
                  광고 유형에 따라 노출 위치가 달라집니다
                </p>
              </div>
              
              {canTogglePause && (
                <div className="flex items-center justify-between space-x-2 bg-muted/40 dark:bg-muted/20 p-3 rounded-lg border border-border">
                  <div>
                    <Label htmlFor="is_paused" className="font-semibold text-foreground">
                      {isPaused ? '광고 재개하기' : '광고 일시중지'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isPaused ? '현재 일시중지된 광고를 다시 활성화합니다' : '현재 진행 중인 광고를 일시중지합니다'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handlePauseToggle(!isPaused)}
                    className={`gap-1 ${
                      isPaused 
                        ? 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-700' 
                        : 'text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700'
                    }`}
                  >
                    {isPaused ? (
                      <>
                        <PlayCircle className="h-4 w-4" />
                        <span>재개하기</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle className="h-4 w-4" />
                        <span>일시중지</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <Separator className="my-4 bg-border" />
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={onSubmit} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                {isLoading ? "저장 중..." : "저장하기"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">광고 제목</h3>
                <p className="text-lg font-medium text-foreground">{adData.title}</p>
              </div>
              
              <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">광고 유형</h3>
                <Badge className={`text-xs px-3 py-1 ${
                  adData.type === "sponsor" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}>
                  {adData.type === "sponsor" ? '기업 광고' : '미용실 광고'}
                </Badge>
              </div>
              
              <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">광고 상태</h3>
                {getStatusBadge(adData.status)}
                
                {(adData.status === 'active' || adData.status === 'paused') && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {adData.status === 'paused' 
                      ? '편집 모드에서 광고를 재개할 수 있습니다' 
                      : '편집 모드에서 광고를 일시중지할 수 있습니다'}
                  </div>
                )}
              </div>
              
              <div className="bg-muted/40 dark:bg-muted/20 p-4 rounded-lg border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">등록일</h3>
                <p className="text-base text-foreground">{new Date(adData.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};