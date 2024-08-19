// compile code will go here
const path = require("path"); // help build a valid path across systems
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");

const source = fs.readFileSync(inboxPath, "utf8");

// console.log(solc.compile(source, 1).contracts[":Inbox"]); // 1 is number of contract expected to be compiled

module.exports = solc.compile(source, 1).contracts[":Inbox"];
