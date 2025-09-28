import { Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Footer Info */}
      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-300">
                <p>서울특별시 강남구 논현로 151길 21 (신사동)</p>
                <p>아티스트 문의 / For artist inquiries: <a href="mailto:inquiry@pnation.com" className="text-red-500 hover:underline">inquiry@pnation.com</a></p>
                <p>팬 문의 / For fan inquiries: <a href="mailto:fan@pnation.com" className="text-red-500 hover:underline">fan@pnation.com</a></p>
                <p>사업 및 제휴: <a href="mailto:business@pnation.com" className="text-red-500 hover:underline">business@pnation.com</a></p>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  title="TikTok"
                >
                  {/* TikTok 아이콘은 SVG로 직접 구현 */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.2a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z"/>
                  </svg>
                </a>
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