## Contexto Atual
- Dockerfile/nginx/.dockerignore alinhados ao workflow /docker e build já roda no Easypanel.
- Corrigido vite.config.ts (plugins) após erro de build.
- Erro atual em produção: falta das envs do Supabase (supabaseUrl is required).
- Próximo passo: definir VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no Easypanel e redeploy.
