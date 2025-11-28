FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/
RUN bun install

# Build shared package
FROM deps AS shared-build
COPY packages/shared ./packages/shared
WORKDIR /app/packages/shared
RUN bun run build

# Build frontend
FROM deps AS builder
WORKDIR /app

COPY --from=shared-build /app/packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=http://localhost:3333
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build

# Production
FROM base AS runner
WORKDIR /app/apps/frontend

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./.next/static
COPY --from=builder /app/apps/frontend/public ./public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

