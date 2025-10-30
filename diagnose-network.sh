#!/bin/bash
# 네트워크 진단 스크립트

echo "🔍 ICM Musix 네트워크 진단"
echo "================================"
echo ""

echo "1️⃣ Nginx 상태 확인"
sudo systemctl status nginx | grep -E "Active|loaded"
echo ""

echo "2️⃣ 포트 리스닝 확인"
echo "80 포트:"
sudo netstat -tlnp | grep :80 || sudo ss -tlnp | grep :80
echo "443 포트:"
sudo netstat -tlnp | grep :443 || sudo ss -tlnp | grep :443
echo "33000 포트:"
sudo netstat -tlnp | grep :33000 || sudo ss -tlnp | grep :33000
echo ""

echo "3️⃣ 방화벽 상태"
sudo ufw status | grep -E "Status|80|443" || echo "ufw 비활성화"
echo ""

echo "4️⃣ iptables 규칙"
sudo iptables -L INPUT -n | grep -E "ACCEPT.*dpt:(80|443)" || echo "iptables 규칙 없음"
echo ""

echo "5️⃣ Nginx 설정 테스트"
sudo nginx -t
echo ""

echo "6️⃣ SSL 인증서 확인"
sudo certbot certificates 2>/dev/null | grep -A 5 "welcome2icm.com" || echo "Certbot 설치 안 됨"
echo ""

echo "7️⃣ Docker 컨테이너 상태"
docker-compose ps
echo ""

echo "8️⃣ 로컬 접속 테스트"
curl -I http://localhost:33000 2>&1 | head -5
echo ""

echo "9️⃣ Nginx 접속 테스트"
curl -I http://localhost 2>&1 | head -5
echo ""

echo "🔟 외부 IP 확인"
echo "서버 공인 IP: $(curl -s ifconfig.me)"
echo ""

echo "================================"
echo "✅ 진단 완료!"
echo ""
echo "📝 문제 해결 가이드:"
echo "- Nginx가 실행 중이 아니면: sudo systemctl start nginx"
echo "- 방화벽이 차단하면: sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"
echo "- SSL 인증서가 없으면: sudo certbot --nginx -d welcome2icm.com -d www.welcome2icm.com"

