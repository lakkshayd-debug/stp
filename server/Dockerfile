FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# install server dependencies
COPY server/package.json ./server/
WORKDIR /app/server
RUN npm install --no-audit --no-fund

# copy sources and build
WORKDIR /app
COPY shared ./shared
COPY server ./server
WORKDIR /app/server
RUN npx prisma generate && npx tsc -p tsconfig.json

ENV NODE_ENV=production PORT=4000 UPLOAD_DIR=/app/server/uploads
EXPOSE 4000
VOLUME ["/app/server/uploads"]
# creates/updates tables, inserts the owner + demo data (safe to re-run), then starts the API
CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx prisma/seed.ts && node dist/server/src/index.js"]
