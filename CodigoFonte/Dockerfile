# Build multi-estágio para imagem de produção otimizada
FROM node:20-alpine AS base

# Instala dependências apenas quando necessário
FROM base AS deps
# Verifica https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por que libc6-compat pode ser necessário.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instala dependências baseado no gerenciador de pacotes preferido
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  else echo "Arquivo de lock não encontrado." && exit 1; \
  fi

# Reconstrói o código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Define argumento de build para versão da aplicação (opcional - será gerado automaticamente se não fornecido)
ARG NEXT_PUBLIC_APP_VERSION

# Define versão da aplicação como ENV para build do Next.js
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}

# O Next.js coleta dados de telemetria completamente anônimos sobre uso geral.
# Saiba mais aqui: https://nextjs.org/telemetry
# Descomente a linha seguinte caso queira desabilitar telemetria durante o build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build direto com next build
RUN npx next build

# Imagem de produção, copia todos os arquivos e executa o next
FROM base AS runner
WORKDIR /app

# Instala curl para verificações de saúde
RUN apk add --no-cache curl

ENV NODE_ENV=production
# Descomente a linha seguinte caso queira desabilitar telemetria durante execução.
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário não-root para executar a aplicação
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia a pasta public do projeto pois não está incluída no build standalone
COPY --from=builder /app/public ./public

# Define as permissões corretas para cache de pré-renderização
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Aproveita automaticamente os traces de saída para reduzir tamanho da imagem
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Define hostname para localhost
ENV HOSTNAME="0.0.0.0"

# Verificação de saúde
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# server.js é criado pelo next build a partir da saída standalone
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
