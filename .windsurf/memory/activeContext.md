## Contexto Atual
- Dockerfile/nginx/.dockerignore alinhados ao workflow /docker e build já roda no Easypanel.
- Corrigido vite.config.ts (plugins) após erro de build.
- Erro atual em produção: falta das envs do Supabase (supabaseUrl is required).
- Ajustado useAuth para checar roles via RPC is_admin_or_editor, evitando bloqueio por RLS ao redirecionar para /admin.
- Próximo passo: validar login/redirecionamento local e garantir VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY definidos no Easypanel antes do redeploy.
- Identidade visual do admin alinhada ao site (dourado/navy): cards, ações rápidas, botões, gradientes e sidebar atualizados. Logo do header adicionada ao sidebar com textos em branco e alinhamentos ajustados.
