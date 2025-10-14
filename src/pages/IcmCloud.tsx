import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, Post } from '@/lib/supabase';

const POSTS_PER_PAGE = 10;

export default function IcmCloud() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [currentPage, activeSearchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('app_700f7ffff6_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);

      if (activeSearchTerm) {
        query = query.or(`title.ilike.%${activeSearchTerm}%,content.ilike.%${activeSearchTerm}%,author.ilike.%${activeSearchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
      setTotalPages(Math.ceil((count || 0) / POSTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Header Section */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-8">
          <motion.h1 
            className="text-4xl md:text-6xl font-black text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ICM CLOUD
          </motion.h1>
          
          <motion.div
            className="space-y-4 text-gray-300 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg">
              <strong>◀ICM CLOUD 이용 시 주의사항 안내▶</strong>
            </p>
            <p>
              본 게시판은 ICM의 팬 혹은 아티스트 지망생들이 자유롭게 본인의 음악을 공유할 수 있는 페이지로
              플랫폼의 개인정보(성명, 휴대전화번호, 이메일 등) 를 포함한 개인정보의 등록을 금지합니다.
            </p>
            <p>
              개인의 온정 취지에 부합하지 않는 게시물은 관리자에 의해 삭제 처리 될 수 있으니, 이용에 참고하시기 바랍니다.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="container mx-auto px-8 py-8">
        <div className="bg-black border-t border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-black text-gray-400 text-sm font-medium border-b border-gray-700">
            <div className="col-span-1 text-center">INDEX</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-2">NAME</div>
            <div className="col-span-2">DATE</div>
            <div className="col-span-1 text-center">VIEW</div>
            <div className="col-span-1 text-center">LIKE</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-900 transition-colors cursor-pointer"
                  onClick={() => navigate(`/icm-cloud/post/${post.id}`)}
                >
                  <div className="col-span-1 text-center text-gray-400">{post.id}</div>
                  <div className="col-span-5 text-white">
                    {post.title}
                  </div>
                  <div className="col-span-2 text-gray-400 truncate">{post.author}</div>
                  <div className="col-span-2 text-gray-400">{formatDate(post.created_at)}</div>
                  <div className="col-span-1 text-center text-gray-400">{post.view_count}</div>
                  <div className="col-span-1 text-center text-gray-400">{post.like_count}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Search and Write Button */}
        <div className="flex justify-between items-center mt-8">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-4 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <Link
            to="/icm-cloud/write"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded border border-gray-600 transition-colors"
          >
            글쓰기
          </Link>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}