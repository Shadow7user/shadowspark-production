
# Use the official Node.js 20 image as a base.
FROM node:20-slim AS base

# Set the working directory in the container.
WORKDIR /app

# Install pnpm.
RUN npm install -g pnpm

# --- Dependencies Stage ---
FROM base AS deps

# Copy the package.json and pnpm-lock.yaml files to the container.
COPY package.json pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm install --frozen-lockfile

# --- Builder Stage ---
FROM base AS builder

# Copy the dependencies from the deps stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code.
COPY . .

# Generate the Prisma client.
RUN pnpm prisma generate

# Build the Next.js application.
RUN pnpm build

# --- Runner Stage ---
FROM base AS runner

# Set the environment to production.
ENV NODE_ENV=production

# Copy the built application from the builder stage.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port the app runs on.
EXPOSE 3000

# The command to start the application.
CMD ["pnpm", "start"]
