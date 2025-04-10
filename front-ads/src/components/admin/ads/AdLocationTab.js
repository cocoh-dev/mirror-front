// /components/admin/ads/AdLocationTab.js
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Globe, Map, Navigation, PlusCircle, XCircle, Building2 } from 'lucide-react';

export const AdLocationTab = ({
  formData,
  editMode,
  onAddLocation,
  onUpdateLocation,
  onRemoveLocation,
  onSubmit,
  isLoading
}) => {
  const getLocationIcon = (type) => {
    switch (type) {
      case 'nationwide':
        return <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'administrative':
        return <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'radius':
        return <Navigation className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <MapPin className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case 'nationwide':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'administrative':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'radius':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-muted/40 dark:bg-muted/20 text-foreground border-border';
    }
  };

  const getLocationTitle = (type) => {
    switch (type) {
      case 'nationwide':
        return '전국';
      case 'administrative':
        return '행정구역';
      default:
        return '위치';
    }
  };

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-card dark:bg-card/5 border-b border-border">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">위치 타겟팅</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">광고 노출 지역 설정</CardDescription>
          </div>
          <Badge variant="outline" className="font-medium border-border text-foreground">
            {formData.targetLocations.length}개 지역
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {formData.targetLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-muted/40 dark:bg-muted/20 rounded-lg border-2 border-dashed border-muted">
            <Map className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-2">등록된 위치 타겟팅이 없습니다</p>
            {editMode && (
              <Button 
                variant="outline" 
                onClick={onAddLocation}
                className="mt-2 border-border text-foreground hover:bg-muted"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                위치 추가
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {formData.targetLocations.map((location, index) => (
              <div key={index} className="rounded-lg border border-border overflow-hidden transition-all hover:shadow-sm dark:hover:shadow-gray-800/20">
                <div className={`p-4 border-b ${getLocationColor(location.target_type)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-card dark:bg-card/20">
                        {getLocationIcon(location.target_type)}
                      </div>
                      <h3 className="font-medium text-foreground">{getLocationTitle(location.target_type)} 타겟팅</h3>
                    </div>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveLocation(index)}
                        className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-card dark:bg-card/5">
                  {editMode ? (
                    <div className="space-y-5">
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-foreground mb-2">타겟팅 유형</Label>
                        <RadioGroup
                          value={location.target_type}
                          onValueChange={(value) => onUpdateLocation(index, 'target_type', value)}
                          className="flex flex-wrap gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/40 dark:bg-muted/20 border border-border transition-colors hover:bg-muted/60 dark:hover:bg-muted/30">
                            <RadioGroupItem value="nationwide" id={`nationwide-${index}`} className="text-green-600 dark:text-green-400" />
                            <Label htmlFor={`nationwide-${index}`} className="flex items-center cursor-pointer">
                              <Globe className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                              <span className="text-foreground">전국</span>
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-muted/40 dark:bg-muted/20 border border-border transition-colors hover:bg-muted/60 dark:hover:bg-muted/30">
                            <RadioGroupItem value="administrative" id={`admin-${index}`} className="text-blue-600 dark:text-blue-400" />
                            <Label htmlFor={`admin-${index}`} className="flex items-center cursor-pointer">
                              <Building2 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              <span className="text-foreground">행정구역</span>
                            </Label>
                          </div>
                          
                        </RadioGroup>
                      </div>

                      {location.target_type === 'administrative' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="space-y-2">
                            <Label htmlFor={`city-${index}`} className="text-sm font-medium text-blue-700 dark:text-blue-400">시/도</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input
                                id={`city-${index}`}
                                value={location.city || ''}
                                onChange={(e) => onUpdateLocation(index, 'city', e.target.value)}
                                className="pl-10 transition-all focus:ring-2 focus:ring-ring border-blue-200 dark:border-blue-800 bg-card dark:bg-card/20"
                                placeholder="예: 서울"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`district-${index}`} className="text-sm font-medium text-blue-700 dark:text-blue-400">구/군</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input
                                id={`district-${index}`}
                                value={location.district || ''}
                                onChange={(e) => onUpdateLocation(index, 'district', e.target.value)}
                                className="pl-10 transition-all focus:ring-2 focus:ring-ring border-blue-200 dark:border-blue-800 bg-card dark:bg-card/20"
                                placeholder="예: 강남구"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div>
                      {location.target_type === 'nationwide' && (
                        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                          <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                          <p className="font-medium text-green-800 dark:text-green-300">전국 모든 지역에 노출됩니다</p>
                        </div>
                      )}
                      
                      {location.target_type === 'administrative' && (
                        <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                          <div>
                            <p className="text-sm text-blue-700 dark:text-blue-400">시/도</p>
                            <p className="font-medium text-foreground">{location.city || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700 dark:text-blue-400">구/군</p>
                            <p className="font-medium text-foreground">{location.district || '전체'}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            ))}

            {editMode && (
              <div 
                onClick={onAddLocation}
                className="cursor-pointer rounded-lg border-2 border-dashed border-muted p-4 flex flex-col items-center justify-center h-32 hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors"
              >
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-muted-foreground font-medium">새 위치 타겟팅 추가</span>
              </div>
            )}

            {editMode && (
              <>
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
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};