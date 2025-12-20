# 1) Base
FROM node:20-alpine

# 2) Workdir
WORKDIR /app

# 3) Install deps
COPY package*.json ./
RUN npm ci

# 4) Copy source
COPY . .

# 5) Prisma generate (needs schema.prisma)
RUN npx prisma generate

# 6) Build TS -> dist
RUN npm run build

# 7) Runtime
EXPOSE 3000
CMD ["npm", "run", "start"]
