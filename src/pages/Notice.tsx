import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pin } from 'lucide-react';
import { supabase, Notice } from '@/lib/supabase';

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notices:', error);
        return;
      }

      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // 조회수 증가
      await supabase
        .from('notices')
        .update({ view_count: notices.find(n => n.id === id)!.view_count + 1 })
        .eq('id', id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            NOTICE
          </motion.h1>
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">등록된 공지사항이 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 md:pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-6xl font-black text-white mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          NOTICE
        </motion.h1>

        {/* Notice List */}
        <motion.div
          className="space-y-3 md:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {notices.map((notice, index) => (
            <motion.div
              key={notice.id}
              className={`border ${notice.is_pinned ? 'border-white/40' : 'border-gray-800'} rounded-lg overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              {/* Notice Header */}
              <button
                onClick={() => handleToggle(notice.id)}
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-900/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {notice.is_pinned && (
                    <Pin className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base md:text-lg font-medium truncate ${notice.is_pinned ? 'text-white' : 'text-gray-200'}`}>
                      {notice.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs md:text-sm text-gray-500">
                      <span>{formatDate(notice.created_at)}</span>
                      <span>조회 {notice.view_count}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedId === notice.id ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Notice Content */}
              <AnimatePresence>
                {expandedId === notice.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-gray-800">
                      <div
                        className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
