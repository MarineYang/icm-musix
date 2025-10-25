# 🎵 아티스트 포트폴리오 웹사이트

React와 shadcn/ui를 사용하여 제작된 모던한 아티스트 소개 웹사이트입니다.

## ✨ 주요 기능

- 🎨 **아티스트 그리드**: 인터랙티브한 아티스트 목록 보기
- 📱 **아티스트 상세**: 개별 아티스트 정보 및 소셜 미디어 링크
- 🌙 **다크 테마**: 세련된 블랙 배경의 모던한 디자인
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- ⚡ **부드러운 애니메이션**: Framer Motion을 활용한 자연스러운 전환

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **UI Framework**: shadcn/ui, Tailwind CSS
- **빌드 도구**: Vite
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **패키지 매니저**: pnpm

## 📁 프로젝트 구조

```
src/
├── components/           # React 컴포넌트
│   ├── ui/              # shadcn/ui 컴포넌트
│   ├── ArtistGrid.tsx   # 아티스트 그리드 컴포넌트
│   ├── ArtistDetail.tsx # 아티스트 상세 컴포넌트
│   └── ...
├── pages/               # 페이지 컴포넌트
│   ├── Artist.tsx       # 아티스트 페이지
│   ├── About.tsx        # 소개 페이지
│   └── Index.tsx        # 메인 페이지
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 함수
└── main.tsx            # 앱 진입점
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:33000`으로 접속하세요.

### 3. 빌드

```bash
pnpm build
```

### 4. 프리뷰

```bash
pnpm preview
```

## 📋 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 시작 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드된 앱 미리보기 |
| `pnpm lint` | 코드 린팅 |

## 🎨 아티스트 추가하기

`src/pages/Artist.tsx` 파일에서 아티스트 정보를 추가할 수 있습니다:

```typescript
const artists: Artist[] = [
  {
    id: 'artist-id',
    name: '아티스트명',
    images: ['이미지1.jpg', '이미지2.jpg'],
    description: '아티스트 설명',
    social: {
      youtube: 'https://youtube.com/@artist',
      instagram: 'https://instagram.com/artist',
      // ...
    }
  }
];
```

## 🌐 배포

### Vercel 

```bash
npx vercel --prod
```

### Netlify

1. `pnpm build` 실행
2. `dist` 폴더를 netlify.com에 드래그 앤 드롭


## 🎯 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
