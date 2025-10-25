import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleArtistClick = () => {
    navigate('/artist');
  };

  const handleNoticeClick = () => {
    navigate('/notice');
  };

  const handleIcmCloudClick = () => {
    navigate('/icm-cloud');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-black"
    >
      <div className="flex items-center justify-center px-8 py-4 relative">
        {/* 로고 - 왼쪽 절대 위치 */}
        <div 
          className="cursor-pointer absolute left-8"
          onClick={handleHomeClick}
        >
          <div className="text-white text-sm font-bold tracking-wider">
            ICM
          </div>
          <div className="text-gray-400 text-xs tracking-widest mt-1">
            RECORDS
          </div>
        </div>
        
        {/* 중앙 네비게이션 */}
        <nav className="flex items-center space-x-20">
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
          <button 
            onClick={handleNoticeClick}
            className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider"
          >
            NOTICE
          </button>
          <button 
          onClick={handleIcmCloudClick}
          className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider">
            ICM CLOUD
          </button>
        </nav>
      </div>
    </header>
  );
}