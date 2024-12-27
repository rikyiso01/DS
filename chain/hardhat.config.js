/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
          {privateKey: process.env.PRIVATE_KEY, balance: "10000000000000000000000"},
          {privateKey: process.env.PRIVATE_KEY2, balance: "10000000000000000000000"}
      ],
    },
  },
};
