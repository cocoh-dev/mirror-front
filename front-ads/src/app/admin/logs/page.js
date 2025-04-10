'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format, parseISO, isValid } from 'date-fns';
import {
  Search,
  FileText,
  Download,
  RefreshCw,
  Trash2,
  Calendar,
  Clock,
  Settings,
  AlertTriangle,
  Info,
  Database,
  X
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { useAuthCheck } from '@/hooks/useAuthCheck';

// 로그 레벨 배지 색상 설정 - 다크모드 대응
const getLogLevelBadge = (level) => {
  const levels = {
    error: { 
      bg: 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200', 
      icon: AlertTriangle 
    },
    warn: { 
      bg: 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200', 
      icon: AlertTriangle 
    },
    info: { 
      bg: 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200', 
      icon: Info 
    },
    debug: { 
      bg: 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200', 
      icon: Database 
    },
    trace: { 
      bg: 'bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200', 
      icon: Clock 
    }
  };
  
  const { bg, icon: Icon } = levels[level] || levels.info;
  
  return (
    <Badge className={`${bg} gap-1`}>
      <Icon className="h-3 w-3" />
      {level}
    </Badge>
  );
};

export default function LogsManagementPage() {
  const router = useRouter();
  // 인증 및 권한 확인
  const { isAuthenticated, user, isLoading } = useAuthCheck('/auth/login', '관리자 권한이 필요한 페이지입니다.');
  
  // 로그 관련 상태
  const [activeTab, setActiveTab] = useState('recent');
  const [logFiles, setLogFiles] = useState([]);
  const [logContent, setLogContent] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedLogType, setSelectedLogType] = useState('combined');
  const [currentLogLevel, setCurrentLogLevel] = useState('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 검색 관련 상태
  const [requestId, setRequestId] = useState('');
  const [searchDate, setSearchDate] = useState(new Date());
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // 필터 관련 상태
  const [levelFilter, setLevelFilter] = useState('all');
  const [contentFilter, setContentFilter] = useState('');
  
  // 로그 정리 관련 상태
  const [cleanupDays, setCleanupDays] = useState(30);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // 초기 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'superadmin') {
      fetchLogFiles();
      getCurrentLogLevel();
    }
  }, [isAuthenticated, user]);
  
  // 로그 파일 목록 가져오기
  const fetchLogFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/logs/files');
      
      console.log('API 응답 데이터:', response.data);
      
      // 중첩된 구조 처리
      const responseData = response.data.data || {};
      
      console.log('errorLogs 존재 여부:', !!responseData.errorLogs);
      console.log('combinedLogs 존재 여부:', !!responseData.combinedLogs);
      
      const errorFiles = (responseData.errorLogs || []).map(name => ({
        name,
        type: 'error',
        createdAt: extractDateFromFileName(name)
      }));
      
      const combinedFiles = (responseData.combinedLogs || []).map(name => ({
        name,
        type: 'combined',
        createdAt: extractDateFromFileName(name)
      }));
      
      // 두 배열 합치기
      const allFiles = [...errorFiles, ...combinedFiles];
      
      console.log('처리된 파일 목록:', allFiles);
      setLogFiles(allFiles);
      
      // 첫 번째 파일 자동 선택
      if (allFiles.length > 0) {
        setSelectedFile(allFiles[0].name);
      }
    } catch (error) {
      console.error('로그 파일 목록을 가져오는데 실패했습니다.', error);
      toast.error('로그 파일 목록을 가져오는데 실패했습니다.');
      setError('로그 파일 목록을 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 파일 이름에서 날짜 추출하는 헬퍼 함수
  const extractDateFromFileName = (fileName) => {
    // 예: 'error-2025-03-27.log' 또는 'combined-2025-03-27.log'
    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      return new Date(dateMatch[0]);
    }
    
    // 날짜가 없는 파일(예: 'current.log')의 경우 현재 날짜 반환
    return new Date();
  };
  
  // 현재 로그 레벨 가져오기
  const getCurrentLogLevel = async () => {
    try {
      const response = await api.get('/api/logs/level');
      setCurrentLogLevel(response.data.level || 'info');
    } catch (error) {
      console.error('현재 로그 레벨을 가져오는데 실패했습니다.', error);
      setCurrentLogLevel('info'); // 기본값 설정
    }
  };
  
  // 로그 레벨 변경 핸들러
  const handleLogLevelChange = async (level) => {
    try {
      setLoading(true);
      await api.post('/api/logs/level', { level });
      setCurrentLogLevel(level);
      toast.success(`로그 레벨이 ${level}로 변경되었습니다.`);
    } catch (error) {
      console.error('로그 레벨 변경에 실패했습니다.', error);
      toast.error('로그 레벨 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 로그 파일 내용 가져오기
  const fetchLogContent = async () => {
    if (!selectedFile) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/logs/content?file=${selectedFile}&type=${selectedLogType}`);
      setLogContent(response.data.content || []);
    } catch (error) {
      console.error('로그 내용을 가져오는데 실패했습니다.', error);
      toast.error('로그 내용을 가져오는데 실패했습니다.');
      setLogContent([]);
    } finally {
      setLoading(false);
    }
  };
  
  // 로그 검색 핸들러
  const handleSearch = async () => {
    if (!requestId || !searchDate) {
      toast.error('요청 ID와 날짜를 모두 입력해주세요.');
      return;
    }
    
    try {
      setIsSearching(true);
      const formattedDate = format(searchDate, 'yyyy-MM-dd');
      const response = await api.get(`/api/logs/search?requestId=${requestId}&date=${formattedDate}`);
      setSearchResults(response.data.data || []);
      
      if (response.data.data.length === 0) {
        toast.info('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('로그 검색에 실패했습니다.', error);
      toast.error('로그 검색에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // 로그 파일 정리 핸들러
  const handleCleanLogs = async () => {
    try {
      setLoading(true);
      await api.post('/api/logs/clean', { days: cleanupDays });
      toast.success(`${cleanupDays}일 이상 된 로그 파일이 정리되었습니다.`);
      setIsDialogOpen(false);
      fetchLogFiles(); // 파일 목록 새로고침
    } catch (error) {
      console.error('로그 정리에 실패했습니다.', error);
      toast.error('로그 정리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 필터링된 로그 내용
  const filteredLogs = logContent.filter(log => {
    // 레벨 필터링
    if (levelFilter !== 'all' && log.level !== levelFilter) {
      return false;
    }
    
    // 내용 필터링
    if (contentFilter) {
      const searchLower = contentFilter.toLowerCase();
      const messageLower = (log.message || '').toLowerCase();
      
      return messageLower.includes(searchLower);
    }
    
    return true;
  });
  
  // 로그 타임스탬프 포맷팅
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    
    try {
      // "2025-02-26 14:13:33" 형식 처리
      if (typeof timestamp === 'string' && timestamp.includes(' ')) {
        return timestamp; // 이미 형식화된 경우 그대로 반환
      }
      
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
      
      if (!isValid(date)) {
        return timestamp;
      }
      
      return format(date, 'yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      return timestamp;
    }
  };
  
  // 탭 변경 시 콘텐츠 로드
  useEffect(() => {
    if (activeTab === 'files' && selectedFile) {
      fetchLogContent();
    }
  }, [activeTab, selectedFile, selectedLogType]);
  
  // HTTP 상태 코드 배지 생성 함수 - 다크모드 대응
  const getStatusBadge = (status) => {
    if (!status || status === '-') return '-';
    
    let bgClass = '';
    
    if (status >= 400) {
      bgClass = 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200';
    } else if (status >= 300) {
      bgClass = 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    } else {
      bgClass = 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200';
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${bgClass}`}>
        {status}
      </span>
    );
  };
  
  // 로딩 중이거나 인증되지 않은 경우
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // 관리자 권한이 없는 경우
  if (user && user.role !== 'superadmin') {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>접근 권한 없음</AlertTitle>
          <AlertDescription>
            이 페이지는 슈퍼 관리자만 접근할 수 있습니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">로그 관리</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchLogFiles}>
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  로그 정리
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>로그 파일 정리</DialogTitle>
                  <DialogDescription>
                    설정한 기간보다 오래된 로그 파일을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cleanup-days">보관 일수</Label>
                    <Input
                      id="cleanup-days"
                      type="number"
                      min="1"
                      max="365"
                      value={cleanupDays}
                      onChange={(e) => setCleanupDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
                    />
                    <p className="text-sm text-muted-foreground">
                      {cleanupDays}일보다 오래된 로그 파일이 삭제됩니다.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleCleanLogs} disabled={loading}>
                    {loading ? '처리 중...' : '정리 시작'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>로그 레벨 설정</CardTitle>
            <CardDescription>
              시스템 로그의 상세 수준을 설정합니다. 높은 레벨일수록 더 많은 정보를 기록합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Label className="text-base font-medium">현재 로그 레벨:</Label>
              <div className="flex items-center space-x-2">
                {getLogLevelBadge(currentLogLevel)}
                <Select
                  value={currentLogLevel}
                  onValueChange={handleLogLevelChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="로그 레벨" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warn</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="trace">Trace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="recent">최근 로그</TabsTrigger>
            <TabsTrigger value="files">로그 파일</TabsTrigger>
            <TabsTrigger value="search">로그 검색</TabsTrigger>
          </TabsList>
          
          {/* 최근 로그 탭 */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>실시간 로그</CardTitle>
                    <CardDescription>가장 최근에 생성된 로그를 확인합니다.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="로그 레벨" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 레벨</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warn</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="trace">Trace</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="내용 검색..."
                        className="pl-8 w-[200px]"
                        value={contentFilter}
                        onChange={(e) => setContentFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <div className="border rounded-md dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">타임스탬프</TableHead>
                          <TableHead className="w-[100px]">레벨</TableHead>
                          <TableHead>메시지</TableHead>
                          <TableHead className="w-[120px]">요청 ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.slice(0, 100).map((log, index) => (
                          <TableRow key={index} className="dark:border-gray-700">
                            <TableCell className="font-mono text-xs">
                              {log.timestamp || log.metadata?.timestamp || '-'}
                            </TableCell>
                            <TableCell>
                              {getLogLevelBadge(log.level || 'info')}
                            </TableCell>
                            <TableCell className="max-w-md overflow-hidden text-ellipsis">
                              <div className="max-h-20 overflow-y-auto">
                                {log.message}
                                {log.error && (
                                  <div className="text-red-600 dark:text-red-400 mt-1 text-xs font-mono">
                                    {log.error.stack || log.error.message || JSON.stringify(log.error)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {log.metadata?.requestId || log.requestId || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">표시할 로그가 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 로그 파일 탭 */}
          <TabsContent value="files">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>로그 파일</CardTitle>
                  <CardDescription>날짜별 로그 파일 목록입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Label>로그 유형</Label>
                      <Select 
                        value={selectedLogType} 
                        onValueChange={setSelectedLogType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="로그 유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="combined">일반 로그</SelectItem>
                          <SelectItem value="error">에러 로그</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>파일 선택</Label>
                      <div className="border rounded-md h-80 overflow-y-auto dark:border-gray-700">
                        <div className="divide-y dark:divide-gray-700">
                          {logFiles
                            .filter(file => file.type === selectedLogType)
                            .map((file) => (
                              <button
                                key={file.name}
                                className={`w-full p-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                  selectedFile === file.name ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''
                                }`}
                                onClick={() => setSelectedFile(file.name)}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="truncate flex-1">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(file.createdAt), 'MM-dd')}
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>파일 내용</CardTitle>
                      <CardDescription>선택한 로그 파일의 내용입니다.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={fetchLogContent}
                        disabled={!selectedFile || loading}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        새로고침
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-96">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : !selectedFile ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">왼쪽에서 로그 파일을 선택해주세요.</p>
                    </div>
                  ) : logContent.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto dark:border-gray-700">
                      <Table>
                      <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">타임스탬프</TableHead>
                            <TableHead className="w-[100px]">레벨</TableHead>
                            <TableHead>메시지</TableHead>
                            <TableHead className="w-[100px]">메소드</TableHead>
                            <TableHead className="w-[80px]">상태</TableHead>
                            <TableHead className="w-[120px]">요청 ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logContent.map((log, index) => (
                            <TableRow key={index} className="dark:border-gray-700">
                              <TableCell className="font-mono text-xs">
                                {log.timestamp || log.metadata?.timestamp || '-'}
                              </TableCell>
                              <TableCell>
                                {getLogLevelBadge(log.level || 'info')}
                              </TableCell>
                              <TableCell className="max-w-md overflow-hidden text-ellipsis">
                                <div className="max-h-20 overflow-y-auto">
                                  {log.message}
                                  {log.error && (
                                    <div className="text-red-600 dark:text-red-400 mt-1 text-xs font-mono">
                                      {log.error.stack || log.error.message || JSON.stringify(log.error)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{log.metadata?.method || '-'}</TableCell>
                              <TableCell>
                                {getStatusBadge(log.metadata?.status)}
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {log.metadata?.requestId || log.requestId || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">로그 내용이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* 로그 검색 탭 */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>로그 검색</CardTitle>
                <CardDescription>
                  요청 ID로 로그를 검색합니다. 특정 요청의 로그 추적에 유용합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requestId">요청 ID</Label>
                      <Input
                        id="requestId"
                        placeholder="요청 ID 입력"
                        value={requestId}
                        onChange={(e) => setRequestId(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date">날짜</Label>
                      <DatePicker
                        selected={searchDate}
                        onSelect={setSearchDate}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        onClick={handleSearch} 
                        disabled={isSearching || !requestId}
                        className="w-full"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            검색 중...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            검색
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">타임스탬프</TableHead>
                          <TableHead className="w-[100px]">레벨</TableHead>
                          <TableHead>메시지</TableHead>
                          <TableHead className="w-[120px]">요청 ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.length > 0 ? (
                          searchResults.map((log, index) => (
                            <TableRow key={index} className="dark:border-gray-700">
                              <TableCell className="font-mono text-xs">
                                {formatTimestamp(log.timestamp)}
                              </TableCell>
                              <TableCell>
                                {getLogLevelBadge(log.level || 'info')}
                              </TableCell>
                              <TableCell className="max-w-md overflow-hidden text-ellipsis">
                                <div className="max-h-20 overflow-y-auto">
                                  {log.message}
                                  {log.error && (
                                    <div className="text-red-600 dark:text-red-400 mt-1 text-xs font-mono">
                                      {log.error.stack || log.error.message || JSON.stringify(log.error)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {log.requestId || '-'}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-10">
                              {isSearching ? (
                                <div className="flex justify-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                              ) : (
                                <div className="text-muted-foreground">
                                  {requestId ? '검색 결과가 없습니다.' : '요청 ID를 입력하여 검색해주세요.'}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}