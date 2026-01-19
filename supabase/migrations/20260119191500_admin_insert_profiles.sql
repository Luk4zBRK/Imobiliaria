-- Permitir que admins criem perfis para novos usuários via painel (RLS)
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
