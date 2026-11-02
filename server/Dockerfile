FROM node:20-bookworm-slim
   WORKDIR /app
   RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

   COPY server/package.json ./server/
   WORKDIR /app/server
   RUN npm install --no-audit --no-fund

   WORKDIR /app
   COPY shared ./shared
   COPY server ./server

   WORKDIR /app/server
   RUN npx prisma generate

   ENV NODE_ENV=production PORT=4000 UPLOAD_DIR=/app/server/uploads
   EXPOSE 4000
   VOLUME ["/app/server/uploads"]
   CMD ["sh", "-c", "npx prisma db push --skip-generate && npx tsx prisma/seed.ts && npx tsx src/index.ts"]
