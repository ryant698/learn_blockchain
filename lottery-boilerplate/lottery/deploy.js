const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { interface, bytecode } = require("./compile");
require("dotenv").config();

const SEED = process.env.SEED;
const SEPOLIA_URL = process.env.SEPOLIA_URL;

const provider = new HDWalletProvider(
  SEED,
  // remember to change this to your own phrase!
  SEPOLIA_URL
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(interface);
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop(); // close the process to prevent terminal hanging
};
deploy();
