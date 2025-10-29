# 서버에서 실행
cd /work/icm-musix

# 1. Kong이 직접 요청을 받을 때 (apikey 포함)
curl -v -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  http://127.0.0.1:54321/rest/v1/artists

# 2. Nginx를 통한 요청
curl -v -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  https://welcome2icm.com/supabase/rest/v1/artists -k

# 3. Nginx 설정 파일이 제대로 적용되었는지 확인
sudo cat /etc/nginx/sites-available/welcome2icm.com | grep -A 10 "location /supabase/"

# 4. PostgREST 환경변수 확인
docker exec icm-supabase-rest env | grep PGRST

# 5. .env 파일 확인
cat .env