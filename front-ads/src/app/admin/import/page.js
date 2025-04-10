'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload,
  Download,
  FileUp,
  Users,
  Scissors,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/api';

export default function ImportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const [guide, setGuide] = useState(null);
  
  // 가이드라인 불러오기
  const fetchGuide = async (dataType) => {
    try {
      const response = await api.get(`/api/admin/import/guide/${dataType}`);
      setGuide(response.data.guide);
    } catch (error) {
      console.error('가이드라인 불러오기 오류:', error);
      toast.error('가이드라인을 불러오는데 실패했습니다.');
    }
  };
  
  // 탭 변경 시 가이드라인 불러오기
  const handleTabChange = (value) => {
    setActiveTab(value);
    fetchGuide(value);
    // 파일 및 결과 초기화
    setFile(null);
    setFileName('');
    setImportResult(null);
    setError(null);
  };
  
  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 확장자 검사
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('CSV 파일만 업로드할 수 있습니다.');
        e.target.value = null;
        return;
      }
      
      // 크기 검사 (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('파일 크기는 10MB를 초과할 수 없습니다.');
        e.target.value = null;
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  };
  
  // 파일 업로드 핸들러
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('업로드할 CSV 파일을 선택해주세요.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setImportResult(null);
    
    try {
      const formData = new FormData();
      formData.append('csv', file);
      
      const response = await api.post(`/api/admin/import/${activeTab}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setImportResult(response.data.result);
      toast.success(response.data.message);
    } catch (error) {
      console.error('가져오기 오류:', error);
      const errorMessage = error.response?.data?.message || '데이터 가져오기 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 샘플 파일 다운로드
  const downloadSample = async () => {
    try {
      const response = await api.get(`/api/admin/samples/${activeTab}`, {
        responseType: 'blob'
      });
      
      // Blob으로 응답 처리
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sample-${activeTab}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('샘플 파일이 다운로드되었습니다.');
    } catch (error) {
      console.error('샘플 다운로드 오류:', error);
      toast.error('샘플 파일 다운로드에 실패했습니다.');
    }
  };
  
  // 초기 로드 시 현재 탭에 대한 가이드라인 불러오기
  useState(() => {
    fetchGuide(activeTab);
  });
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">데이터 가져오기</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          관리자 홈으로
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>사용자 데이터</span>
          </TabsTrigger>
          <TabsTrigger value="salons" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>미용실 데이터</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <ImportTabContent 
            dataType="users"
            fileName={fileName}
            guide={guide}
            importResult={importResult}
            error={error}
            isUploading={isUploading}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            downloadSample={downloadSample}
          />
        </TabsContent>
        
        <TabsContent value="salons" className="space-y-4">
          <ImportTabContent 
            dataType="salons"
            fileName={fileName}
            guide={guide}
            importResult={importResult}
            error={error}
            isUploading={isUploading}
            handleFileChange={handleFileChange}
            handleFileUpload={handleFileUpload}
            downloadSample={downloadSample}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 각 탭의 콘텐츠 컴포넌트
function ImportTabContent({ 
  dataType,
  fileName,
  guide,
  importResult,
  error,
  isUploading,
  handleFileChange,
  handleFileUpload,
  downloadSample
}) {
  return (
    <div className="space-y-6">
      {/* 가이드라인 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {dataType === 'users' ? (
              <>
                <Users className="h-5 w-5" />
                <span>사용자 데이터 가져오기 가이드</span>
              </>
            ) : (
              <>
                <Scissors className="h-5 w-5" />
                <span>미용실 데이터 가져오기 가이드</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            CSV 파일을 사용하여 {dataType === 'users' ? '사용자' : '미용실'} 데이터를 일괄 등록할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {guide ? (
            <>
              <div>
                <h3 className="font-semibold mb-2">필수 열</h3>
                <div className="bg-muted p-2 rounded-md">
                  <code>{guide.requiredColumns.join(', ')}</code>
                </div>
              </div>
              
              {guide.optionalColumns && guide.optionalColumns.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">선택 열</h3>
                  <div className="bg-muted p-2 rounded-md">
                    <code>{guide.optionalColumns.join(', ')}</code>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">예시</h3>
                <div className="bg-muted p-2 rounded-md overflow-x-auto">
                  <pre className="text-xs">{guide.example}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">참고사항</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {guide.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={downloadSample}>
            <Download className="mr-2 h-4 w-4" />
            <span>샘플 CSV 파일 다운로드</span>
          </Button>
        </CardFooter>
      </Card>
      
      {/* 파일 업로드 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>CSV 파일 업로드</CardTitle>
          <CardDescription>
            {dataType === 'users' ? '사용자' : '미용실'} 데이터가 포함된 CSV 파일을 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label 
                  htmlFor={`file-upload-${dataType}`} 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">클릭하여 파일 선택</span> 또는 파일을 여기에 끌어 놓으세요
                    </p>
                    <p className="text-xs text-muted-foreground">CSV 파일만 허용 (최대 10MB)</p>
                  </div>
                  <input 
                    id={`file-upload-${dataType}`} 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
              
              <Button 
                className="h-32" 
                onClick={handleFileUpload}
                disabled={!fileName || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>처리 중...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    <span>업로드</span>
                  </>
                )}
              </Button>
            </div>
            
            {fileName && (
              <p className="text-sm">
                선택된 파일: <span className="font-medium">{fileName}</span>
              </p>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* 결과 카드 (업로드 성공 시에만 표시) */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>가져오기 결과</span>
            </CardTitle>
            <CardDescription>
              총 {importResult.total}개 중 {importResult.success}개 성공, {importResult.error}개 실패
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 진행률 바 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>성공률</span>
                <span>{Math.round((importResult.success / importResult.total) * 100)}%</span>
              </div>
              <Progress value={(importResult.success / importResult.total) * 100} />
            </div>
            
            {/* 상세 결과 테이블 */}
            {importResult.details && importResult.details.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">오류 상세 내역</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">행 번호</TableHead>
                        <TableHead>오류 메시지</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.details.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.row || 'N/A'}</TableCell>
                          <TableCell>{detail.error}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}