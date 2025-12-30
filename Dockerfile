FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# ⚠️ DEV/ONE-TIME ONLY: this will WIPE the database at container start
CMD ["sh", "-c", "npx prisma migrate reset --force && npm run start"]
