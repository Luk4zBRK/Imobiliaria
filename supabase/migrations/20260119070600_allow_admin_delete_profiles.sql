-- Permitir que admins removam perfis (necessário para exclusão no painel)
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
