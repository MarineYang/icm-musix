# Supabase 로컬 개발 환경 설정

## 1. 필수 요구사항

- Docker Desktop 설치 및 실행
- Node.js 설치

## 2. Supabase CLI 설치

```bash
npm install supabase --save-dev
```

## 3. Supabase 초기화 및 시작

```bash
# Supabase 초기화 (이미 완료됨)
npx supabase init

# Supabase 로컬 서버 시작
npx supabase start
```

## 4. 로컬 Supabase 정보

### 서비스 URL
- **API URL**: http://127.0.0.1:54321
- **Database URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Studio URL (Admin Dashboard)**: http://127.0.0.1:54323

### 인증 키
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`

## 5. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Local Development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## 6. 데이터베이스 스키마

로컬 Supabase에는 다음 테이블들이 자동으로 생성됩니다:

### `posts` 테이블
- `id`: BIGSERIAL (Primary Key)
- `title`: TEXT (게시글 제목)
- `content`: TEXT (게시글 내용)
- `author`: VARCHAR(100) (작성자)
- `password`: VARCHAR(255) (비밀번호)
- `created_at`: TIMESTAMP (생성일시)
- `updated_at`: TIMESTAMP (수정일시)
- `view_count`: INTEGER (조회수)
- `like_count`: INTEGER (좋아요 수)

### `comments` 테이블
- `id`: BIGSERIAL (Primary Key)
- `post_id`: BIGINT (게시글 ID - Foreign Key)
- `author`: VARCHAR(100) (작성자)
- `password`: VARCHAR(255) (비밀번호)
- `content`: TEXT (댓글 내용)
- `created_at`: TIMESTAMP (생성일시)

### `file_attachments` 테이블
- `id`: BIGSERIAL (Primary Key)
- `post_id`: BIGINT (게시글 ID - Foreign Key)
- `filename`: VARCHAR(255) (파일명)
- `file_url`: TEXT (파일 URL)
- `file_size`: BIGINT (파일 크기)
- `created_at`: TIMESTAMP (생성일시)

## 7. Supabase Studio 접속

브라우저에서 http://127.0.0.1:54323 으로 접속하면 Supabase Studio (관리자 대시보드)를 사용할 수 있습니다.

## 8. 유용한 명령어

```bash
# Supabase 시작
npx supabase start

# Supabase 중지
npx supabase stop

# 데이터베이스 리셋 (마이그레이션 재적용)
npx supabase db reset

# 데이터베이스 상태 확인
npx supabase status

# 마이그레이션 생성
npx supabase migration new <migration_name>
```

## 9. 프로덕션 배포

프로덕션 환경으로 배포할 때는 `.env.production` 파일을 생성하고 실제 Supabase 프로젝트의 URL과 키를 설정하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 10. 마이그레이션 적용

로컬에서 작성한 마이그레이션을 프로덕션에 적용하려면:

```bash
# Supabase 프로젝트와 연결
npx supabase link --project-ref your-project-ref

# 마이그레이션 푸시
npx supabase db push
```

## 문제 해결

### Docker가 실행되지 않는 경우
- Docker Desktop이 실행 중인지 확인하세요
- Windows의 경우 WSL2가 활성화되어 있는지 확인하세요

### 포트 충돌
- 다른 서비스가 54321-54324 포트를 사용 중이면 충돌이 발생할 수 있습니다
- `supabase/config.toml` 파일에서 포트를 변경할 수 있습니다

