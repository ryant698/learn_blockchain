const ganache = require("ganache");
const { Web3 } = require("web3");
// updated imports added for convenience

const assert = require("assert");

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  lottery = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });
});

describe("Lottery", () => {
  it("deployed a contract", async () => {
    const contractAddress = await lottery.options.address;
    assert.ok(contractAddress);
  });
  it("verify manager address: ", async () => {
    const manager = await lottery.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });
  it("verify new participant: ", async () => {
    const currentPlayers = await lottery.methods.getPlayers().call();
    await lottery.methods.enter().send({
      from: accounts[0],
      gas: "10000000",
      //   value: "100000000000000", // value in wei ~ 0.0001 eth
      value: web3.utils.toWei("0.005", "ether"),
    });
    currentPlayers.push(accounts[0]);
    const newPlayersArray = await lottery.methods.getPlayers().call();
    assert.deepEqual(currentPlayers, newPlayersArray);
  });
  it("verify new participant 2: ", async () => {
    const currentPlayers = await lottery.methods.getPlayers().call();
    console.log("Current players, ", currentPlayers);
    await lottery.methods.enter().send({
      from: accounts[1],
      gas: "10000000",
      //   value: "100000000000000", // value in wei ~ 0.0001 eth
      value: web3.utils.toWei("0.005", "ether"),
    });
    currentPlayers.push(accounts[1]);
    await lottery.methods.enter().send({
      from: accounts[2],
      gas: "10000000",
      //   value: "100000000000000", // value in wei ~ 0.0001 eth
      value: web3.utils.toWei("0.005", "ether"),
    });
    currentPlayers.push(accounts[2]);
    const newPlayersArray = await lottery.methods.getPlayers().call();
    console.log("Updated list of players: ,", newPlayersArray);
    assert.deepEqual(currentPlayers, newPlayersArray);
  });
  it("require minimum of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: 1, // wei,
        gas: "10000000",
      });
      assert(false); // mark the case as false if no error shown
    } catch (error) {
      assert(error);
    }
  });
  it("verify manager calling pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
        gas: "10000000",
      });
      assert(false); // mark the case as false if no error shown
    } catch (error) {
      assert(error);
    }
  });
  it("verify reset array after transfer fund", async () => {
    await lottery.methods.enter().send({
      from: accounts[2],
      gas: "10000000",
      //   value: "100000000000000", // value in wei ~ 0.0001 eth
      value: web3.utils.toWei("0.005", "ether"),
    });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const currentPlayers = await lottery.methods.getPlayers().call();
    assert.equal(0, currentPlayers.length);
  });
  it("verify winner reward", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      gas: "10000000",
      //   value: "100000000000000", // value in wei ~ 0.0001 eth
      value: web3.utils.toWei("2", "ether"),
    });
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    const newBalance = await web3.eth.getBalance(accounts[1]);
    assert(newBalance - initialBalance > web3.utils.toWei(1.8, "ether"));
  });
});
