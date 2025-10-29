
# 시스템 정보 확인
uname -s
uname -m

# Linux x86_64인 경우 (대부분의 서버)
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose

# 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 기존 버전 제거 (optional)
sudo rm /usr/bin/docker-compose

# 심볼릭 링크 생성
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# 버전 확인
docker-compose version

# 이제 재빌드!
docker-compose down
docker-compose up -d --build frontend