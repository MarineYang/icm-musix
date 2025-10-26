import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: number;
  post_id: number;
  author: string;
  password: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  postId: number;
  initialLikes?: number;
  initialComments?: number;
}

export default function CommentsSection({ postId, initialLikes = 0, initialComments = 0 }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [newComment, setNewComment] = useState({
    author: '',
    password: '',
    content: ''
  });
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  // 댓글 목록 불러오기
  const fetchComments = useCallback(async () => {
    try {
      
      console.log("Comments postId : ", postId);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }


      setComments(data || []);
      setCommentsCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  // 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.author || !newComment.password || !newComment.content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author: newComment.author,
            password: newComment.password,
            content: newComment.content
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        alert('댓글 작성에 실패했습니다.');
        return;
      }

      // 댓글 목록 새로고침
      await fetchComments();
      
      // 입력 필드 초기화
      setNewComment({ author: '', password: '', content: '' });
      
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
    setLoading(false);
  };

  // 좋아요 상태 확인 (localStorage 사용)
  const checkLikeStatus = useCallback(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  // 좋아요 처리
  const handleLike = async () => {
    // 이미 좋아요를 눌렀는지 확인
    if (isLiked) {
      alert('이미 좋아요를 누르셨습니다!');
      return;
    }

    // 애니메이션 시작
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      const { error } = await supabase
        .from('posts')
        .update({ like_count: likes + 1 })
        .eq('id', postId);

      if (!error) {
        setLikes(likes + 1);
        setIsLiked(true);
        
        // localStorage에 좋아요 기록 저장
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        likedPosts.push(postId);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      setIsAnimating(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 초기 댓글 로딩
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [postId, showComments, fetchComments]);

  // 컴포넌트 마운트 시 자동으로 댓글 표시 및 좋아요 상태 확인
  useEffect(() => {
    setShowComments(true);
    checkLikeStatus();
  }, [postId, checkLikeStatus]);

  return (
    <div className="w-full bg-black text-white">
      {/* 좋아요 및 댓글 카운터 */}
      <div className="flex items-center space-x-6 py-4 border-b border-gray-800">
        <motion.button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked 
              ? 'text-red-500' 
              : 'text-gray-400 hover:text-red-400'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={isAnimating ? {
              scale: [1, 1.5, 1],
              rotate: [0, -10, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.6 }}
          >
            {isLiked ? (
              <Heart className="w-5 h-5 fill-current" />
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </motion.div>
          <span className="font-medium">{likes}</span>
        </motion.button>
        
        <button
          onClick={() => {}}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{commentsCount}</span>
        </button>
        
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* 댓글 섹션 토글 */}
      <motion.div
        initial={false}
        animate={{ height: showComments ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        {showComments && (
          <div className="py-6 space-y-6">
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="이름"
                  value={newComment.author}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                  required
                />
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={newComment.password}
                  onChange={(e) => setNewComment(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <textarea
                  placeholder="댓글을 남겨주세요"
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? '작성 중...' : '작성'}
                </button>
              </div>
            </form>

            {/* 댓글 목록 */}
            <div className="space-y-4">
               {
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/30 rounded-lg p-4 border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{comment.author}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>
        )}
      </motion.div>

      {/* 댓글 펼치기/접기 버튼
      <button
        onClick={() => setShowComments(!showComments)}
        className="w-full py-3 text-gray-500 hover:text-white transition-colors border-t border-gray-800 flex items-center justify-center space-x-2"
      >
        <span>댓글 {showComments ? '접기' : '펼치기'}</span>
        {showComments ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button> */}
    </div>
  );
}
