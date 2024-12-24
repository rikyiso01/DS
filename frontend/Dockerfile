FROM node:23.4-bookworm-slim

WORKDIR /app

# ref: https://pnpm.io/docker
ENV PNPM_HOME=/pnpm

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --shamefully-hoist

COPY ./index.html ./tsconfig.json ./tsconfig.json ./tsconfig.app.json ./tsconfig.node.json ./vite.config.ts ./
COPY ./src ./src
COPY ./public ./public

RUN pnpm vite build

CMD ["pnpm", "run", "preview","--host"]
