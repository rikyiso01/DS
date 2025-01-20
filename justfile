dev:
    docker compose up -d --build ipfs chain
    VITE_CONTRACT_ADDRESS="$(NETWORK=::node docker compose run --rm --build contract-deploy | tail -n1)" docker compose up -d --build frontend

fly-deploy:
    cd challenge2 && flyctl deploy --ha=false

compile-report:
    pandoc report.md -t html --pdf-engine weasyprint -o report.pdf --css style.css --metadata title="DC Report"

consegna: compile-report
    curl -Lo /tmp/code.zip https://github.com/rikyiso01/DS/archive/refs/heads/main.zip
    cp ./report.pdf /tmp/report.pdf
    cp ./../seminar/presentation-compressed.pdf /tmp/forsage.pdf
    (cd /tmp && rm -rf consegna.zip && zip consegna.zip code.zip report.pdf forsage.pdf)
