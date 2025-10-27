#!/bin/bash

# Docker 환경 시작 스크립트

echo "==================================="
echo "ICM Musix Docker 환경 시작"
echo "==================================="

# 환경변수 파일 확인
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env 파일이 없습니다."
    echo "env.example을 .env로 복사합니다..."
    cp env.example .env
    echo "✓ .env 파일이 생성되었습니다."
    echo ""
    echo "📝 .env 파일을 편집하여 환경변수를 설정하세요:"
    echo "   nano .env"
    echo ""
    read -p "계속하시겠습니까? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되어 있지 않습니다."
    echo "https://docs.docker.com/get-docker/ 에서 설치하세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되어 있지 않습니다."
    echo "https://docs.docker.com/compose/install/ 에서 설치하세요."
    exit 1
fi

echo ""
echo "✓ Docker 설치 확인 완료"
echo ""

# 기존 컨테이너 확인
if [ "$(docker ps -a -q -f name=icm-musix)" ]; then
    echo "기존 컨테이너를 발견했습니다."
    read -p "기존 컨테이너를 삭제하고 새로 시작하시겠습니까? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "기존 컨테이너를 정리합니다..."
        docker-compose down
    fi
fi

echo ""
echo "Docker 컨테이너를 빌드하고 시작합니다..."
echo ""

# Docker Compose 실행
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "==================================="
    echo "✅ Docker 환경이 시작되었습니다!"
    echo "==================================="
    echo ""
    echo "📍 접속 주소:"
    echo "   프론트엔드:      http://localhost"
    echo "   Supabase Studio: http://localhost:54323"
    echo "   Supabase API:    http://localhost:54321"
    echo "   PostgreSQL:      localhost:54322"
    echo ""
    echo "📊 상태 확인:"
    echo "   docker-compose ps"
    echo ""
    echo "📋 로그 확인:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 중지:"
    echo "   docker-compose stop"
    echo ""
    echo "🗑️  완전 삭제:"
    echo "   docker-compose down -v"
    echo "==================================="
    echo ""
    
    # 컨테이너 상태 표시
    sleep 3
    docker-compose ps
    
else
    echo ""
    echo "❌ Docker 컨테이너 시작 실패"
    echo "로그를 확인하세요: docker-compose logs"
    exit 1
fi

