import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Post, Artist, YoutubeVideo, InstagramAccount, SocialLink } from '@/types';
import { Trash2, Edit, Plus, Search, Instagram, Youtube, Twitter, Facebook, Globe } from 'lucide-react';

// 이미지 리사이징 함수
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 리사이징
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, file.type, 0.9); // 90% 품질
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function Content() {
  const [activeTab, setActiveTab] = useState('posts');

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // Artists state
  const [artists, setArtists] = useState<Artist[]>([]);
  const [deleteArtistId, setDeleteArtistId] = useState<string | null>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false);
  const [artistImages, setArtistImages] = useState<string[]>(['', '', '']);
  const [artistVideos, setArtistVideos] = useState<Array<{ video_id: string; title: string, thumbnail_url: string }>>([{ video_id: '', title: '', thumbnail_url: '' }]);

  // Videos state
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [deleteVideoId, setDeleteVideoId] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // Instagram state
  const [instagramAccounts, setInstagramAccounts] = useState<InstagramAccount[]>([]);
  const [deleteInstagramId, setDeleteInstagramId] = useState<number | null>(null);
  const [editingInstagram, setEditingInstagram] = useState<InstagramAccount | null>(null);
  const [isInstagramDialogOpen, setIsInstagramDialogOpen] = useState(false);

  // Social Links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [deleteSocialLinkId, setDeleteSocialLinkId] = useState<number | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [isSocialLinkDialogOpen, setIsSocialLinkDialogOpen] = useState(false);

  useEffect(() => {
    loadPosts();
    loadArtists();
    loadVideos();
    loadInstagram();
    loadSocialLinks();
  }, []);

  // Posts functions
  const loadPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('게시글 로드 실패');
      return;
    }
    setPosts(data || []);
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;
    
    const { error } = await supabase.from('posts').delete().eq('id', deletePostId);
    if (error) {
      toast.error('게시글 삭제 실패');
      return;
    }
    
    toast.success('게시글이 삭제되었습니다');
    setDeletePostId(null);
    loadPosts();
  };

  const handleSavePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      password: formData.get('password') as string,
    };

    if (editingPost) {
      const { error } = await supabase.from('posts').update(postData).eq('id', editingPost.id);
      if (error) {
        toast.error('게시글 수정 실패');
        return;
      }
      toast.success('게시글이 수정되었습니다');
    } else {
      const { error } = await supabase.from('posts').insert([postData]);
      if (error) {
        toast.error('게시글 추가 실패');
        return;
      }
      toast.success('게시글이 추가되었습니다');
    }

    setIsPostDialogOpen(false);
    setEditingPost(null);
    loadPosts();
  };

  // Artists functions
  const loadArtists = async () => {
    const { data, error } = await supabase.from('artists').select('*').order('display_order');
    if (error) {
      toast.error('아티스트 로드 실패');
      return;
    }
    setArtists(data || []);
  };

  const loadArtistDetails = async (artistId: string) => {
    // 이미지 로드
    const { data: images } = await supabase
      .from('artist_images')
      .select('*')
      .eq('artist_id', artistId)
      .order('display_order');
    
    const imageUrls = ['', '', ''];
    if (images) {
      images.forEach((img, idx) => {
        if (idx < 3) imageUrls[idx] = img.image_url;
      });
    }
    setArtistImages(imageUrls);

    // 비디오 로드
    const { data: videos } = await supabase
      .from('artist_videos')
      .select('*')
      .eq('artist_id', artistId)
      .order('display_order');
    
    if (videos && videos.length > 0) {
      setArtistVideos(videos.map(v => ({ video_id: v.video_id, title: v.title, thumbnail_url: v.thumbnail_url})));
    } else {
      setArtistVideos([{ video_id: '', title: '', thumbnail_url: '' }]);
    }
  };

  const handleDeleteArtist = async () => {
    if (!deleteArtistId) return;
    
    const { error } = await supabase.from('artists').delete().eq('id', deleteArtistId);
    if (error) {
      toast.error('아티스트 삭제 실패');
      return;
    }
    
    toast.success('아티스트가 삭제되었습니다');
    setDeleteArtistId(null);
    loadArtists();
  };

  const handleSaveArtist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const baseArtistData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      profile_image: formData.get('profile_image') as string || null,
      youtube_url: formData.get('youtube_url') as string || null,
      instagram_url: formData.get('instagram_url') as string || null,
      facebook_url: formData.get('facebook_url') as string || null,
      twitter_url: formData.get('twitter_url') as string || null,
      is_active: formData.get('is_active') === 'on',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    let artistId: string;

    if (editingArtist) {
      artistId = editingArtist.id;
      const { error } = await supabase.from('artists').update(baseArtistData).eq('id', editingArtist.id);
      if (error) {
        toast.error('아티스트 수정 실패');
        console.error(error);
        return;
      }
      
      // 기존 이미지와 비디오 삭제
      await supabase.from('artist_images').delete().eq('artist_id', artistId);
      await supabase.from('artist_videos').delete().eq('artist_id', artistId);
    } else {
      // 새 아티스트 추가 시 id 필드 포함
      artistId = (formData.get('id') as string).toLowerCase().replace(/\s+/g, '');
      const newArtistData = {
        ...baseArtistData,
        id: artistId,
      };
      const { error } = await supabase.from('artists').insert([newArtistData]);
      if (error) {
        toast.error('아티스트 추가 실패');
        console.error(error);
        return;
      }
    }

    // 이미지 저장 (3개)
    const imagesToSave = artistImages
      .filter(url => url.trim() !== '')
      .map((url, index) => ({
        artist_id: artistId,
        image_url: url,
        display_order: index + 1,
      }));

    if (imagesToSave.length > 0) {
      const { error: imageError } = await supabase.from('artist_images').insert(imagesToSave);
      if (imageError) {
        console.error('이미지 저장 실패:', imageError);
      }
    }

    // 비디오 저장
    const videosToSave = artistVideos
      .filter(video => video.video_id.trim() !== '' && video.title.trim() !== '')
      .map((video, index) => ({
        artist_id: artistId,
        video_id: video.video_id,
        title: video.title,
        thumbnail_url: `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
        display_order: index + 1,
      }));

    if (videosToSave.length > 0) {
      const { error: videoError } = await supabase.from('artist_videos').insert(videosToSave);
      if (videoError) {
        console.error('비디오 저장 실패:', videoError);
      }
    }

    toast.success(editingArtist ? '아티스트가 수정되었습니다' : '아티스트가 추가되었습니다');
    setIsArtistDialogOpen(false);
    setEditingArtist(null);
    setArtistImages(['', '', '']);
    setArtistVideos([{ video_id: '', title: '', thumbnail_url: '' }]);
    loadArtists();
  };

  // Videos functions
  const loadVideos = async () => {
    const { data, error } = await supabase.from('youtube_videos').select('*').order('display_order');
    if (error) {
      toast.error('비디오 로드 실패');
      return;
    }
    setVideos(data || []);
  };

  const handleDeleteVideo = async () => {
    if (!deleteVideoId) return;
    
    const { error } = await supabase.from('youtube_videos').delete().eq('id', deleteVideoId);
    if (error) {
      toast.error('비디오 삭제 실패');
      return;
    }
    
    toast.success('비디오가 삭제되었습니다');
    setDeleteVideoId(null);
    loadVideos();
  };

  const handleSaveVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const videoData = {
      video_id: formData.get('video_id') as string,
      title: formData.get('title') as string,
      thumbnail_url: formData.get('thumbnail_url') as string,
      is_active: formData.get('is_active') === 'on',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingVideo) {
      const { error } = await supabase.from('youtube_videos').update(videoData).eq('id', editingVideo.id);
      if (error) {
        toast.error('비디오 수정 실패');
        return;
      }
      toast.success('비디오가 수정되었습니다');
    } else {
      const { error } = await supabase.from('youtube_videos').insert([videoData]);
      if (error) {
        toast.error('비디오 추가 실패');
        return;
      }
      toast.success('비디오가 추가되었습니다');
    }

    setIsVideoDialogOpen(false);
    setEditingVideo(null);
    loadVideos();
  };

  // Instagram functions
  const loadInstagram = async () => {
    const { data, error } = await supabase.from('instagram_accounts').select('*').order('display_order');
    if (error) {
      toast.error('인스타그램 계정 로드 실패');
      return;
    }
    setInstagramAccounts(data || []);
  };

  const handleDeleteInstagram = async () => {
    if (!deleteInstagramId) return;
    
    const { error } = await supabase.from('instagram_accounts').delete().eq('id', deleteInstagramId);
    if (error) {
      toast.error('인스타그램 계정 삭제 실패');
      return;
    }
    
    toast.success('인스타그램 계정이 삭제되었습니다');
    setDeleteInstagramId(null);
    loadInstagram();
  };

  const handleSaveInstagram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const instagramData = {
      handle: formData.get('handle') as string,
      platform: formData.get('platform') as string || 'Instagram',
      image_url: formData.get('image_url') as string,
      account_url: formData.get('account_url') as string,
      is_active: formData.get('is_active') === 'on',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingInstagram) {
      const { error } = await supabase.from('instagram_accounts').update(instagramData).eq('id', editingInstagram.id);
      if (error) {
        toast.error('인스타그램 계정 수정 실패');
        console.error(error);
        return;
      }
      toast.success('인스타그램 계정이 수정되었습니다');
    } else {
      const { error } = await supabase.from('instagram_accounts').insert([instagramData]);
      if (error) {
        toast.error('인스타그램 계정 추가 실패');
        console.error(error);
        return;
      }
      toast.success('인스타그램 계정이 추가되었습니다');
    }

    setIsInstagramDialogOpen(false);
    setEditingInstagram(null);
    loadInstagram();
  };

  // Social Links functions
  const loadSocialLinks = async () => {
    const { data, error } = await supabase.from('social_links').select('*').order('display_order');
    if (error) {
      toast.error('소셜 링크 로드 실패');
      return;
    }
    setSocialLinks(data || []);
  };

  const handleDeleteSocialLink = async () => {
    if (!deleteSocialLinkId) return;
    
    const { error } = await supabase.from('social_links').delete().eq('id', deleteSocialLinkId);
    if (error) {
      toast.error('소셜 링크 삭제 실패');
      return;
    }
    
    toast.success('소셜 링크가 삭제되었습니다');
    setDeleteSocialLinkId(null);
    loadSocialLinks();
  };

  const [socialLinkPlatform, setSocialLinkPlatform] = useState<string>('instagram');

  const handleSaveSocialLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const socialLinkData = {
      platform: socialLinkPlatform,
      url: formData.get('url') as string,
      is_active: formData.get('is_active') === 'on',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    if (editingSocialLink) {
      const { error } = await supabase.from('social_links').update(socialLinkData).eq('id', editingSocialLink.id);
      if (error) {
        toast.error('소셜 링크 수정 실패');
        console.error(error);
        return;
      }
      toast.success('소셜 링크가 수정되었습니다');
    } else {
      const { error } = await supabase.from('social_links').insert([socialLinkData]);
      if (error) {
        toast.error('소셜 링크 추가 실패');
        console.error(error);
        return;
      }
      toast.success('소셜 링크가 추가되었습니다');
    }

    setIsSocialLinkDialogOpen(false);
    setEditingSocialLink(null);
    setSocialLinkPlatform('instagram');
    loadSocialLinks();
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'twitter':
        return 'bg-blue-100 text-blue-800';
      case 'facebook':
        return 'bg-indigo-100 text-indigo-800';
      case 'tiktok':
        return 'bg-purple-100 text-purple-800';
      case 'website':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingPost(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSavePost} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={editingPost?.title} required />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" defaultValue={editingPost?.content} rows={6} required />
                      </div>
                      <div>
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" name="author" defaultValue={editingPost?.author} required />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" defaultValue={editingPost?.password} required />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{new Date(post.created_at).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell>{post.view_count}</TableCell>
                      <TableCell>{post.like_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingPost(post);
                              setIsPostDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Artists</h2>
                <Dialog open={isArtistDialogOpen} onOpenChange={setIsArtistDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingArtist(null);
                      setArtistImages(['', '', '']);
                      setArtistVideos([{ video_id: '', title: '', thumbnail_url: '' }]);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Artist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveArtist} className="space-y-4">
                      {!editingArtist && (
                        <div>
                          <Label htmlFor="id">ID (영문 소문자, 숫자만)</Label>
                          <Input id="id" name="id" placeholder="예: psy, crush" required />
                          <p className="text-xs text-gray-500 mt-1">고유 식별자로 사용됩니다. 영문 소문자와 숫자만 가능합니다.</p>
                        </div>
                      )}
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={editingArtist?.name} required />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={editingArtist?.description} rows={3} required />
                      </div>
                      <div>
                        <Label htmlFor="profile_image">Profile Image URL</Label>
                        <Input id="profile_image" name="profile_image" defaultValue={editingArtist?.profile_image || ''} />
                      </div>

                      {/* 이미지 3개 업로드 */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-base font-semibold">Gallery Images (3개)</Label>
                          <p className="text-sm text-gray-500">아티스트 갤러리에 표시될 이미지 3개를 입력하세요</p>
                        </div>
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`image_${index}`} className="font-medium">Image {index + 1}</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Input
                                  id={`image_${index}`}
                                  value={artistImages[index]}
                                  onChange={(e) => {
                                    const newImages = [...artistImages];
                                    newImages[index] = e.target.value;
                                    setArtistImages(newImages);
                                  }}
                                  placeholder="https://... 또는 /workspace/uploads/..."
                                />
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                className="w-40"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    toast.info('이미지 업로드 중...');
                                    
                                    try {
                                      // 이미지 리사이징 (최대 1920x1080)
                                      const resizedFile = await resizeImage(file, 1920, 1080);
                                      
                                      // Supabase Storage에 업로드
                                      const fileExt = file.name.split('.').pop();
                                      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                                      const filePath = `artist-images/${fileName}`;
                                      
                                      const { data, error } = await supabase.storage
                                        .from('post-images')
                                        .upload(filePath, resizedFile, {
                                          cacheControl: '3600',
                                          upsert: false
                                        });
                                      
                                      if (error) throw error;
                                      
                                      // Public URL 가져오기
                                      const { data: { publicUrl } } = supabase.storage
                                        .from('post-images')
                                        .getPublicUrl(filePath);
                                      
                                      const newImages = [...artistImages];
                                      newImages[index] = publicUrl;
                                      setArtistImages(newImages);
                                      toast.success('이미지 업로드 완료!');
                                    } catch (error) {
                                      console.error('Upload error:', error);
                                      toast.error('이미지 업로드 실패');
                                    }
                                  }
                                }}
                              />
                            </div>
                            {artistImages[index] && (
                              <div className="mt-1">
                                <img 
                                  src={artistImages[index]} 
                                  alt={`Preview ${index + 1}`} 
                                  className="h-20 w-20 object-cover rounded border"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* YouTube 비디오 동적 추가 */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base font-semibold">YouTube Videos</Label>
                            <p className="text-sm text-gray-500">아티스트의 뮤직비디오를 추가하세요</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setArtistVideos([...artistVideos, { video_id: '', title: '', thumbnail_url: '' }])}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Video
                          </Button>
                        </div>
                        {artistVideos.map((video, index) => (
                          <div key={index} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Video {index + 1}</Label>
                              {artistVideos.length > 1 && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                  onClick={() => {
                                    const newVideos = artistVideos.filter((_, i) => i !== index);
                                    setArtistVideos(newVideos);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor={`video_url_${index}`} className="text-sm">Video URL</Label>
                                <Input
                                  id={`video_url_${index}`}
                                  value={video.thumbnail_url}
                                  onChange={(e) => {
                                    const newVideos = [...artistVideos];
                                    newVideos[index].thumbnail_url = e.target.value;
                                    setArtistVideos(newVideos);
                                  }}
                                  placeholder={video.thumbnail_url}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`video_title_${index}`} className="text-sm">Title</Label>
                                <Input
                                  id={`video_title_${index}`}
                                  value={video.title}
                                  onChange={(e) => {
                                    const newVideos = [...artistVideos];
                                    newVideos[index].title = e.target.value;
                                    setArtistVideos(newVideos);
                                  }}
                                  placeholder="Video Title"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="youtube_url">YouTube URL</Label>
                          <Input id="youtube_url" name="youtube_url" defaultValue={editingArtist?.youtube_url || ''} />
                        </div>
                        <div>
                          <Label htmlFor="instagram_url">Instagram URL</Label>
                          <Input id="instagram_url" name="instagram_url" defaultValue={editingArtist?.instagram_url || ''} />
                        </div>
                        <div>
                          <Label htmlFor="facebook_url">Facebook URL</Label>
                          <Input id="facebook_url" name="facebook_url" defaultValue={editingArtist?.facebook_url || ''} />
                        </div>
                        <div>
                          <Label htmlFor="twitter_url">Twitter URL</Label>
                          <Input id="twitter_url" name="twitter_url" defaultValue={editingArtist?.twitter_url || ''} />
                        </div>
                        <div>
                          <Label htmlFor="display_order">Display Order</Label>
                          <Input id="display_order" name="display_order" type="number" defaultValue={editingArtist?.display_order || 0} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="is_active" name="is_active" defaultChecked={editingArtist?.is_active ?? true} />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsArtistDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell className="font-mono text-sm">{artist.id}</TableCell>
                      <TableCell>
                        {artist.profile_image ? (
                          <img src={artist.profile_image} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{artist.name}</TableCell>
                      <TableCell className="max-w-md truncate">{artist.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${artist.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {artist.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{artist.display_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              setEditingArtist(artist);
                              await loadArtistDetails(artist.id);
                              setIsArtistDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteArtistId(artist.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Homepage Videos</h2>
                <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingVideo(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveVideo} className="space-y-4">
                      <div>
                        <Label htmlFor="video_id">YouTube Video ID</Label>
                        <Input id="video_id" name="video_id" defaultValue={editingVideo?.video_id} required />
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={editingVideo?.title} required />
                      </div>
                      <div>
                        <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                        <Input id="thumbnail_url" name="thumbnail_url" defaultValue={editingVideo?.thumbnail_url} required />
                      </div>
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input id="display_order" name="display_order" type="number" defaultValue={editingVideo?.display_order || 0} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="is_active" name="is_active" defaultChecked={editingVideo?.is_active ?? true} />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Video ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <img src={video.thumbnail_url} alt={video.title} className="w-20 h-12 object-cover rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{video.video_id}</TableCell>
                      <TableCell>{video.display_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${video.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {video.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingVideo(video);
                              setIsVideoDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteVideoId(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Instagram Tab */}
          <TabsContent value="instagram">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Instagram Accounts</h2>
                <Dialog open={isInstagramDialogOpen} onOpenChange={setIsInstagramDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingInstagram(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingInstagram ? 'Edit Instagram Account' : 'Add New Instagram Account'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveInstagram} className="space-y-4">
                      <div>
                        <Label htmlFor="handle">Handle</Label>
                        <Input id="handle" name="handle" placeholder="@username" defaultValue={editingInstagram?.handle} required />
                      </div>
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Input id="platform" name="platform" defaultValue={editingInstagram?.platform || 'Instagram'} required />
                      </div>
                      <div>
                        <Label htmlFor="image_url">Profile Image URL</Label>
                        <Input id="image_url" name="image_url" defaultValue={editingInstagram?.image_url} required />
                      </div>
                      <div>
                        <Label htmlFor="account_url">Account URL</Label>
                        <Input id="account_url" name="account_url" defaultValue={editingInstagram?.account_url} required />
                      </div>
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input id="display_order" name="display_order" type="number" defaultValue={editingInstagram?.display_order || 0} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="is_active" name="is_active" defaultChecked={editingInstagram?.is_active ?? true} />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsInstagramDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instagramAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4">
                    <img src={account.image_url} alt={account.handle} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{account.handle}</h3>
                    <p className="text-sm text-gray-600 mb-2 truncate">{account.account_url}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {account.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm text-gray-500">Order: {account.display_order}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditingInstagram(account);
                          setIsInstagramDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleteInstagramId(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Social Media Links</h2>
                <Dialog open={isSocialLinkDialogOpen} onOpenChange={setIsSocialLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingSocialLink(null);
                      setSocialLinkPlatform('instagram');
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Social Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingSocialLink ? 'Edit Social Link' : 'Add New Social Link'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveSocialLink} className="space-y-4">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select 
                          value={socialLinkPlatform} 
                          onValueChange={setSocialLinkPlatform}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="플랫폼 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="website">Website (자사 사이트)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" name="url" type="url" placeholder="https://..." defaultValue={editingSocialLink?.url} required />
                      </div>
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input id="display_order" name="display_order" type="number" defaultValue={editingSocialLink?.display_order || 0} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="is_active" name="is_active" defaultChecked={editingSocialLink?.is_active ?? true} />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsSocialLinkDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getPlatformColor(link.platform)}`}>
                          {getPlatformIcon(link.platform)}
                          {link.platform}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell>{link.display_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSocialLink(link);
                              setSocialLinkPlatform(link.platform);
                              setIsSocialLinkDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setDeleteSocialLinkId(link.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialogs */}
        <DeleteConfirmDialog
          open={deletePostId !== null}
          onOpenChange={(open) => !open && setDeletePostId(null)}
          onConfirm={handleDeletePost}
          title="게시글을 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다. 게시글과 관련된 모든 댓글도 삭제됩니다."
        />

        <DeleteConfirmDialog
          open={deleteArtistId !== null}
          onOpenChange={(open) => !open && setDeleteArtistId(null)}
          onConfirm={handleDeleteArtist}
          title="아티스트를 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
        />

        <DeleteConfirmDialog
          open={deleteVideoId !== null}
          onOpenChange={(open) => !open && setDeleteVideoId(null)}
          onConfirm={handleDeleteVideo}
          title="비디오를 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
        />

        <DeleteConfirmDialog
          open={deleteInstagramId !== null}
          onOpenChange={(open) => !open && setDeleteInstagramId(null)}
          onConfirm={handleDeleteInstagram}
          title="인스타그램 계정을 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
        />

        <DeleteConfirmDialog
          open={deleteSocialLinkId !== null}
          onOpenChange={(open) => !open && setDeleteSocialLinkId(null)}
          onConfirm={handleDeleteSocialLink}
          title="소셜 링크를 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
        />
      </div>
    </div>
  );
}