from pytest import fixture
from ape_test.accounts import TestAccount
from ape.managers.project import LocalProject
from ape.contracts.base import ContractInstance


@fixture
def owner(accounts: list[TestAccount]) -> TestAccount:
    return accounts[0]


@fixture
def not_owner(accounts: list[TestAccount]) -> TestAccount:
    return accounts[1]


@fixture
def contract(owner: TestAccount, project: LocalProject) -> ContractInstance:
    return owner.deploy(project.SmartChallenge) # type: ignore


def test_owner(contract: ContractInstance, owner: TestAccount):
    assert owner == contract.getOwner()
