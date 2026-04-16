FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable \
  && corepack prepare pnpm@10.33.0 --activate

# Worker runs via `tsx`, which is a devDependency in this repo. Install devDeps.
RUN pnpm install --frozen-lockfile

COPY . .

ENV WORKER=true

CMD ["pnpm","worker:crawl"]

