from __future__ import annotations
from ape import Contract  # type: ignore
from ape import project
from ape.api.accounts import AccountAPI
from tests.test_smartchallenge import SmartChallenge


def add_challenge(address:str,account:AccountAPI,public_flag:str,reward:int,score:int,ipfscid:str):
    contract :SmartChallenge= Contract(
        address,  # type: ignore
        contract_type=project.SmartChallenge.contract_type,  # type: ignore
    )
    contract.addChallenge(public_flag,reward,score,ipfscid,sender=account,value=reward,required_confirmations=0)

