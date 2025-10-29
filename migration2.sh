# .env 파일 확인
cat .env

# .env 파일이 없거나 JWT_SECRET이 없으면 생성
cat > .env << 'EOF'
POSTGRES_PASSWORD=icm1234!!
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXPIRY=3600

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

VITE_SUPABASE_URL=https://welcome2icm.com/supabase
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

API_EXTERNAL_URL=http://localhost:54321
SITE_URL=http://localhost
SUPABASE_PUBLIC_URL=http://localhost:54321

DISABLE_SIGNUP=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
EOF

# PostgREST와 Auth 재시작 (JWT Secret 적용)
docker-compose stop supabase-rest supabase-auth supabase-kong
docker-compose up -d supabase-rest supabase-auth supabase-kong

# 로그 확인
sleep 5
docker-compose logs --tail=20 supabase-rest