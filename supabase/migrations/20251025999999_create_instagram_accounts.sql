-- ============================================
-- Instagram Accounts 스키마
-- ============================================

CREATE TABLE IF NOT EXISTS instagram_accounts (
  id BIGSERIAL PRIMARY KEY,
  handle VARCHAR(255) NOT NULL UNIQUE,
  platform VARCHAR(50) DEFAULT 'Instagram',
  image_url TEXT,
  account_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_display_order ON instagram_accounts(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_is_active ON instagram_accounts(is_active);

-- 샘플 데이터
INSERT INTO instagram_accounts (handle, platform, image_url, account_url, is_active, display_order) VALUES
  ('@pnation_audition', 'Instagram', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', 'https://www.instagram.com/pnation_audition', true, 1),
  ('@pnation.official', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/pnation.official', true, 2),
  ('@42psy42', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/42psy42', true, 3),
  ('@crush9244', 'Instagram', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', 'https://www.instagram.com/crush9244', true, 4)
ON CONFLICT DO NOTHING;
