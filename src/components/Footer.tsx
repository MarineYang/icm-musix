import { Youtube, Instagram, Twitter, Facebook, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, SocialLink } from '@/lib/supabase';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

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
    }
  };

  const getIcon = (platform: string) => {
    const iconProps = { className: "w-6 h-6" };
    
    switch (platform) {
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'website':
        return <Globe {...iconProps} />;
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

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <footer className="bg-black text-white">
      {/* Footer Info */}
      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-300">
                <p>주소 : 69, Dongsan-ro, Seocho-gu, Seoul, Republic of Korea</p>
                {/* <p>아티스트 문의 / For artist inquiries: <a href="mailto:inquiry@pnation.com" className="text-red-500 hover:underline">inquiry@pnation.com</a></p>
                <p>팬 문의 / For fan inquiries: <a href="mailto:fan@pnation.com" className="text-red-500 hover:underline">fan@pnation.com</a></p>
                <p>사업 및 제휴: <a href="mailto:business@pnation.com" className="text-red-500 hover:underline">business@pnation.com</a></p> */}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title={getPlatformName(link.platform)}
                  >
                    {getIcon(link.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors mr-6">PRIVACY POLICY</a>
            </div>
            <div className="text-gray-400 text-sm">
              Copyright © 2024 ICM Corporation. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}