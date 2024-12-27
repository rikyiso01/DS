from ape import accounts, project
import os
from ape.api.accounts import AccountAPI
from ape_accounts import import_account_from_private_key
from tests.test_smartchallenge import SmartChallenge

# alias = "my-account"
# passphrase = "ciao"
# private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
#
# account = import_account_from_private_key(alias, passphrase, private_key)

# print(f'Your imported account address is: {account.address}')


# You need an account to deploy, as it requires a transaction.

def deploy(account:AccountAPI)->str:
    contract= project.SmartChallenge.deploy(sender=account)
    contract = project.SmartChallengeProxy.deploy(contract.address,sender=account)
    print("Contract deployed at",contract.address)
    return contract.address
