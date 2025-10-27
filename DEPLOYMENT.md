# welcome2icm.com 배포 가이드

## 📋 사전 요구사항

1. **서버 환경**
   - Ubuntu 20.04 LTS 이상 (또는 Debian 기반)
   - Nginx 설치됨
   - Node.js 18 이상 설치됨
   - 80, 443 포트 오픈

2. **도메인 설정**
   - `welcome2icm.com` A 레코드 → 서버 IP
   - `www.welcome2icm.com` A 레코드 → 서버 IP (선택사항)

3. **환경변수 설정**
   ```bash
   # .env 파일 생성
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🚀 배포 단계

### 1단계: SSL 인증서 설정

```bash
# 스크립트에 실행 권한 부여
chmod +x ssl-setup.sh

# SSL 설정 스크립트 실행
./ssl-setup.sh
```

이 스크립트는 다음을 수행합니다:
- Certbot 설치 (없는 경우)
- Nginx 설정 파일 복사
- 필요한 디렉토리 생성
- SSL 인증서 발급 (Let's Encrypt)

### 2단계: 애플리케이션 배포

```bash
# 스크립트에 실행 권한 부여
chmod +x deploy.sh

# 배포 스크립트 실행
./deploy.sh
```

이 스크립트는 다음을 수행합니다:
- 의존성 설치
- 프로덕션 빌드 생성
- 빌드 파일을 웹 루트로 복사
- Nginx 재시작

## 🔧 수동 설정 (선택사항)

### Nginx 설정 파일 직접 수정

```bash
sudo nano /etc/nginx/sites-available/welcome2icm.com
```

### SSL 인증서 수동 발급

```bash
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d welcome2icm.com \
  -d www.welcome2icm.com \
  --email admin@welcome2icm.com \
  --agree-tos
```

### 인증서 자동 갱신 테스트

```bash
sudo certbot renew --dry-run
```

## 📁 디렉토리 구조

```
/var/www/welcome2icm.com/
├── dist/                 # 빌드된 React 앱
│   ├── index.html
│   ├── assets/
│   └── ...
└── ...

/etc/nginx/sites-available/
└── welcome2icm.com       # Nginx 설정 파일

/etc/letsencrypt/live/welcome2icm.com/
├── fullchain.pem        # SSL 인증서
├── privkey.pem          # 개인키
└── chain.pem            # 인증서 체인
```

## 🔄 업데이트 배포

코드가 업데이트되면:

```bash
# Git에서 최신 코드 가져오기
git pull origin main

# 배포 스크립트 실행
./deploy.sh
```

## 🔍 문제 해결

### Nginx 설정 테스트
```bash
sudo nginx -t
```

### Nginx 로그 확인
```bash
# 에러 로그
sudo tail -f /var/log/nginx/welcome2icm.com_error.log

# 액세스 로그
sudo tail -f /var/log/nginx/welcome2icm.com_access.log
```

### SSL 인증서 상태 확인
```bash
sudo certbot certificates
```

### 방화벽 설정 (UFW 사용 시)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🔐 보안 권장사항

1. **정기적인 업데이트**
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **SSH 보안 강화**
   - 키 기반 인증 사용
   - 루트 로그인 비활성화
   - 기본 포트 변경

3. **백업 설정**
   - 정기적인 데이터베이스 백업
   - 환경변수 파일 백업

4. **모니터링**
   - 로그 모니터링
   - SSL 인증서 만료 알림
   - 서버 리소스 모니터링

## 📞 지원

문제가 발생하면:
1. Nginx 로그 확인
2. SSL 인증서 상태 확인
3. 도메인 DNS 설정 확인
4. 방화벽 설정 확인

## 🔗 유용한 링크

- [Nginx 공식 문서](https://nginx.org/en/docs/)
- [Let's Encrypt 문서](https://letsencrypt.org/docs/)
- [Certbot 가이드](https://certbot.eff.org/)

