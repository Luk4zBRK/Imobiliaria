import { useState, useEffect } from 'react';
import { Bell, MessageSquare, X, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string | null;
  origem: string;
  status: string;
  created_at: string;
}

interface Notification {
  id: string;
  lead: Lead;
  read: boolean;
  created_at: string;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestLead, setLatestLead] = useState<Lead | null>(null);

  // Fetch recent leads on mount
  useEffect(() => {
    const fetchRecentLeads = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && !error) {
        const notifs = data.map(lead => ({
          id: lead.id,
          lead,
          read: lead.status !== 'novo',
          created_at: lead.created_at,
        }));
        setNotifications(notifs);
      }
    };

    fetchRecentLeads();
  }, []);

  // Subscribe to realtime lead inserts
  useEffect(() => {
    const channel = supabase
      .channel('admin-leads-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          const newLead = payload.new as Lead;
          
          // Add to notifications
          setNotifications(prev => [{
            id: newLead.id,
            lead: newLead,
            read: false,
            created_at: newLead.created_at,
          }, ...prev.slice(0, 9)]);

          // Show toast notification
          setLatestLead(newLead);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const dismissToast = () => {
    setShowToast(false);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && latestLead && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 50 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">Novo Lead!</span>
                </div>
                <button
                  onClick={dismissToast}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-foreground">{latestLead.nome}</p>
                <p className="text-sm text-muted-foreground mt-1">{latestLead.email}</p>
                <p className="text-sm text-muted-foreground">{latestLead.telefone}</p>
                {latestLead.mensagem && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    "{latestLead.mensagem}"
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Origem: {latestLead.origem}
                  </span>
                  <Link
                    to="/admin/leads"
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    onClick={dismissToast}
                  >
                    Ver detalhes
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bell Icon with Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl hover:bg-muted"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-96 p-0 rounded-2xl border-border/50 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Notificações</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {unreadCount} novas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Marcar como lidas
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to="/admin/leads"
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'block px-4 py-3 hover:bg-muted/50 transition-colors',
                      !notification.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        !notification.read 
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                          : 'bg-muted'
                      )}>
                        <MessageSquare className={cn(
                          'h-5 w-5',
                          !notification.read ? 'text-white' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            'text-sm truncate',
                            !notification.read ? 'font-semibold text-foreground' : 'text-foreground'
                          )}>
                            {notification.lead.nome}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.lead.email}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border">
            <Link
              to="/admin/leads"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Ver todos os leads
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
