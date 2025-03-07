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
        return <Globe className="h-5 w-5 text-green-600" />;
      case 'administrative':
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'radius':
        return <Navigation className="h-5 w-5 text-purple-600" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-600" />;
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case 'nationwide':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'administrative':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'radius':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationTitle = (type) => {
    switch (type) {
      case 'nationwide':
        return '전국';
      case 'administrative':
        return '행정구역';
      case 'radius':
        return '반경';
      default:
        return '위치';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b py-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">위치 타겟팅</CardTitle>
            <CardDescription className="mt-1">광고 노출 지역 설정</CardDescription>
          </div>
          <Badge variant="outline" className="font-medium">
            {formData.targetLocations.length}개 지역
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {formData.targetLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Map className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-muted-foreground mb-2">등록된 위치 타겟팅이 없습니다</p>
            {editMode && (
              <Button 
                variant="outline" 
                onClick={onAddLocation}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                위치 추가
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {formData.targetLocations.map((location, index) => (
              <div key={index} className="rounded-lg border overflow-hidden transition-all hover:shadow-sm">
                <div className={`p-4 border-b ${getLocationColor(location.target_type)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-white">
                        {getLocationIcon(location.target_type)}
                      </div>
                      <h3 className="font-medium">{getLocationTitle(location.target_type)} 타겟팅</h3>
                    </div>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveLocation(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {editMode ? (
                    <div className="space-y-5">
                      <div className="mb-4">
                        <Label className="text-sm font-medium mb-2">타겟팅 유형</Label>
                        <RadioGroup
                          value={location.target_type}
                          onValueChange={(value) => onUpdateLocation(index, 'target_type', value)}
                          className="flex flex-wrap gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50 border transition-colors hover:bg-gray-100">
                            <RadioGroupItem value="nationwide" id={`nationwide-${index}`} className="text-green-600" />
                            <Label htmlFor={`nationwide-${index}`} className="flex items-center cursor-pointer">
                              <Globe className="h-4 w-4 mr-2 text-green-600" />
                              전국
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50 border transition-colors hover:bg-gray-100">
                            <RadioGroupItem value="administrative" id={`admin-${index}`} className="text-blue-600" />
                            <Label htmlFor={`admin-${index}`} className="flex items-center cursor-pointer">
                              <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                              행정구역
                            </Label>
                          </div>
                          
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50 border transition-colors hover:bg-gray-100">
                            <RadioGroupItem value="radius" id={`radius-${index}`} className="text-purple-600" />
                            <Label htmlFor={`radius-${index}`} className="flex items-center cursor-pointer">
                              <Navigation className="h-4 w-4 mr-2 text-purple-600" />
                              반경
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {location.target_type === 'administrative' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="space-y-2">
                            <Label htmlFor={`city-${index}`} className="text-sm font-medium text-blue-700">시/도</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Building2 className="h-4 w-4 text-gray-500" />
                              </div>
                              <Input
                                id={`city-${index}`}
                                value={location.city || ''}
                                onChange={(e) => onUpdateLocation(index, 'city', e.target.value)}
                                className="pl-10 transition-all focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 서울특별시"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`district-${index}`} className="text-sm font-medium text-blue-700">구/군</Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MapPin className="h-4 w-4 text-gray-500" />
                              </div>
                              <Input
                                id={`district-${index}`}
                                value={location.district || ''}
                                onChange={(e) => onUpdateLocation(index, 'district', e.target.value)}
                                className="pl-10 transition-all focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 강남구"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {location.target_type === 'radius' && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`radius-input-${index}`} className="text-sm font-medium text-purple-700">반경 (m)</Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Navigation className="h-4 w-4 text-gray-500" />
                                </div>
                                <Input
                                  id={`radius-input-${index}`}
                                  type="number"
                                  value={location.radius || 0}
                                  onChange={(e) => onUpdateLocation(index, 'radius', parseInt(e.target.value))}
                                  className="pl-10 transition-all focus:ring-2 focus:ring-purple-500"
                                  placeholder="1000"
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`lat-${index}`} className="text-sm font-medium text-purple-700">위도</Label>
                              <Input
                                id={`lat-${index}`}
                                type="number"
                                step="0.000001"
                                value={location.center_latitude || 0}
                                onChange={(e) => onUpdateLocation(index, 'center_latitude', parseFloat(e.target.value))}
                                className="transition-all focus:ring-2 focus:ring-purple-500"
                                placeholder="37.5665"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`lng-${index}`} className="text-sm font-medium text-purple-700">경도</Label>
                              <Input
                                id={`lng-${index}`}
                                type="number"
                                step="0.000001"
                                value={location.center_longitude || 0}
                                onChange={(e) => onUpdateLocation(index, 'center_longitude', parseFloat(e.target.value))}
                                className="transition-all focus:ring-2 focus:ring-purple-500"
                                placeholder="126.9780"
                                required
                              />
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-purple-200">
                            <p className="text-xs text-purple-700">지도에서 중심점을 선택하거나 위도/경도 값을 직접 입력하세요.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {location.target_type === 'nationwide' && (
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <Globe className="h-5 w-5 text-green-600 mr-2" />
                          <p className="font-medium text-green-800">전국 모든 지역에 노출됩니다</p>
                        </div>
                      )}
                      
                      {location.target_type === 'administrative' && (
                        <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
                          <div>
                            <p className="text-sm text-blue-700">시/도</p>
                            <p className="font-medium">{location.city || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">구/군</p>
                            <p className="font-medium">{location.district || '전체'}</p>
                          </div>
                        </div>
                      )}

                      {location.target_type === 'radius' && (
                        <div className="grid grid-cols-3 gap-4 p-3 bg-purple-50 rounded-lg">
                          <div>
                            <p className="text-sm text-purple-700">반경</p>
                            <p className="font-medium">{location.radius || 0}m</p>
                          </div>
                          <div>
                            <p className="text-sm text-purple-700">위도</p>
                            <p className="font-medium">{location.center_latitude || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-purple-700">경도</p>
                            <p className="font-medium">{location.center_longitude || 0}</p>
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
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center h-32 hover:bg-gray-50 transition-colors"
              >
                <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-gray-500 font-medium">새 위치 타겟팅 추가</span>
              </div>
            )}

            {editMode && (
              <>
                <Separator className="my-6" />
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={onSubmit} 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
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