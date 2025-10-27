#!/bin/bash

# welcome2icm.com 배포 스크립트

echo "==================================="
echo "ICM Musix 웹사이트 배포"
echo "도메인: welcome2icm.com"
echo "==================================="

# 1. 의존성 설치
echo ""
echo "[1/4] 의존성 설치 중..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ 의존성 설치 실패"
    exit 1
fi
echo "✓ 의존성 설치 완료"

# 2. 프로덕션 빌드
echo ""
echo "[2/4] 프로덕션 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "✗ 빌드 실패"
    exit 1
fi
echo "✓ 빌드 완료"

# 3. 빌드 파일 배포
echo ""
echo "[3/4] 빌드 파일 배포 중..."
sudo rm -rf /var/www/welcome2icm.com/dist/*
sudo cp -r dist/* /var/www/welcome2icm.com/dist/
sudo chown -R www-data:www-data /var/www/welcome2icm.com/dist

if [ $? -ne 0 ]; then
    echo "✗ 배포 실패"
    exit 1
fi
echo "✓ 배포 완료"

# 4. Nginx 재시작
echo ""
echo "[4/4] Nginx 재시작 중..."
sudo nginx -t && sudo systemctl reload nginx

if [ $? -eq 0 ]; then
    echo "✓ Nginx 재시작 완료"
    echo ""
    echo "==================================="
    echo "배포가 완료되었습니다!"
    echo "==================================="
    echo "사이트 주소: https://welcome2icm.com"
    echo "==================================="
else
    echo "✗ Nginx 설정 오류"
    exit 1
fi

