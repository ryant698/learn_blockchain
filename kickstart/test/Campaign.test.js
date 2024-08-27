const { Web3 } = require("web3");
const assert = require("assert");
const ganache = require("ganache");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts[0]);

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods.createCampaigns("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getCampaignsList().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deployed successfully!", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("verify campaign manager", async () => {
    const campaignManager = await campaign.methods.manager().call();
    assert.equal(accounts[0], campaignManager);
  });
});
