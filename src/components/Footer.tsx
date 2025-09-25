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
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-2xl">📘</a>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-2xl">📺</a>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors text-2xl">📷</a>
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