const ganache = require("ganache");
const { Web3 } = require("web3");

// updated ganache and web3 imports added for convenience
const { interface, bytecode } = require("../compile");

// contract test code will go here
const assert = require("assert");

const web3 = new Web3(ganache.provider());

console.log(ganache.provider());

let inbox;
const INITIAL_STRING = "Hi there!";

beforeEach(async () => {
  // Get a list of unlocked accounts
  accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    // console.log("Output address:");
    // console.log(inbox.options.address);
    assert.ok(inbox.options.address);
  });
  it("It has a default message:", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });
  it("has the message changed:", async () => {
    const newMessage = "Good morning!";
    await inbox.methods.setMessage(newMessage).send({
      // think of send like send transaction
      from: accounts[0], // choose account to pay for the transaction
      gas: "1000000", // gas limit that we're willing to pay for the transaction to proceed
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });
});
