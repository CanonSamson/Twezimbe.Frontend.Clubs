ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Build stage
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies

RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN pnpm build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install production dependencies
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app ./


# Set environment variables
ENV TZ=Africa/Kampala \
    PORT=8000 \
    NODE_ENV=production

# Expose the port
EXPOSE 8000

# Add labels for metadata tracking
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.version=$VERSION \
      org.label-schema.vendor="Canon"


# Command to start the service
CMD ["yarn", "start"]
