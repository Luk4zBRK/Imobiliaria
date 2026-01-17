import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderOpen,
  MessageSquare,
  Users,
  LogOut,
  Home,
  ChevronLeft,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Imóveis', href: '/admin/imoveis', icon: Building2 },
  { label: 'Categorias', href: '/admin/categorias', icon: FolderOpen },
  { label: 'Leads', href: '/admin/leads', icon: MessageSquare },
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users, adminOnly: true },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen admin-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-sidebar-border/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-sidebar-foreground">
                  Admin
                </span>
                <p className="text-xs text-sidebar-muted">Painel de Controle</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'w-full justify-center text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-xl h-9',
              !isCollapsed && 'justify-start px-3'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', isCollapsed && 'rotate-180')} />
            {!isCollapsed && <span className="ml-2 text-sm">Recolher menu</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-sidebar-muted uppercase tracking-wider">
              Menu Principal
            </p>
          )}
          {filteredNavItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                className={cn(
                  'admin-nav-item group',
                  isActive(item.href)
                    ? 'admin-nav-item-active'
                    : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                  isCollapsed && 'justify-center px-0'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                  isActive(item.href) ? 'text-white' : ''
                )} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Section */}
        {!isCollapsed && user && (
          <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-sidebar-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-sidebar-muted truncate">
                  {isAdmin ? 'Administrador' : 'Editor'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3 border-t border-sidebar-border/50 space-y-1">
          <Link
            to="/"
            className={cn(
              'admin-nav-item text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Ver Site</span>}
          </Link>
          <button
            onClick={signOut}
            className={cn(
              'w-full admin-nav-item text-sidebar-foreground/80 hover:text-red-400 hover:bg-red-500/10',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
