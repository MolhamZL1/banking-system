# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Generate prisma client (needs schema.prisma)
RUN npx prisma generate

# App source + build
COPY . .
RUN npm run build


# ---------- Run stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install prod dependencies only
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# Prisma client is part of node_modules, but we also need dist
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run migrations then start
CMD sh -c "npx prisma migrate deploy && node dist/server.js"
