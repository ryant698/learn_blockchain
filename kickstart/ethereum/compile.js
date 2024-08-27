const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

console.log(campaignPath);

const source = fs.readFileSync(campaignPath, "utf-8");

// Create the standard JSON input format for solc
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
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

// Compile the contract using solc
const output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(output);

// Extract and write each contract to the build folder
for (let contract in output.contracts["Campaign.sol"]) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    output.contracts["Campaign.sol"][contract]
  );
}
