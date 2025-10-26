import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">ICM Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/admin">
          <Button
            variant={isActive('/admin') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link to="/admin/content">
          <Button
            variant={isActive('/admin/content') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Content
          </Button>
        </Link>

        <Link to="/admin/settings">
          <Button
            variant={isActive('/admin/settings') ? 'secondary' : 'ghost'}
            className="w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}