var FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
var CampaignFactory = artifacts.require("CampaignFactory");
//var UserMgmtLib = artifacts.require("UserMgmtLib.sol");

module.exports = function(deployer) {
  deployer.deploy(FoodForAllCampaign).then(() => {
     return deployer.deploy(CampaignFactory, FoodForAllCampaign.address);
  });
};



