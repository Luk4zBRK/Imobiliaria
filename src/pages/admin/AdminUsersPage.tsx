import { useCallback, useEffect, useMemo, useState } from 'react';
import { Shield, User, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface UserWithRole {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  roles: string[];
}

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const createUserSchema = z
    .object({
      nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
      confirmarSenha: z.string().min(6, 'Confirmação deve ter pelo menos 6 caracteres'),
      role: z.enum(['admin', 'editor']),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
      path: ['confirmarSenha'],
      message: 'As senhas não conferem',
    });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map(profile => ({
        id: profile.user_id,
        nome: profile.nome,
        email: profile.email,
        created_at: profile.created_at,
        roles: (roles || [])
          .filter(r => r.user_id === profile.user_id)
          .map(r => r.role),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);

  const [createForm, setCreateForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'editor',
  });

  const [editForm, setEditForm] = useState({
    id: '',
    nome: '',
    email: '',
    role: 'editor',
  });

  const [credentialsForm, setCredentialsForm] = useState({
    id: '',
    email: '',
    password: '',
  });

  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const selectedUserName = useMemo(() => {
    const found = users.find(u => u.id === editForm.id);
    return found?.nome ?? '';
  }, [editForm.id, users]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    fetchUsers();
  }, [isAdmin, navigate, fetchUsers]);

  const handleCreate = async () => {
    const parsed = createUserSchema.safeParse(createForm);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      toast.error(firstIssue?.message || 'Dados inválidos. Verifique os campos.');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.senha,
        options: {
          data: { nome: parsed.data.nome },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error('Usuário não retornado pelo Supabase');

      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: userId,
        nome: parsed.data.nome,
        email: parsed.data.email,
      });

      if (profileError) throw profileError;

      // Reseta roles atuais e insere a escolhida
      await supabase.from('user_roles').delete().eq('user_id', userId);
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: userId,
        role: parsed.data.role,
      });

      if (roleError) throw roleError;

      toast.success('Usuário criado com sucesso. Confirme o email para ativar a conta.');
      setOpenCreate(false);
      setCreateForm({ nome: '', email: '', senha: '', confirmarSenha: '', role: 'editor' });
      await fetchUsers();
    } catch (err: any) {
      console.error('Erro ao criar usuário', err);
      toast.error(err?.message || 'Erro ao criar usuário');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editForm.id) return;
    if (!editForm.nome) {
      toast.error('Informe o nome');
      return;
    }
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ nome: editForm.nome })
        .eq('user_id', editForm.id);

      if (profileError) throw profileError;

      await supabase.from('user_roles').delete().eq('user_id', editForm.id);
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: editForm.id,
        role: editForm.role as 'admin' | 'editor',
      });

      if (roleError) throw roleError;

      toast.success('Usuário atualizado');
      setOpenEdit(false);
      await fetchUsers();
    } catch (err: any) {
      console.error('Erro ao editar usuário', err);
      toast.error(err?.message || 'Erro ao editar usuário');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editForm.id) return;
    setSaving(true);
    try {
      await supabase.from('user_roles').delete().eq('user_id', editForm.id);
      const { error: profileError } = await supabase.from('profiles').delete().eq('user_id', editForm.id);
      if (profileError) throw profileError;

      toast.success('Usuário removido (credenciais na Auth não foram apagadas)');
      setOpenDelete(false);
      await fetchUsers();
    } catch (err: any) {
      console.error('Erro ao remover usuário', err);
      toast.error(err?.message || 'Erro ao remover usuário');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (user: UserWithRole) => {
    setEditForm({
      id: user.id,
      nome: user.nome || '',
      email: user.email,
      role: user.roles[0] || 'editor',
    });
    setOpenEdit(true);
  };

  const openCredentialsModal = (user: UserWithRole) => {
    setCredentialsForm({ id: user.id, email: user.email, password: '' });
    setOpenCredentials(true);
  };

  const handleUpdateCredentials = async () => {
    if (!credentialsForm.id) return;
    if (!credentialsForm.email && !credentialsForm.password) {
      toast.error('Informe email e/ou senha');
      return;
    }

    const endpoint = import.meta.env.VITE_ADMIN_UPDATE_USER_URL;
    const secret = import.meta.env.VITE_ADMIN_FUNCTION_SECRET;

    if (!endpoint || !secret) {
      toast.error('Endpoint ou segredo da função não configurados');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({
          user_id: credentialsForm.id,
          email: credentialsForm.email || undefined,
          password: credentialsForm.password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data?.error || data?.message || JSON.stringify(data);
        throw new Error(detail || 'Erro ao atualizar credenciais');
      }

      toast.success('Credenciais atualizadas');
      setOpenCredentials(false);
      setCredentialsForm({ id: '', email: '', password: '' });
      await fetchUsers();
    } catch (err: any) {
      console.error('Erro ao atualizar credenciais', err);
      toast.error(err?.message || 'Erro ao atualizar credenciais');
    } finally {
      setSaving(false);
    }
  };

  const handleResendConfirmation = async (user: UserWithRole) => {
    setActionUserId(user.id);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
      toast.success('Email de confirmação reenviado');
    } catch (err: any) {
      console.error('Erro ao reenviar confirmação', err);
      toast.error(err?.message || 'Erro ao reenviar confirmação');
    } finally {
      setActionUserId(null);
    }
  };

  const handleResetPassword = async (user: UserWithRole) => {
    setActionUserId(user.id);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      toast.success('Email de redefinição enviado');
    } catch (err: any) {
      console.error('Erro ao enviar redefinição', err);
      toast.error(err?.message || 'Erro ao enviar redefinição');
    } finally {
      setActionUserId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="default" className="gap-1">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <User className="h-3 w-3" />
        Editor
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Usuários</h1>
        <p className="text-muted-foreground mt-1">{users.length} usuários cadastrados</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Gerencie contas do painel (perfis e roles).
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="btn-gold gap-2">
              <Plus className="h-4 w-4" /> Novo usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo usuário</DialogTitle>
              <DialogDescription>Cria uma conta e define o perfil.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome completo"
                  value={createForm.nome}
                  onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@dominio.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={createForm.senha}
                    onChange={(e) => setCreateForm({ ...createForm, senha: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar senha</Label>
                  <Input
                    type="password"
                    value={createForm.confirmarSenha}
                    onChange={(e) => setCreateForm({ ...createForm, confirmarSenha: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Perfil</Label>
                <Select value={createForm.role} onValueChange={(role) => setCreateForm({ ...createForm, role })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleCreate} disabled={saving} className="btn-gold">
                {saving ? 'Salvando...' : 'Criar usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role, idx) => (
                          <span key={`${user.id}-${role}-${idx}`}>{getRoleBadge(role)}</span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Sem perfil</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResendConfirmation(user)}
                      disabled={actionUserId === user.id}
                      className="text-foreground hover:text-primary"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResetPassword(user)}
                      disabled={actionUserId === user.id}
                      className="text-foreground hover:text-primary"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openCredentialsModal(user)}
                      className="text-foreground hover:text-primary"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(user)}
                      className="text-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditForm({ id: user.id, nome: user.nome, email: user.email, role: user.roles[0] || 'editor' });
                        setOpenEdit(false);
                        setOpenDelete(true);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Editar usuário */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>Atualize nome e perfil.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editForm.nome}
                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editForm.email} disabled className="opacity-80" />
            </div>
            <div className="space-y-2">
              <Label>Perfil</Label>
              <Select value={editForm.role} onValueChange={(role) => setEditForm({ ...editForm, role })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEdit} disabled={saving} className="btn-gold">
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Excluir usuário */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover usuário</DialogTitle>
            <DialogDescription>Esta ação remove o perfil e roles. As credenciais na Auth não serão apagadas.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja remover <span className="font-semibold text-foreground">{selectedUserName}</span>?
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Atualizar email/senha via Edge Function */}
      <Dialog open={openCredentials} onOpenChange={setOpenCredentials}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Atualizar credenciais</DialogTitle>
            <DialogDescription>Atualiza email e/ou senha do usuário selecionado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nova email</Label>
              <Input
                type="email"
                placeholder="email@dominio.com"
                value={credentialsForm.email}
                onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <Input
                type="password"
                placeholder="********"
                value={credentialsForm.password}
                onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">Deixe vazio qualquer campo que não queira alterar.</p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleUpdateCredentials} disabled={saving} className="btn-gold">
              {saving ? 'Atualizando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
