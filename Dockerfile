# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

# Install production deps, then add the prisma CLI (devDep) needed for migrate deploy.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install prisma --no-save

# Generated Prisma client (written to node_modules/.prisma by prisma generate)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Compiled JS output
COPY --from=builder /app/dist ./dist
# Migration files required by prisma migrate deploy
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "node dist/src/index.js"]
