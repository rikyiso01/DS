from __future__ import annotations
from ape import Contract  # type: ignore
from ape import accounts, project
from typing import Protocol

class SmartChallenge(Protocol):
    def getOwner(self) -> TestAccount: ...
    def getChallenges(self) -> list[object]: ...
    def addChallenge(
        self,
        flag: str,
        reward: int,
        score: int,
        ipfscid: str,
        /,
        *,
        sender: TestAccount,
        value: int,
    ): ...
    def submitFlag(
        self, challengeId: int, signature: str, /, *, sender: TestAccount
    ) -> Receipt: ...
    def getMessageHash(self, address: TestAccount, id: int, /) -> bytes: ...

    ChallengeAdded: Any

contract :SmartChallenge= Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  # type: ignore
    contract_type=project.SmartChallenge.contract_type,  # type: ignore
)
account = accounts.load("my-account")  # NOTE: <ALIAS> refers to your account alias!

contract.addChallenge("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",0,0,"QmVWVjY2VQWZgGb3J3APdBZDgYg3vhffVmrghQ4HZKsBZ9",sender=account,value=0)


