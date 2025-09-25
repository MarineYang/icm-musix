# 🚀 배포 가이드

## 빠른 배포 명령어

### 빌드 생성
```bash
pnpm build
```

### Vercel 배포
```bash
vercel --prod
```

### Netlify 배포
1. dist 폴더를 netlify.com에 드래그 앤 드롭
2. 또는 GitHub 연동으로 자동 배포

## 📁 dist 폴더 구조
```
dist/
├── index.html          # 메인 HTML 파일
├── assets/
│   ├── index-xxx.css   # 스타일시트
│   └── index-xxx.js    # JavaScript 번들
└── favicon.svg         # 파비콘
```

## 🌐 도메인 연결 후 할 일
1. 호스팅 서비스에서 커스텀 도메인 설정
2. SSL 인증서 자동 적용 확인
3. www/non-www 리다이렉트 설정

## 📋 체크리스트
- [ ] 빌드 완료 (`pnpm build`)
- [ ] dist 폴더 확인
- [ ] 도메인 준비
- [ ] 호스팅 서비스 선택
- [ ] SSL 설정 확인
