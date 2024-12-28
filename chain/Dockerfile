FROM docker.io/node:20-alpine

WORKDIR /app
# ref: https://pnpm.io/docker
ENV PNPM_HOME=/pnpm

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --shamefully-hoist

COPY ./hardhat.config.js ./
CMD ["pnpm","exec","hardhat","node","--hostname","0.0.0.0"]

