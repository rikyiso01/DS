from ape import Contract  # type: ignore
from ape import accounts, project

result = Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",  # type: ignore
    contract_type=project.SmartChallenge.contract_type,  # type: ignore
)

print(result.getOwner())
