FROM node:22-slim

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema (needed for prisma generate during npm install)
COPY prisma ./prisma

# Install dependencies (this will run prisma generate)
RUN npm ci

# Copy the rest of your source code
COPY . .

EXPOSE 3001

CMD [ "npm", "run", "dev" ]
 