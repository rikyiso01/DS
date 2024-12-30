dev:
    docker compose up -d --build ipfs chain
    VITE_CONTRACT_ADDRESS="$(NETWORK=::node docker compose run --rm --build contract-deploy | tail -n1)" docker compose up -d --build frontend


