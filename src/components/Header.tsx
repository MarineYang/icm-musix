import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleArtistClick = () => {
    navigate('/artist');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-black"
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* 로고 */}
        <div 
          className="cursor-pointer"
          onClick={handleHomeClick}
        >
          <div className="text-white text-sm font-bold tracking-wider">
            ICM MUSIX
          </div>
          <div className="text-gray-400 text-xs tracking-widest mt-1">
            RECORDS
          </div>
        </div>
        
        {/* 중앙 네비게이션 */}
        <nav className="flex items-center space-x-12">
          <button 
            onClick={handleAboutClick}
            className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider"
          >
            ABOUT
          </button>
          <button 
            onClick={handleArtistClick}
            className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider"
          >
            ARTIST
          </button>
          <button className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider">
            NOTICE
          </button>
          <button className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider">
            ICM CLOUD
          </button>
        </nav>
        
        {/* 언어 선택 */}
        <div className="flex items-center space-x-2 text-white text-sm font-medium">
          <button className="hover:text-gray-300 transition-colors duration-200">
            KOR
          </button>
          <span className="text-gray-400">/</span>
          <button className="hover:text-gray-300 transition-colors duration-200">
            ENG
          </button>
        </div>
      </div>
    </header>
  );
}