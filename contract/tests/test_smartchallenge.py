from contextlib import contextmanager
from typing import Any, Protocol
from collections.abc import Iterator
from pytest import fixture
from ape_test.accounts import TestAccount
from ape.managers.project import LocalProject
from eth_account import Account
from random import choices, randint
from dataclasses import dataclass

ADDRESS_LENGTH = 32


class SmartChallenge(Protocol):
    def getOwner(self) -> TestAccount: ...
    def getChallenges(self) -> list[object]: ...
    def addChallenge(self, _: str, __: int, ___: int, sender: TestAccount): ...
    def submitFlag(self,_:int,__:str,sender:TestAccount):...


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


@contextmanager
def deploy_contract(
    project: LocalProject, owner: TestAccount
) -> Iterator[SmartChallenge]:
    yield owner.deploy(project.SmartChallenge)  # type: ignore


def add_challenge(contract: SmartChallenge, owner: TestAccount) -> Challenge:
    reward = randint(0, 255)
    score = randint(0, 255)
    private_flag = get_private_flag()
    public_flag = get_public_flag(private_flag)
    contract.addChallenge(public_flag, reward, score, sender=owner)
    return Challenge(private_flag, public_flag, reward, score, 0)


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


def test_submitFlag(project:LocalProject,owner:TestAccount,not_owner:TestAccount):
    with deploy_contract(project,owner) as contract:
        challenge=add_challenge(contract,owner)
        contract.submitFlag(challenge.id,challenge.private_flag,sender=not_owner)

