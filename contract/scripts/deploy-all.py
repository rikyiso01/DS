from pathlib import Path
from scripts.account import get_accounts
from scripts.challenges import add_challenge
from scripts.deploy import deploy
from yaml import safe_load

from tests.test_smartchallenge import get_public_flag


def main():
    with Path("./challenges.yml").open("rt") as f:
        challenges = safe_load(f)
    account1, _ = get_accounts()
    contract = deploy(account1)
    for challenge in challenges:
        add_challenge(
            contract,
            account1,
            get_public_flag(challenge["private_flag"]),
            challenge["reward"],
            challenge["score"],
            challenge["ipfscid"],
        )
