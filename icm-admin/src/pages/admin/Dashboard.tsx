import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { FileText, Users, Video, Instagram } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import { Post } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    artists: 0,
    videos: 0,
    instagram: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [postsRes, artistsRes, videosRes, instagramRes, recentPostsRes] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('artists').select('*', { count: 'exact', head: true }),
        supabase.from('youtube_videos').select('*', { count: 'exact', head: true }),
        supabase.from('instagram_accounts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      setStats({
        posts: postsRes.count || 0,
        artists: artistsRes.count || 0,
        videos: videosRes.count || 0,
        instagram: instagramRes.count || 0,
      });

      setRecentPosts(recentPostsRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.posts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.artists}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.videos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Instagram Accounts</CardTitle>
              <Instagram className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.instagram}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : recentPosts.length === 0 ? (
                <p className="text-gray-500">No posts yet</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-gray-500">by {post.author}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}