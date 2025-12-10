import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAboutClick = () => {
    navigate('/about');
    setIsMenuOpen(false);
  };

  const handleArtistClick = () => {
    navigate('/artist');
    setIsMenuOpen(false);
  };

  const handleNoticeClick = () => {
    navigate('/notice');
    setIsMenuOpen(false);
  };

  const handleIcmCloudClick = () => {
    navigate('/icm-cloud');
    setIsMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="flex items-center justify-between md:justify-center px-4 md:px-8 py-4 relative">
        {/* 로고 - 왼쪽 */}
        <div
          className="cursor-pointer md:absolute md:left-8"
          onClick={handleHomeClick}
        >
          <div className="text-white text-sm font-bold tracking-wider">
            ICM
          </div>
          <div className="text-gray-400 text-xs tracking-widest mt-1">
            RECORDS
          </div>
        </div>

        {/* 햄버거 메뉴 버튼 - 모바일 */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-20">
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
            className="text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium tracking-wider"
          >
            ICM CLOUD
          </button>
        </nav>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <nav className="flex flex-col py-4">
            <button
              onClick={handleAboutClick}
              className="text-white hover:bg-gray-900 transition-colors duration-200 text-sm font-medium tracking-wider py-4 px-6 text-left"
            >
              ABOUT
            </button>
            <button
              onClick={handleArtistClick}
              className="text-white hover:bg-gray-900 transition-colors duration-200 text-sm font-medium tracking-wider py-4 px-6 text-left"
            >
              ARTIST
            </button>
            <button
              onClick={handleNoticeClick}
              className="text-white hover:bg-gray-900 transition-colors duration-200 text-sm font-medium tracking-wider py-4 px-6 text-left"
            >
              NOTICE
            </button>
            <button
              onClick={handleIcmCloudClick}
              className="text-white hover:bg-gray-900 transition-colors duration-200 text-sm font-medium tracking-wider py-4 px-6 text-left"
            >
              ICM CLOUD
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}