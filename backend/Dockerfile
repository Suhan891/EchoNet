# ─────────────────────────────────────────────
# Stage 1: Build & Prune
# ─────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

# Debian Slim requires openssl manually installed for Prisma engines
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci

# Generate the type-safe Prisma client binary
RUN npx prisma generate

COPY . .
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev && npm cache clean --force

# ─────────────────────────────────────────────
# Stage 2: Production Runner
# ─────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Re-install openssl in the runner so Prisma can execute query engines
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs && \
    useradd  --system --uid 1001 -g nodejs nestjs

# CRITICAL: Copy the built app, dependencies, AND the migrations folder
COPY --from=builder --chown=nestjs:nodejs /app/dist        ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma       ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma.config.ts ./prisma.config.ts

USER nestjs
EXPOSE 3001

# Execute our new automation script instead of just calling node
CMD ["npm", "run", "start:migrate:prod"]
