import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * 이미지 파일을 Supabase Storage에 업로드합니다
 * @param file - 업로드할 파일
 * @param folder - 저장할 폴더 (기본값: 'uploads')
 * @returns 업로드된 이미지의 공개 URL
 */
export async function uploadImage(
  file: File, 
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // 파일 유효성 검사
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      return {
        url: '',
        path: '',
        error: '지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF, WEBP만 가능)'
      };
    }

    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        url: '',
        path: '',
        error: '파일 크기는 5MB를 초과할 수 없습니다.'
      };
    }

    // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        url: '',
        path: '',
        error: `업로드 실패: ${error.message}`
      };
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return {
      url: '',
      path: '',
      error: '이미지 업로드 중 오류가 발생했습니다.'
    };
  }
}

/**
 * Supabase Storage에서 이미지를 삭제합니다
 * @param filePath - 삭제할 파일 경로
 */
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('post-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error during delete:', error);
    return false;
  }
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다
 * @param bytes - 바이트 단위 파일 크기
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

