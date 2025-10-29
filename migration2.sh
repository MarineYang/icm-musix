docker-compose build --no-cache \
  --build-arg VITE_SUPABASE_URL=https://welcome2icm.com/supabase \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0 \
  frontend

docker-compose up -d frontend

# 빌드 완료 후 확인
docker exec icm-musix-frontend sh -c "cat /usr/share/nginx/html/assets/*.js" | grep -o 'welcome2icm.com/supabase' | head -1

# API Key 확인
docker exec icm-musix-frontend sh -c "cat /usr/share/nginx/html/assets/*.js" | grep -o 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' | head -1

curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
  https://welcome2icm.com/supabase/rest/v1/artists