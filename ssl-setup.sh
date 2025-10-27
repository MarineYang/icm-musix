#!/bin/bash

# SSL 인증서 설정 스크립트 for welcome2icm.com

echo "==================================="
echo "SSL 인증서 설정 스크립트"
echo "도메인: welcome2icm.com"
echo "==================================="

# 1. Certbot 설치 확인
echo ""
echo "[1/5] Certbot 설치 확인 중..."
if ! command -v certbot &> /dev/null; then
    echo "Certbot이 설치되어 있지 않습니다. 설치를 진행합니다..."
    
    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    # CentOS/RHEL
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    else
        echo "지원하지 않는 시스템입니다. 수동으로 Certbot을 설치해주세요."
        exit 1
    fi
else
    echo "✓ Certbot이 이미 설치되어 있습니다."
fi

# 2. Nginx 설정 파일 복사
echo ""
echo "[2/5] Nginx 설정 파일 복사 중..."
sudo cp nginx.conf /etc/nginx/sites-available/welcome2icm.com

# 심볼릭 링크 생성
if [ ! -L /etc/nginx/sites-enabled/welcome2icm.com ]; then
    sudo ln -s /etc/nginx/sites-available/welcome2icm.com /etc/nginx/sites-enabled/
    echo "✓ 심볼릭 링크 생성 완료"
else
    echo "✓ 심볼릭 링크가 이미 존재합니다."
fi

# 3. 웹 루트 디렉토리 생성
echo ""
echo "[3/5] 웹 루트 디렉토리 생성 중..."
sudo mkdir -p /var/www/welcome2icm.com/dist
sudo mkdir -p /var/www/certbot
sudo chown -R $USER:$USER /var/www/welcome2icm.com
echo "✓ 디렉토리 생성 완료"

# 4. Nginx 설정 테스트
echo ""
echo "[4/5] Nginx 설정 테스트 중..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Nginx 설정이 올바릅니다."
    sudo systemctl reload nginx
    echo "✓ Nginx 재시작 완료"
else
    echo "✗ Nginx 설정에 오류가 있습니다. 확인해주세요."
    exit 1
fi

# 5. SSL 인증서 발급
echo ""
echo "[5/5] SSL 인증서 발급 중..."
echo "※ 주의: 도메인이 이 서버를 가리키고 있는지 확인해주세요."
echo ""
read -p "SSL 인증서를 발급하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot certonly --webroot \
        -w /var/www/certbot \
        -d welcome2icm.com \
        -d www.welcome2icm.com \
        --email admin@welcome2icm.com \
        --agree-tos \
        --no-eff-email
    
    if [ $? -eq 0 ]; then
        echo "✓ SSL 인증서 발급 완료!"
        
        # Nginx 설정 다시 로드
        sudo systemctl reload nginx
        
        echo ""
        echo "==================================="
        echo "SSL 설정이 완료되었습니다!"
        echo "==================================="
        echo "사이트 주소: https://welcome2icm.com"
        echo ""
        echo "※ 자동 갱신 설정:"
        echo "Certbot은 자동으로 인증서 갱신을 시도합니다."
        echo "갱신 테스트: sudo certbot renew --dry-run"
        echo "==================================="
    else
        echo "✗ SSL 인증서 발급 실패"
        echo "도메인 DNS 설정을 확인해주세요."
        exit 1
    fi
else
    echo "SSL 인증서 발급을 건너뜁니다."
    echo ""
    echo "나중에 발급하려면 다음 명령어를 실행하세요:"
    echo "sudo certbot certonly --webroot -w /var/www/certbot -d welcome2icm.com -d www.welcome2icm.com"
fi

