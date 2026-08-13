# setup
FROM node:20-alpine AS base

WORKDIR /app

# dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; \
  fi

# builder
FROM base AS builder

COPY package.json ./
COPY . .

RUN npm install
RUN npm run build

# Runner
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]

