# Multi-stage build for ICM Musix

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치 (devDependencies 포함 - 빌드에 필요)
RUN npm ci

# 소스 코드 복사
COPY . .

# 빌드 인자로 환경변수 전달
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# 프로덕션 빌드
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80 443

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

