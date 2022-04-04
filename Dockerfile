FROM node:16-bullseye AS builder

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

COPY . .

RUN npm install
RUN npm run build

FROM node:16-bullseye

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD [ "npm" , "run" , "start" ]
