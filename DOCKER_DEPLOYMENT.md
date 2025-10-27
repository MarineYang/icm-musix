# Docker 배포 가이드 - ICM Musix & Supabase

## 📋 개요

이 프로젝트는 Docker와 Docker Compose를 사용하여 ICM Musix 프론트엔드와 Supabase 백엔드를 함께 배포합니다.

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────┐
│           Nginx (Reverse Proxy)             │
│          Port 80/443 (SSL/TLS)              │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼──────────┐    ┌────────▼───────────────┐
│  Frontend    │    │  Supabase Kong         │
│  (React)     │    │  (API Gateway)         │
│  Port 80     │    │  Port 54321            │
└──────────────┘    └────────┬───────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐  ┌─────▼────┐  ┌───────▼──────┐
    │ PostgreSQL   │  │   Auth   │  │   Storage    │
    │ Port 54322   │  │          │  │              │
    └──────────────┘  └──────────┘  └──────────────┘
```

## 🚀 빠른 시작

### 1. 사전 요구사항

- Docker 20.10 이상
- Docker Compose 2.0 이상
- 최소 4GB RAM

```bash
# Docker 설치 확인
docker --version
docker-compose --version
```

### 2. 환경변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env

# .env 파일 수정
nano .env
```

**중요**: 프로덕션 환경에서는 반드시 다음 값들을 변경하세요:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `SUPABASE_SERVICE_KEY`

### 3. 개발 환경 실행

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 보기
docker-compose logs -f frontend
docker-compose logs -f supabase-db
```

### 4. 접속 확인

- **프론트엔드**: http://localhost
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321
- **PostgreSQL**: localhost:54322

## 🏭 프로덕션 배포

### 1. SSL 인증서 발급 (Let's Encrypt)

```bash
# 도메인이 서버를 가리키는지 확인 후
./ssl-setup.sh
```

### 2. 프로덕션 환경변수 설정

```bash
# .env 파일에서 프로덕션 값으로 변경
VITE_SUPABASE_URL=https://api.welcome2icm.com
SITE_URL=https://welcome2icm.com
API_EXTERNAL_URL=https://api.welcome2icm.com
URI_ALLOW_LIST=https://welcome2icm.com,https://www.welcome2icm.com
DISABLE_SIGNUP=false
ENABLE_EMAIL_AUTOCONFIRM=false
```

### 3. 프로덕션 컨테이너 실행

```bash
# 프로덕션 설정으로 빌드 및 실행
docker-compose -f docker-compose.prod.yml up -d --build

# 상태 확인
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 유용한 명령어

### 서비스 관리

```bash
# 모든 서비스 시작
docker-compose up -d

# 특정 서비스만 시작
docker-compose up -d frontend supabase-db

# 서비스 중지
docker-compose stop

# 서비스 재시작
docker-compose restart

# 컨테이너 및 볼륨 완전 삭제
docker-compose down -v
```

### 로그 및 모니터링

```bash
# 실시간 로그 확인
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs -f supabase-db

# 로그 마지막 100줄
docker-compose logs --tail=100 frontend

# 컨테이너 리소스 사용량
docker stats
```

### 데이터베이스 관리

```bash
# PostgreSQL 접속
docker-compose exec supabase-db psql -U postgres

# 데이터베이스 백업
docker-compose exec supabase-db pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql

# 데이터베이스 복원
docker-compose exec -T supabase-db psql -U postgres postgres < backup_20231201.sql

# 마이그레이션 다시 실행
docker-compose down supabase-db
docker-compose up -d supabase-db
```

### 컨테이너 내부 접근

```bash
# 프론트엔드 컨테이너 접속
docker-compose exec frontend sh

# PostgreSQL 컨테이너 접속
docker-compose exec supabase-db bash

# Nginx 설정 확인
docker-compose exec frontend nginx -t
```

## 📦 빌드 및 이미지 관리

### 이미지 빌드

```bash
# 캐시 없이 전체 재빌드
docker-compose build --no-cache

# 특정 서비스만 빌드
docker-compose build frontend

# 빌드 후 즉시 실행
docker-compose up -d --build
```

### 이미지 최적화

```bash
# 사용하지 않는 이미지 삭제
docker image prune -a

# 사용하지 않는 볼륨 삭제
docker volume prune

# 전체 시스템 정리
docker system prune -a --volumes
```

## 🔐 보안 설정

### 1. 환경변수 암호화

프로덕션에서는 `.env` 파일 대신 Docker Secrets 사용 권장:

```bash
# Docker Swarm 초기화
docker swarm init

# Secret 생성
echo "your-super-secret-password" | docker secret create postgres_password -
echo "your-jwt-secret" | docker secret create jwt_secret -
```

### 2. 네트워크 격리

```yaml
# 외부 노출 최소화
ports:
  - "127.0.0.1:54322:5432"  # PostgreSQL은 로컬에서만 접근
```

### 3. 정기적인 업데이트

```bash
# 이미지 업데이트
docker-compose pull

# 재시작
docker-compose up -d
```

## 🐛 문제 해결

### 컨테이너가 시작되지 않는 경우

```bash
# 컨테이너 상태 확인
docker-compose ps

# 상세 로그 확인
docker-compose logs --tail=50 [service-name]

# 헬스체크 확인
docker inspect --format='{{.State.Health.Status}}' [container-name]
```

### 데이터베이스 연결 오류

```bash
# PostgreSQL 상태 확인
docker-compose exec supabase-db pg_isready -U postgres

# 연결 테스트
docker-compose exec supabase-db psql -U postgres -c "SELECT version();"
```

### 포트 충돌

```bash
# 사용 중인 포트 확인 (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :54321

# docker-compose.yml에서 포트 변경
ports:
  - "8080:80"  # 80 → 8080으로 변경
```

### 디스크 공간 부족

```bash
# 디스크 사용량 확인
docker system df

# 정리
docker system prune -a --volumes
```

## 📊 모니터링

### 컨테이너 메트릭

```bash
# 리소스 사용량 실시간 모니터링
docker stats

# 특정 컨테이너만
docker stats icm-musix-frontend icm-supabase-db
```

### 로그 관리

```bash
# 로그 파일 크기 제한 설정
# docker-compose.yml에 추가:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🔄 업데이트 및 유지보수

### 애플리케이션 업데이트

```bash
# 1. 코드 변경사항 가져오기
git pull origin main

# 2. 재빌드 및 배포
docker-compose up -d --build frontend

# 3. 무중단 배포 (Blue-Green)
docker-compose -f docker-compose.blue.yml up -d
# 테스트 후
docker-compose -f docker-compose.green.yml down
```

### 데이터 백업

```bash
# 자동 백업 스크립트 (cron에 등록)
#!/bin/bash
BACKUP_DIR="/backup/supabase"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL 백업
docker-compose exec -T supabase-db pg_dump -U postgres postgres | \
  gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Storage 백업
docker run --rm -v supabase-storage-data:/data -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/storage_$DATE.tar.gz -C /data .

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
```

## 📚 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [Supabase Self-Hosting](https://supabase.com/docs/guides/self-hosting)
- [Nginx 설정 가이드](https://nginx.org/en/docs/)

## 🆘 지원

문제가 발생하면:
1. 로그 확인: `docker-compose logs -f`
2. 헬스체크 확인: `docker-compose ps`
3. 네트워크 확인: `docker network ls`
4. 볼륨 확인: `docker volume ls`

