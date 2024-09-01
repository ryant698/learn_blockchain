const { Web3 } = require("web3"); // Replace with your Infura Project ID or provider URL
require("dotenv").config();
require("dotenv").config();

const ETH_URL = process.env.ETH_URL;
const infuraUrl = ETH_URL;
const web3 = new Web3(infuraUrl);

module.exports = web3;
