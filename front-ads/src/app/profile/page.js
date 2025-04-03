'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Clock, Mail, User2, UserCircle, Loader2, Save, X, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import api from '@/lib/api';
import { updatePassword, updateUserProfile } from '@/services/authService';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { isAuthenticated, isLoading } = useAuthCheck();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    profileImage: user?.profileImage || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 프로필 이미지 관련 상태
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  // 로컬 사용자 여부 확인 (provider가 'local'인 경우)
  const isLocalUser = user?.provider === 'local';

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setProfileImageFile(file);
    
    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (isLocalUser) {
      if (formData.newPassword && !formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      }

      if (formData.newPassword && formData.newPassword.length < 8) {
        newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다';
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 프로필 정보 업데이트 (이미지, 이름 등)
      const profileFormData = new FormData();
      profileFormData.append('name', formData.name);
      
      if (profileImageFile) {
        profileFormData.append('profileImage', profileImageFile);
      } else if (previewUrl === '') {
        profileFormData.append('removeProfileImage', 'true');
      }
      
      // 프로필 정보 업데이트
      const response = await updateUserProfile(profileFormData);
      
      // 사용자 정보가 응답에 포함되어 있으면 AuthContext 갱신
      if (response.user) {
        refreshUser(response.user);
      }
      
      // 비밀번호 변경이 필요한 경우 별도 API 호출
      if (isLocalUser && formData.currentPassword && formData.newPassword) {
        await updatePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }
      
      toast.success("프로필 정보가 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      profileImage: user?.profileImage || '',
    });
    setProfileImageFile(null);
    setPreviewUrl(user?.profileImage || '');
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">프로필</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            프로필 수정
          </Button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {!isEditing ? (
          // 프로필 정보 표시 모드
          <>
            <Card>
              <CardHeader>
                <CardTitle>프로필 정보</CardTitle>
                <CardDescription>사용자 기본 정보</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {user.profileImage ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy-image?url=${encodeURIComponent(user.profileImage)}`} 
                        alt={`${user?.name || 'User'}'s profile`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-muted-foreground">{user.role === 'superadmin' ? '최고 관리자' : 
                        user.role === 'admin' ? '관리자' : 
                        user.role === 'salonOwner' ? '미용실 주인' : '일반 사용자'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User2 className="w-4 h-4" />
                      <span>로그인 제공자: {user.provider}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>마지막 로그인: {new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>권한 정보</CardTitle>
                <CardDescription>사용자 권한 및 접근 레벨</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">현재 권한</h4>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'salonOwner' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'superadmin' ? '최고 관리자' :
                      user.role === 'admin' ? '관리자' : 
                      user.role === 'salonOwner' ? '미용실 주인' : '일반 사용자'}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">접근 가능 기능</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>개인 정보 관리</li>
                      {user.role === 'salonOwner' && <li>미용실 정보 관리</li>}
                      {user.role !== 'user' && <li>광고 관리 {(user.role === 'admin' || user.role === 'superadmin') && '및 승인'}</li>}
                      <li>미용실 정보 조회</li>
                      {user.role === 'superadmin' && <li>사용자 권한 관리</li>}
                      {user.role !== 'user' && <li>통계 데이터 조회</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // 프로필 수정 모드
          <form onSubmit={handleSubmit} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>프로필 수정</CardTitle>
                <CardDescription>
                  {isLocalUser 
                    ? '프로필 정보를 수정하려면 현재 비밀번호를 입력해주세요' 
                    : '프로필 정보를 수정할 수 있습니다'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 프로필 이미지 업로드 */}
                  <div className="flex flex-col items-center space-y-4">
                    <div 
                      className="w-32 h-32 rounded-full relative group cursor-pointer overflow-hidden"
                      onClick={handleProfileImageClick}
                    >
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="프로필 미리보기" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <UserCircle className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfileImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleProfileImageClick}
                      >
                        이미지 선택
                      </Button>
                      {previewUrl && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={removeProfileImage}
                          className="text-red-500 hover:text-red-600"
                        >
                          삭제
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      최대 5MB, JPEG/PNG 형식의 이미지만 업로드 가능합니다
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {isLocalUser && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">현재 비밀번호</Label>
                        <Input 
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className={errors.currentPassword ? 'border-red-500' : ''}
                        />
                        {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-4">비밀번호 변경 (선택사항)</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">새 비밀번호</Label>
                            <Input 
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className={errors.newPassword ? 'border-red-500' : ''}
                            />
                            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                            <Input 
                              id="confirmNewPassword"
                              name="confirmNewPassword"
                              type="password"
                              value={formData.confirmNewPassword}
                              onChange={handleChange}
                              className={errors.confirmNewPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmNewPassword && <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  취소
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}