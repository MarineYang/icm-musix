# 서버에서 실행
docker exec -i icm-supabase-db psql -U postgres -d icm_db <<'EOSQL'
-- 버킷 확인
SELECT * FROM storage.buckets;

-- 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('post-images', 'post-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 확인
SELECT * FROM storage.buckets;
EOSQL