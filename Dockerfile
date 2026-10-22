# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are baked in at build time
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_CONTACT_EMAIL=hello@example.invalid
ARG NEXT_PUBLIC_SECURITY_EMAIL=security@example.invalid
ARG NEXT_PUBLIC_APP_URL=
ARG NEXT_PUBLIC_IOS_URL=
ARG NEXT_PUBLIC_ANDROID_URL=
ARG NEXT_PUBLIC_LEAD_ENDPOINT=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_SECURITY_EMAIL=$NEXT_PUBLIC_SECURITY_EMAIL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_IOS_URL=$NEXT_PUBLIC_IOS_URL \
    NEXT_PUBLIC_ANDROID_URL=$NEXT_PUBLIC_ANDROID_URL \
    NEXT_PUBLIC_LEAD_ENDPOINT=$NEXT_PUBLIC_LEAD_ENDPOINT
RUN npx next build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
