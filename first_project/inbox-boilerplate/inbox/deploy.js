const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
//updated web3 and hdwallet-provider imports added for convenience

// deploy code will go here
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "quiz slender card witness good arena consider fly grunt spoil comfort fortune",
  "https://sepolia.infura.io/v3/71122d970feb4a3f9bb2c5e4e4fcef58"
);

const web3 = new Web3(provider);
const INITIAL_STRING = "Hi World 698!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  console.log("Deploying contract for Inbox from account:", accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(
    "Contract successfully deployed to address: ",
    result.options.address
  );
};

deploy();
