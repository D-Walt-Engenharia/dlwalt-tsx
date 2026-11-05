FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
ARG NEXT_PUBLIC_GOOGLE_ADS_FINANCING_CONVERSION
ENV NEXT_PUBLIC_GOOGLE_ADS_FINANCING_CONVERSION=$NEXT_PUBLIC_GOOGLE_ADS_FINANCING_CONVERSION
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 80

CMD ["npx", "next", "start", "-p", "80"]

