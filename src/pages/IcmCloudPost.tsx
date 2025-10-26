import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CommentsSection from '@/components/CommentsSection';
import DOMPurify from 'dompurify';

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
        .from('posts')
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div 
              className="text-gray-300 leading-relaxed rich-text-content"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ADD_TAGS: ['iframe'],
                  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
                })
              }}
            />
          </div>
          
          {/* 리치 텍스트 콘텐츠 스타일 */}
          <style>{`
            .rich-text-content h1 {
              font-size: 2em;
              font-weight: bold;
              margin: 0.67em 0;
              color: white;
            }

            .rich-text-content h2 {
              font-size: 1.5em;
              font-weight: bold;
              margin: 0.75em 0;
              color: white;
            }

            .rich-text-content h3 {
              font-size: 1.17em;
              font-weight: bold;
              margin: 0.83em 0;
              color: white;
            }

            .rich-text-content p {
              margin: 1em 0;
              line-height: 1.6;
            }

            .rich-text-content ul,
            .rich-text-content ol {
              padding-left: 1.5rem;
              margin: 1rem 0;
            }

            .rich-text-content ul {
              list-style-type: disc;
            }

            .rich-text-content ol {
              list-style-type: decimal;
            }

            .rich-text-content li {
              margin: 0.5em 0;
            }

            .rich-text-content blockquote {
              border-left: 4px solid #4b5563;
              padding-left: 1rem;
              margin: 1rem 0;
              color: #9ca3af;
            }

            .rich-text-content code {
              background-color: #1f2937;
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.875em;
              color: #f472b6;
              font-family: 'Courier New', monospace;
            }

            .rich-text-content pre {
              background: #111827;
              border-radius: 0.5rem;
              padding: 1rem;
              margin: 1rem 0;
              overflow-x: auto;
            }

            .rich-text-content pre code {
              background: none;
              color: #e5e7eb;
              padding: 0;
              font-size: 0.875rem;
            }

            .rich-text-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1rem 0;
            }

            .rich-text-content a {
              color: #60a5fa;
              text-decoration: underline;
            }

            .rich-text-content a:hover {
              color: #93c5fd;
            }

            .rich-text-content strong {
              font-weight: bold;
            }

            .rich-text-content em {
              font-style: italic;
            }

            .rich-text-content u {
              text-decoration: underline;
            }

            .rich-text-content s {
              text-decoration: line-through;
            }

            .rich-text-content iframe {
              max-width: 100%;
              border-radius: 0.5rem;
              margin: 1rem 0;
            }
          `}</style>

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