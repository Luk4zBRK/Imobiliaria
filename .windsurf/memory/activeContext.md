## Contexto Atual
- Dockerfile/nginx/.dockerignore alinhados ao workflow /docker e build já roda no Easypanel.
- Corrigido vite.config.ts (plugins) após erro de build.
- Erro atual em produção: falta das envs do Supabase (supabaseUrl is required).
- Ajustado useAuth para checar roles via RPC is_admin_or_editor, evitando bloqueio por RLS ao redirecionar para /admin.
- Próximo passo: validar login/redirecionamento local e garantir VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY definidos no Easypanel antes do redeploy.
- Atualizado Footer e ContactPage com endereço/telefone de Socorro-SP, removido link de WhatsApp na página de contato, email padrão alterado para erikazevedocorretor@gmail.com e embutido mapa do escritório via iframe do Google Maps.
- Identidade visual do admin alinhada ao site (dourado/navy): cards, ações rápidas, botões, gradientes e sidebar atualizados. Logo do header adicionada ao sidebar com textos em branco e alinhamentos ajustados.
- Favicon aponta agora para /FVCOM.jpg conforme solicitado.
15→- Formulário de contato agora, após salvar lead, abre WhatsApp (5519992372866) com mensagem padrão e dados dos campos + origem.
16→- App integra ScrollToTop para rolar ao topo a cada navegação.
17→- CTA da AboutPage agora usa link do WhatsApp com número 5519992372866 e mensagem padrão.
18→- Issue DNS/Cloudflare: erro 1000 (DNS to prohibited IP) em azevedocorretordeimoveis.com.br; revisar A records no Cloudflare removendo IP 212.85.13.212 e apontar domínio e www para o IP público correto do Easypanel (um único A, idealmente proxied se SSL/HTTPS via Cloudflare) e atualizar alvo do proxy do painel para hostname interno/IP válido.
19→
20→19/01: adicionada migração supabase 20260119070600_allow_admin_delete_profiles.sql para liberar DELETE em public.profiles apenas para admins, habilitando botão de excluir usuário no painel.
21→19/01: Página de Configurações (/admin/configuracoes) agora trata estado vazio: exibe aviso “Nenhuma configuração encontrada” e botão Recarregar, orientando verificar registros/políticas (site_settings + is_admin_or_editor). Evita Tabs sem dados.
22→Próximo passo: se continuar vazio, checar se tabela site_settings tem registros e se o usuário tem role admin/editor.
