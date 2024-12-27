from ape import accounts
from ape_accounts import import_account_from_private_key
from ape.api.accounts import AccountAPI
from os import environ

def get_accounts()->list[AccountAPI]:
    acc=accounts.get_accounts_by_type(AccountAPI) # type: ignore
    if not acc:
        alias = "account1"
        passphrase = environ["APE_ACCOUNTS_account1_PASSPHRASE"]
        private_key = environ["PRIVATE_KEY"]

        account = import_account_from_private_key(alias, passphrase, private_key)
        print(f'Your imported account address is: {account.address}')
        alias = "account2"
        passphrase = environ["APE_ACCOUNTS_account2_PASSPHRASE"]
        private_key = environ["PRIVATE_KEY2"]

        account = import_account_from_private_key(alias, passphrase, private_key)
        print(f'Your imported account address is: {account.address}')
    acc=accounts.get_accounts_by_type(AccountAPI) # type: ignore
    for a in acc:
        a.set_autosign(True)
    return acc # type: ignore
