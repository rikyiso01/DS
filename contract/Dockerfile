FROM python:3.12

RUN apt-get update && apt-get install -y socat

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Change the working directory to the `app` directory
WORKDIR /app

COPY ./pyproject.toml ./uv.lock ./

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

# Copy the project into the image

COPY ./challenges.yml ./
COPY ./contracts ./contracts
COPY ./scripts ./scripts
COPY ./tests ./tests

ENTRYPOINT ["sh","-c","socat TCP4-LISTEN:8545,fork,reuseaddr TCP4:chain:8545 & uv run ape $@","/bin/sh"]
CMD []
