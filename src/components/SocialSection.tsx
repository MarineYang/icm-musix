const socialAccounts = [
  { handle: '@pnation_audition', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', isActive: true },
  { handle: '@pnation.official', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', isActive: true },
  { handle: '@babydontcry.offcl', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', isActive: false },
  { handle: '@shinaeahn', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', isActive: true },
  { handle: '@_mariahwasa', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', isActive: true },
  { handle: '@official.tnx', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', isActive: false },
  { handle: '@42psy42', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', isActive: true },
  { handle: '@crush9244', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop', isActive: true },
  { handle: '@heizeheize', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop', isActive: false },
  { handle: '@pnation_music', platform: 'Instagram', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop', isActive: true }
];

export default function SocialSection() {
  return (
    <section className="min-h-screen py-20 bg-black flex items-center">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">FOLLOW ICM MUSIX</h2>
          <div className="w-32 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay connected with our artists and get the latest updates from the ICM MUSIX family
          </p>  
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
          {socialAccounts.map((account, index) => (
            <div 
              key={index}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="relative mb-6">
                {/* Instagram Story Ring */}
                <div className={`w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full p-1 ${
                  account.isActive 
                    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' 
                    : 'bg-gray-600'
                } group-hover:scale-105 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-full bg-black p-1">
                    <img 
                      src={account.image} 
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
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform duration-300">
            Follow All Artists
          </button>
        </div>
      </div>
    </section>
  );
}