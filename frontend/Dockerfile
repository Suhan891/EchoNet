# ─────────────────────────────────────────────
# Stage 1: Build & Prune
# ─────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

# Enable Next.js telemetry disablement during build if desired
ENV NEXT_TELEMETRY_DISABLED=1
# ENV NODE_ENV=production

# Install dependencies based on preferred package manager
COPY package*.json ./
RUN npm ci

# Copy source files and build the application
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Production Runner
# ─────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Setup secure non-root user
RUN groupadd --system --gid 1001 nodejs && \
  useradd  --system --uid 1001 -g nodejs nextjs

# Set correct permissions for Next.js prerender cache folder
RUN mkdir .next && chown nextjs:nodejs .next

# Leverage Next.js standalone output tracing (copies only required files)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs
EXPOSE 3000

# Next.js specific healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:3000').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Next.js standalone outputs a server.js file instead of utilizing standard next start
CMD ["node", "server.js"]
