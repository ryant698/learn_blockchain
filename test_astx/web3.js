const { Web3 } = require("web3"); // Replace with your Infura Project ID or provider URL
const infuraUrl =
  "https://mainnet.infura.io/v3/71122d970feb4a3f9bb2c5e4e4fcef58";
const web3 = new Web3(infuraUrl);

module.exports = web3;
