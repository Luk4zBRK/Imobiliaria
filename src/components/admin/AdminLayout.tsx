import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSidebar } from './AdminSidebar';
import { AdminNotifications } from './AdminNotifications';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading, rolesLoading, isAdmin, isEditor } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    // Only check roles after they've loaded
    if (!loading && !rolesLoading && user && !isAdmin && !isEditor) {
      navigate('/admin/login');
    }
  }, [loading, rolesLoading, user, isAdmin, isEditor, navigate]);

  if (loading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 lg:hidden transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AdminSidebar isCollapsed={false} onToggle={() => setIsMobileOpen(false)} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-8">
          {/* Mobile Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-display font-semibold">Admin</span>
            </div>
          </div>

          {/* Desktop spacer */}
          <div className="hidden lg:block" />

          {/* Notifications */}
          <div className="flex items-center gap-3">
            <AdminNotifications />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
