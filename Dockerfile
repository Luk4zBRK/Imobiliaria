# Stage de build
FROM node:20-alpine AS builder
WORKDIR /app

# Variáveis de ambiente exigidas pelo Vite (passadas como build args)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Copiar manifestos de pacotes
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./

# Instalar dependências respeitando o lockfile existente
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile não encontrado." && exit 1; \
  fi

# Copiar código fonte e gerar build
COPY . .
RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  else npm run build; \
  fi

# Stage de produção com Nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Limpar arquivos padrão do Nginx
RUN rm -rf ./*

# Copiar build gerado pelo Vite
COPY --from=builder /app/dist .

# Configuração do Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
