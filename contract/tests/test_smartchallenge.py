from contextlib import contextmanager
from typing import Any, Protocol
from collections.abc import Iterator
from eth_account.messages import encode_defunct
from pytest import fixture
from ape_test.accounts import TestAccount
from ape.managers.project import LocalProject
from eth_account import Account
from random import choices, randint
from dataclasses import dataclass
from web3 import Web3, EthereumTesterProvider
from ape import reverts  # type: ignore
from ape_ethereum.transactions import Receipt

ADDRESS_LENGTH = 32


class SmartChallenge(Protocol):
    def getOwner(self) -> TestAccount: ...
    def getChallenges(self) -> list[object]: ...
    def addChallenge(
        self, flag: str, reward: int, score: int, /, *, sender: TestAccount, value: int
    ): ...
    def submitFlag(
        self, challengeId: int, signature: str, /, *, sender: TestAccount
    ) -> Receipt: ...
    def getMessageHash(self, address: TestAccount, id: int, /) -> bytes: ...

    ChallengeAdded: Any


@dataclass
class Challenge:
    private_flag: str
    public_flag: str
    reward: int
    score: int
    id: int


@fixture
def owner(accounts: list[TestAccount]) -> TestAccount:
    return accounts[0]


@fixture
def not_owner(accounts: list[TestAccount]) -> TestAccount:
    return accounts[1]


def get_private_flag() -> str:
    return "".join(choices("0123456789abcdef", k=ADDRESS_LENGTH * 2))


def get_public_flag(private_flag: str) -> str:
    return Account.from_key(private_flag).address


def get_flag_signature(
    contract: SmartChallenge, private_flag: str, address: TestAccount, id: int
) -> str:
    w3 = Web3(EthereumTesterProvider())
    msg = contract.getMessageHash(address, id)
    message = encode_defunct(msg)
    signed_message = w3.eth.account.sign_message(message, private_key=private_flag)
    return signed_message.signature


@contextmanager
def deploy_contract(
    project: LocalProject, owner: TestAccount
) -> Iterator[SmartChallenge]:
    yield owner.deploy(project.SmartChallenge)  # type: ignore


def add_challenge(contract: SmartChallenge, owner: TestAccount) -> Challenge:
    reward = randint(0, 10**6)
    score = randint(0, 10**6)
    private_flag = get_private_flag()
    public_flag = get_public_flag(private_flag)
    contract.addChallenge(public_flag, reward, score, sender=owner, value=reward)
    id: int = contract.ChallengeAdded.query("*", start_block=-1).iloc[-1][
        "event_arguments"
    ]["challengeId"]
    return Challenge(private_flag, public_flag, reward, score, id)


def test_getOwner(project: LocalProject, owner: TestAccount):
    with deploy_contract(project, owner) as contract:
        actual = contract.getOwner()
    expected = owner
    assert actual == expected


def test_addChallenge(project: LocalProject, owner: TestAccount):
    with deploy_contract(project, owner) as contract:
        challenge = add_challenge(contract, owner)
        challenges = contract.getChallenges()
    actual: list[dict[str, Any]] = [vars(elem) for elem in challenges]
    expected = [
        {
            "publicFlag": challenge.public_flag,
            "reward": challenge.reward,
            "score": challenge.score,
        }
    ]
    assert actual == expected


def test_submitFlag_correct(
    project: LocalProject, owner: TestAccount, not_owner: TestAccount
):
    with deploy_contract(project, owner) as contract:
        challenge = add_challenge(contract, owner)
        signature = get_flag_signature(
            contract, challenge.private_flag, not_owner, challenge.id
        )
        contract.submitFlag(challenge.id, signature, sender=not_owner)


def test_submitFlag_wrong(
    project: LocalProject, owner: TestAccount, not_owner: TestAccount
):
    with deploy_contract(project, owner) as contract:
        challenge = add_challenge(contract, owner)
        signature = get_flag_signature(
            contract, get_private_flag(), not_owner, challenge.id
        )
        with reverts("Incorrect Flag!"):  # type: ignore
            contract.submitFlag(challenge.id, signature, sender=not_owner)


def test_submitFlag_reward(
    project: LocalProject, owner: TestAccount, not_owner: TestAccount
):
    start_balance = not_owner.balance
    with deploy_contract(project, owner) as contract:
        challenge = add_challenge(contract, owner)
        signature = get_flag_signature(
            contract, challenge.private_flag, not_owner, challenge.id
        )
        transaction = contract.submitFlag(challenge.id, signature, sender=not_owner)
    actual = not_owner.balance
    expected = (
        start_balance + challenge.reward - transaction.gas_price * transaction.gas_used
    )
    assert actual == expected
