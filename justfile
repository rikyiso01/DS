dev:
    docker compose up -d --build ipfs chain
    VITE_CONTRACT_ADDRESS="$(NETWORK=::node docker compose run --rm --build contract-deploy | tail -n1)" docker compose up -d --build frontend

fly-deploy:
    flyctl deploy --ha=false

compile-report:
    pandoc report.md -t html --pdf-engine weasyprint -o report.pdf --css style.css --metadata title="DC Report"
