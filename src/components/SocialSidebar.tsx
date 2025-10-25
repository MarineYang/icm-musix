import { Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, SocialLink } from '@/lib/supabase';

export default function SocialSidebar() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching social links:', error);
        return;
      }

      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (platform) {
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'tiktok':
        return (
          <svg {...iconProps} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-8 top-1/4 transform -translate-y-1/2 z-40 flex flex-col space-y-4">
      {socialLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group"
          title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}
