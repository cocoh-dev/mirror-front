// /components/admin/ads/AdMediaTab.js
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, VideoIcon, UploadIcon, XIcon, StarIcon } from 'lucide-react';

export const AdMediaTab = ({
  formData,
  editMode,
  uploadFiles,
  onMediaUpload,
  onRemoveUploadFile,
  onRemoveExistingMedia,
  onSubmit,
  isLoading
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">광고 미디어</CardTitle>
            <CardDescription className="mt-1">이미지 및 비디오 관리</CardDescription>
          </div>
          <Badge variant="outline" className="font-medium">
            {formData.media.length}개 미디어
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {formData.media.length === 0 && uploadFiles.length === 0 ? (
          editMode ? (
            <div className="flex flex-col h-full">
              <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center aspect-video hover:bg-gray-50 transition-colors h-full">
                <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                <span className="font-medium text-gray-600 mb-4">미디어 추가</span>
                <div className="flex space-x-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('minFileInput').click()}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    일반 크기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('maxFileInput').click()}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    대형 크기
                  </Button>
                </div>
                <span className="text-xs text-gray-500 mt-2">이미지 또는 동영상</span>
                <input
                  id="minFileInput"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onMediaUpload(e, 'min')}
                  className="hidden"
                  multiple
                />
                <input
                  id="maxFileInput"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onMediaUpload(e, 'max')}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-muted-foreground mb-2">등록된 미디어가 없습니다</p>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {formData.media.map((media, index) => (
                <div key={media.id} className="relative group overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={`광고 미디어 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => onRemoveExistingMedia(media.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        aria-label="삭제"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {media.is_primary && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white rounded-full p-1.5 shadow-lg">
                        <StarIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <Badge className={`${
                        media.type === "image" 
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200" 
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      }`}>
                        <div className="flex items-center">
                          {media.type === "image" 
                            ? <ImageIcon className="h-3 w-3 mr-1" />
                            : <VideoIcon className="h-3 w-3 mr-1" />
                          }
                          {media.type === "image" ? '이미지' : '비디오'}
                        </div>
                      </Badge>
                      
                      {media.is_primary && (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          대표 미디어
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {editMode && uploadFiles.map((fileObj, index) => (
                <div key={`upload-${index}`} className="relative group overflow-hidden rounded-lg border-2 border-dashed border-blue-300 bg-blue-50">
                  <div className="aspect-video flex items-center justify-center p-3">
                    {fileObj.file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(fileObj.file)}
                        alt={`업로드 미디어 ${index + 1}`}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                        <VideoIcon className="h-8 w-8 text-blue-500 mb-2" />
                        <p className="font-medium text-blue-700 line-clamp-1">{fileObj.file.name}</p>
                        <p className="text-sm text-blue-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Badge className={`
                      ${fileObj.sizeType === 'min' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'}
                    `}>
                      {fileObj.sizeType === 'min' ? '일반' : '대형'}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => onRemoveUploadFile(index)}
                      className="bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
                      aria-label="삭제"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white border-t">
                    <p className="text-xs text-blue-600 font-medium">업로드 예정</p>
                  </div>
                </div>
              ))}

              {editMode && (
                <div className="flex flex-col h-full">
                  <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center aspect-video hover:bg-gray-50 transition-colors h-full">
                    <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="font-medium text-gray-600 mb-4">미디어 추가</span>
                    <div className="flex space-x-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('minFileInput').click()}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        일반 크기
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('maxFileInput').click()}
                        className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        대형 크기
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500 mt-2">이미지 또는 동영상</span>
                    <input
                      id="minFileInput"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => onMediaUpload(e, 'min')}
                      className="hidden"
                      multiple
                    />
                    <input
                      id="maxFileInput"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => onMediaUpload(e, 'max')}
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>
              )}
            </div>

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
          </>
        )}
      </CardContent>
    </Card>
  );
};