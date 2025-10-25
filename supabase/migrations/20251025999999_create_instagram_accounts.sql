-- Create instagram_accounts table
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_display_order ON instagram_accounts(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_is_active ON instagram_accounts(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to instagram_accounts"
  ON instagram_accounts
  FOR SELECT
  TO public
  USING (true);

-- Create policy for public insert access (for admin functionality)
CREATE POLICY "Allow public insert access to instagram_accounts"
  ON instagram_accounts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access to instagram_accounts"
  ON instagram_accounts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access to instagram_accounts"
  ON instagram_accounts
  FOR DELETE
  TO public
  USING (true);

-- Insert existing social accounts data
INSERT INTO instagram_accounts (handle, platform, image_url, account_url, is_active, display_order) VALUES
  ('@pnation_audition', 'Instagram', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', 'https://www.instagram.com/pnation_audition', true, 1),
  ('@pnation.official', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/pnation.official', true, 2),
  ('@babydontcry.offcl', 'Instagram', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'https://www.instagram.com/babydontcry.offcl', false, 3),
  ('@shinaeahn', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/shinaeahn', true, 4),
  ('@_mariahwasa', 'Instagram', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', 'https://www.instagram.com/_mariahwasa', true, 5),
  ('@official.tnx', 'Instagram', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'https://www.instagram.com/official.tnx', false, 6),
  ('@42psy42', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/42psy42', true, 7),
  ('@crush9244', 'Instagram', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', 'https://www.instagram.com/crush9244', true, 8),
  ('@heizeheize', 'Instagram', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', 'https://www.instagram.com/heizeheize', false, 9),
  ('@pnation_music', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/pnation_music', true, 10),
  ('@pauljosephkim', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/pauljosephkim', true, 11),
  ('@shyni.eahn', 'Instagram', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', 'https://www.instagram.com/shyni.eahn', true, 12);
