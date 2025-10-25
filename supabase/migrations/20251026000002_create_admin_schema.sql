-- 단순한 Admin 테이블 생성
CREATE TABLE IF NOT EXISTS public.admins (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_admins_id ON public.admins(id);
CREATE INDEX IF NOT EXISTS idx_admins_token ON public.admins(token);

-- 기본 admin 계정 생성 (id: admin, password: icmicm123!)
INSERT INTO public.admins (id, password)
VALUES ('admin', 'icmicm123!')
ON CONFLICT (id) DO NOTHING;

