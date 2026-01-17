-- Create site_settings table for dynamic site configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  type text NOT NULL DEFAULT 'text', -- text, image, json
  label text NOT NULL,
  category text NOT NULL DEFAULT 'geral',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- Only admins/editors can manage settings
CREATE POLICY "Admins and editors can manage settings"
ON public.site_settings FOR ALL
USING (is_admin_or_editor(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value, type, label, category) VALUES
-- Contato
('contato_telefone', '(11) 99999-9999', 'text', 'Telefone', 'contato'),
('contato_whatsapp', '5511999999999', 'text', 'WhatsApp (com código do país)', 'contato'),
('contato_email', 'contato@eacorretor.com.br', 'text', 'Email', 'contato'),
('contato_endereco', 'São Paulo, SP', 'text', 'Endereço', 'contato'),
('contato_horario', 'Seg a Sex: 9h às 18h | Sáb: 9h às 13h', 'text', 'Horário de Funcionamento', 'contato'),
-- Redes Sociais
('social_instagram', 'https://instagram.com/eacorretor', 'text', 'Instagram', 'social'),
('social_facebook', 'https://facebook.com/eacorretor', 'text', 'Facebook', 'social'),
('social_linkedin', '', 'text', 'LinkedIn', 'social'),
('social_youtube', '', 'text', 'YouTube', 'social'),
-- Imagens
('hero_titulo', 'Encontre o Imóvel dos Seus Sonhos', 'text', 'Título do Banner Principal', 'banner'),
('hero_subtitulo', 'Imóveis selecionados com a qualidade e confiança que você merece', 'text', 'Subtítulo do Banner', 'banner'),
('hero_imagem', '', 'image', 'Imagem de Fundo do Banner', 'banner'),
-- SEO
('seo_titulo', 'EA Corretor de Imóveis', 'text', 'Título do Site (SEO)', 'seo'),
('seo_descricao', 'Encontre o imóvel perfeito para você. Casas, apartamentos, terrenos e muito mais.', 'text', 'Descrição do Site (SEO)', 'seo'),
-- Sobre
('sobre_texto', '', 'text', 'Texto da Página Sobre', 'sobre'),
('sobre_missao', 'Proporcionar a melhor experiência na compra, venda e locação de imóveis.', 'text', 'Missão', 'sobre'),
('sobre_visao', 'Ser referência no mercado imobiliário pela excelência no atendimento.', 'text', 'Visão', 'sobre');

-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets', 
  'site-assets', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- Storage policies for site assets
CREATE POLICY "Public can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins and editors can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update site assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-assets' AND is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can delete site assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-assets' AND is_admin_or_editor(auth.uid()));