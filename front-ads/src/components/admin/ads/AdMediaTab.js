// /components/admin/ads/AdMediaTab.js
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ImageIcon,
  VideoIcon,
  UploadIcon,
  XIcon,
  StarIcon,
} from "lucide-react";

export const AdMediaTab = ({
  formData,
  editMode,
  uploadFiles,
  onMediaUpload,
  onRemoveUploadFile,
  onRemoveExistingMedia,
  onSubmit,
  isLoading,
}) => {
  // 유효한 미디어만 필터링 (URL이 있고 빈 문자열이 아닌 것)
  const validMedia = formData.media.filter(
    (media) => media.url && media.url.trim() !== ""
  );

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="bg-card dark:bg-card/5 border-b border-border">
        <div className="flex items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              광고 미디어
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              이미지 및 비디오 관리
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="font-medium border-border text-foreground"
          >
            {validMedia.length}개 미디어
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {validMedia.length === 0 && uploadFiles.length === 0 ? (
          editMode ? (
            <div className="flex flex-col h-full">
              <div className="cursor-pointer border-2 border-dashed border-muted dark:border-muted rounded-lg p-6 flex flex-col items-center justify-center aspect-video hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors h-full">
                <UploadIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="font-medium text-foreground mb-4">
                  미디어 추가
                </span>
                <div className="flex space-x-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("minFileInput").click()
                    }
                    className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  >
                    일반 크기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("maxFileInput").click()
                    }
                    className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                  >
                    대형 크기
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  이미지 또는 동영상
                </span>
                <input
                  id="minFileInput"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onMediaUpload(e, "min")}
                  className="hidden"
                  multiple
                />
                <input
                  id="maxFileInput"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onMediaUpload(e, "max")}
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 bg-muted/40 dark:bg-muted/20 rounded-lg border-2 border-dashed border-muted">
              <p className="text-muted-foreground mb-2">
                등록된 미디어가 없습니다
              </p>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {validMedia.map((media, index) => (
                <div
                  key={media.id}
                  className="relative group overflow-hidden rounded-lg border border-border shadow-sm transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
                >
                  <div className="aspect-video bg-muted/40 dark:bg-muted/20 relative overflow-hidden">
                    {media.type === "image" ? (
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_API_URL
                        }/api/proxy-image?url=${encodeURIComponent(media.url)}`}
                        alt={`광고 미디어 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("이미지 로딩 실패:", media.url);
                        }}
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
                        className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 dark:hover:bg-red-700"
                        aria-label="삭제"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}

                    {media.is_primary && (
                      <div className="absolute top-2 left-2 bg-amber-500 dark:bg-amber-600 text-white rounded-full p-1.5 shadow-lg">
                        <StarIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-card dark:bg-card/20">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${
                          media.type === "image"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900"
                        }`}
                      >
                        <div className="flex items-center">
                          {media.type === "image" ? (
                            <ImageIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <VideoIcon className="h-3 w-3 mr-1" />
                          )}
                          {media.type === "image" ? "이미지" : "비디오"}
                        </div>
                      </Badge>

                      {media.is_primary && (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900">
                          대표 미디어
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {editMode &&
                uploadFiles.map((fileObj, index) => (
                  <div
                    key={`upload-${index}`}
                    className="relative group overflow-hidden rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10"
                  >
                    <div className="aspect-video flex items-center justify-center p-3">
                      {fileObj.file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(fileObj.file)}
                          alt={`업로드 미디어 ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <VideoIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-2" />
                          <p className="font-medium text-blue-700 dark:text-blue-300 line-clamp-1">
                            {fileObj.file.name}
                          </p>
                          <p className="text-sm text-blue-500 dark:text-blue-400">
                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Badge
                        className={`
                      ${
                        fileObj.sizeType === "min"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200"
                      }
                    `}
                      >
                        {fileObj.sizeType === "min" ? "일반" : "대형"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => onRemoveUploadFile(index)}
                        className="bg-red-500 dark:bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 dark:hover:bg-red-700"
                        aria-label="삭제"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="p-3 bg-card dark:bg-card/20 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        업로드 예정
                      </p>
                    </div>
                  </div>
                ))}

              {editMode && (
                <div className="flex flex-col h-full">
                  <div className="cursor-pointer border-2 border-dashed border-muted dark:border-muted rounded-lg p-6 flex flex-col items-center justify-center aspect-video hover:bg-muted/20 dark:hover:bg-muted/10 transition-colors h-full">
                    <UploadIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="font-medium text-foreground mb-4">
                      미디어 추가
                    </span>
                    <div className="flex space-x-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("minFileInput").click()
                        }
                        className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      >
                        일반 크기
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("maxFileInput").click()
                        }
                        className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                      >
                        대형 크기
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      이미지 또는 동영상
                    </span>
                    <input
                      id="minFileInput"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => onMediaUpload(e, "min")}
                      className="hidden"
                      multiple
                    />
                    <input
                      id="maxFileInput"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => onMediaUpload(e, "max")}
                      className="hidden"
                      multiple
                    />
                  </div>
                </div>
              )}
            </div>

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
          </>
        )}
      </CardContent>
    </Card>
  );
};
