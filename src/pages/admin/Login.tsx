import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase에서 관리자 계정 확인
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', id)
        .eq('password', password)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // Supabase 오류 시 로컬 인증 사용 (개발용)
        if (id === 'admin' && password === 'icmicm123!') {
          localStorage.setItem('admin_token', 'valid');
          localStorage.setItem('admin_id', id);
          toast.success('로그인 성공! (로컬 인증)');
          navigate('/admin');
          setLoading(false);
          return;
        }
        toast.error('아이디 또는 비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      if (!data) {
        toast.error('아이디 또는 비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      // 로그인 성공 - 토큰 저장
      localStorage.setItem('admin_token', 'valid');
      localStorage.setItem('admin_id', id);
      toast.success('로그인 성공!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      // 예외 발생 시 로컬 인증 사용 (개발용)
      if (id === 'admin' && password === 'icmicm123!') {
        localStorage.setItem('admin_token', 'valid');
        localStorage.setItem('admin_id', id);
        toast.success('로그인 성공! (로컬 인증)');
        navigate('/admin');
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ICM 관리자 로그인</CardTitle>
          <CardDescription>관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                type="text"
                placeholder="admin"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}