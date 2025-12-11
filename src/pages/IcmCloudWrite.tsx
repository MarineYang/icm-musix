import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';

export default function IcmCloudWrite() {
  const [formData, setFormData] = useState({
    author: '',
    password: '',
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author || !formData.password || !formData.title || !formData.content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            author: formData.author,
            password: formData.password,
            view_count: 0,
            like_count: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      alert('게시글이 성공적으로 등록되었습니다.');
      navigate('/icm-cloud');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-8 md:pt-28">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl w-full">
        <motion.form
          id="post-form"
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Author and Password - Clean inline layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">작성자</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          </div>

          {/* Title - Clean and minimal */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">내용</label>
            
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="내용을 입력해주세요..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4 pt-8">
            <button
              type="button"
              onClick={() => navigate('/icm-cloud')}
              className="flex items-center space-x-2 px-8 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-colors rounded-lg"
            >
              <X className="w-4 h-4" />
              <span>취소</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={() => console.log('💾 저장 버튼 클릭됨!')}
              className="flex items-center space-x-2 px-8 py-3 bg-white text-black hover:bg-gray-100 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? '저장 중...' : '저장하기'}</span>
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}