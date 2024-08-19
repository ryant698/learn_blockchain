const path = require("path");
const fs = require("fs");
const solc = require("solc");

// Path to the contract file
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

// Create the input structure for Solidity compiler
const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// Compile the contract
const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

// console.log(compiledContract.contracts["Lottery.sol"].Lottery);

// Export the compiled contract (ABI and bytecode)

module.exports = {
  interface: compiledContract.contracts["Lottery.sol"].Lottery.abi,
  bytecode:
    compiledContract.contracts["Lottery.sol"].Lottery.evm.bytecode.object,
};
