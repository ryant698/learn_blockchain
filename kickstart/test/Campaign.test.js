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
  it("verify approver", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(true, isApprover);
  });
  it("verify minimum contribution constrain", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: "90",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("verify request created successfully", async () => {
    await campaign.methods.createRequest("Buy Games", 100, accounts[1]).send({
      from: accounts[0],
      gas: "3000000", // Reasonable gas limit
    });

    const request = await campaign.methods.requests(0).call();
    const requestDescription = request.description;
    assert.equal("Buy Games", requestDescription);
  });
});
