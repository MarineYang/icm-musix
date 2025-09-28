import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CommentsSection from '@/components/CommentsSection';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
}

export default function IcmCloudPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // 게시글 불러오기
  const fetchPost = async () => {
    if (!id) return;

    try {
      // 조회수 증가
      await supabase.rpc('increment_view_count', { post_id: parseInt(id) });

      // 게시글 정보 가져오기
      const { data, error } = await supabase
        .from('app_700f7ffff6_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        navigate('/icm-cloud');
        return;
      }

      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/icm-cloud');
    }
    setLoading(false);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/icm-cloud')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>목록으로 돌아가기</span>
          </button>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* 게시글 헤더 */}
          <header className="space-y-4 pb-6 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>조회 {post.view_count}</span>
              </div>
            </div>
          </header>

          {/* 게시글 내용 */}
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 댓글 섹션 */}
          <CommentsSection 
            postId={post.id}
            initialLikes={post.like_count}
            initialComments={0}
          />
          
        </motion.article>
      </div>
    </div>
  );
}