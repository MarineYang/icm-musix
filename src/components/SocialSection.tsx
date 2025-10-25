import React, { useState, useEffect } from 'react';
import { supabase, InstagramAccount } from '@/lib/supabase';

const SocialSection = () => {
  const [socialAccounts, setSocialAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Supabase에서 Instagram 계정 정보 가져오기
  useEffect(() => {
    fetchInstagramAccounts();
  }, []);

  const fetchInstagramAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching instagram accounts:', error);
        return;
      }

      setSocialAccounts(data || []);
    } catch (error) {
      console.error('Error fetching instagram accounts:', error);
    }
    setLoading(false);
  };

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleAccountClick = (accountUrl: string | null) => {
    if (accountUrl) {
      window.open(accountUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const visibleAccounts = showAll ? socialAccounts : socialAccounts.slice(0, 10);

  if (loading) {
    return (
      <section className="min-h-screen py-20 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-20 bg-black flex items-center">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">FOLLOW ICM</h2>
          <div className="w-32 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay connected with our artists and get the latest updates from the ICM family
          </p>  
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {visibleAccounts.map((account) => (
            <div 
              key={account.id}
              className="group cursor-pointer flex flex-col items-center"
              onClick={() => handleAccountClick(account.account_url)}
            >
              <div className="relative mb-6">
                {/* Instagram Story Ring */}
                <div className={`w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full p-1 ${
                  account.is_active 
                    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
                    : 'bg-gray-600'
                } group-hover:scale-105 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-full bg-black p-1">
                    <img 
                      src={account.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop'} 
                      alt={account.handle}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Instagram Icon Overlay */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">📷</span>
                </div>
              </div>
              
              {/* Handle */}
              <div className="text-center">
                <div className="text-white text-base font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {account.handle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {socialAccounts.length > 10 && (
          <div className="text-center mt-16">
            <button 
              className="bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform duration-300"
              onClick={handleToggleShowAll}
            >
              {showAll ? 'Show Less' : 'Follow All Artists'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialSection;
