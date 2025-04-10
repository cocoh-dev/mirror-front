// /components/admin/ads/AdDetailsTab.js
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

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

  const handleSwitchChange = (checked) => {
    onInputChange('is_active', checked);
  };

  const handleSelectChange = (value) => {
    onInputChange('type', value);
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-card dark:bg-card/5 border-b border-border">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">광고 기본 정보</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">광고의 기본적인 속성과 설정</CardDescription>
          </div>
          {!editMode && (
            <Badge variant={adData.is_active ? "success" : "secondary"} className="ml-2">
              {adData.is_active ? '활성화' : '비활성화'}
            </Badge>
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
              
              <div className="flex items-center justify-between space-x-2 bg-muted/40 dark:bg-muted/20 p-3 rounded-lg border border-border">
                <div>
                  <Label htmlFor="is_active" className="font-semibold text-foreground">활성화 상태</Label>
                  <p className="text-sm text-muted-foreground">광고를 즉시 활성화합니다</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-600"
                />
              </div>
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
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">활성화 상태</h3>
                <Badge variant={adData.is_active ? "success" : "secondary"}>
                  {adData.is_active ? '활성화' : '비활성화'}
                </Badge>
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