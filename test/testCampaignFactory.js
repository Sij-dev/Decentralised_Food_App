/**
 * @description Unit tests for verifying the 'food for all' contract factory
 * @author Sijesh P <sijesh.poovalapil@gmail.com>
 */

const FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

/** Test for campaign factory contract. */
contract('FoodForAll Campaign Factory Contract test', async (accounts) => {
  let ffaInstance;
  let ffaFactoryInstance;
  let coinbase;

  // Deploy the base contract and factory contract before executing the test
  beforeEach(async () => {
      ffaInstance = await FoodForAllCampaign.deployed();
      assert.ok(ffaInstance)
      ffaFactoryInstance = await CampaignFactory.deployed(ffaInstance.address);
      assert.ok(ffaInstance)
      coinbase = accounts[0];
  })
  
  //Create a new proxy contract instance using factory contract 
  it("CampaignFactory:New campaign creation using factory contract", async () => {

    let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester1",
      10,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 45.0000 , lon 23.23233 "
    );
    // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
    let deployedContractAddress1 = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
    assert.ok(deployedContractAddress1,"New contract address set")
  });

  /** 
   * test to access the FoodForAllCampaign using proxy and ensure requester details set properly in 
   * the storage 
   */
  it("CampaignFactory:Access FoodForAllCampaign contract created through factory, by mapping proxy", async () => {

    let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester1",
      10,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 45.0000 , long 23.23233"
    ); 
    let deployedContractAddress2 = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
    let ffaCreatedInstance = await FoodForAllCampaign.at(deployedContractAddress2);
    let requesterDetails=  await ffaCreatedInstance.getFfaRequesterSummary.call();
    assert.equal(requesterDetails[0],coinbase,"Requester name not set in the storage properly");
    assert.equal(requesterDetails[1],"FoodRequester1","Requester name not set in the storage properly");
  });

  /** 
   *  Create multiple contract and get the deployed contract details 
   *  the storage 
   */
  it("CampaignFactory:Create multiple contract and verify the created contract address ", async () => {

    let ContractTxnResult3 = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester1",
      10,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 45.0000 , long 23.23233"
    ); 
    let ContractTxnResult4 = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester2",
      20,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 55.0000 , long 25.4444"
    ); 
    let ContractTxnResult5 = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester3",
      30,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 65.0000 , long 35.4444"
    ); 

    let deployedContractAddress3 = ContractTxnResult3.logs["0"].args.newCampaignProxyAddr;
    let deployedContractAddress4 = ContractTxnResult4.logs["0"].args.newCampaignProxyAddr;
    let deployedContractAddress5 = ContractTxnResult5.logs["0"].args.newCampaignProxyAddr;

    let getDeployedContracts = await ffaFactoryInstance.getAllDeployedFoodCampaigns.call();
    // 2 test cases executed before this call by creating new contracts
    // So array position needs to be adjusted, starting from 2 onwards.
    assert.equal(getDeployedContracts[2],deployedContractAddress3,"DeployedContractAddress get error");
    assert.equal(getDeployedContracts[3],deployedContractAddress4,"DeployedContractAddress get error");
    assert.equal(getDeployedContracts[4],deployedContractAddress5,"DeployedContractAddress get error");

  });

  it("CampaignFactory: Validate the deployed contract count ", async () => {
    // Created 5 contracts prior to this test case
    let requesterDetails=  await ffaFactoryInstance.getTotalDeployedFoodCampaigns.call();
    assert.equal(requesterDetails,5,"Created 5 contracts prior to this test case, testcase position dependancy");

  });

  it("CampaignFactory:Validate the deployed contract withIndex ", async () => {
    // Created 5 contracts prior to this test case
    let ContractTxnResult6 = await ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester3",
      30,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 65.0000 , long 35.4444"
    ); 
    let deployedContractAddress6 = ContractTxnResult6.logs["0"].args.newCampaignProxyAddr;

    let contractAddressWithIndex=  await ffaFactoryInstance.getDeployedFoodCampaignWithIndex.call(5);
    assert.equal(deployedContractAddress6,contractAddressWithIndex,"DeployedContractAddress withIndex get error");
  });

  // Negative test cases 

  it("CampaignFactory -ve : Max quanitiy of food request should not exeed 5000 ", async () => {
    // Created 5 contracts prior to this test case
    await assert.isRejected( ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester3",
      5001,            
      1535461200, // Epoc time stamp
      "945666266662", 
      "lat : 65.0000 , long 35.4444"
    )); 
  });

  it("CampaignFactory -ve : Requester name should not exceed 100 character ", async () => {
    // Created 5 contracts prior to this test case
    await assert.isRejected( ffaFactoryInstance.foodForAllCreateNewCampaign(
      "kasjdfklasdjflkdjsalkfjdslkafjlkdsajflkdsjaflkjdsalfkjdslkfjadsiajskdfkdsajiouoiuoiuiouiouoiu9uu987jhkjhiujkjk;uio",
      30,            
      1535461200, // Epoc time stamp
      "94566626666298", 
      "lat : 65.0000 , long 35.4444"
    )); 
  });

  it("CampaignFactory -ve: Contract number should not exceed 30 character ", async () => {
    // Created 5 contracts prior to this test case
    await assert.isRejected( ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester3",
      30,            
      1535461200, // Epoc time stamp
      "9456662666945666266694566626669", 
      "lat : 65.0000 , long 35.4444"
    )); 
  });

  it("CampaignFactory -ve: Contract time should not excedd more than 30 days ", async () => {
    let time = (Date.parse('28 Oct 2018 13:00:00 GMT')/1000);
    // Created 5 contracts prior to this test case
    await assert.isRejected( ffaFactoryInstance.foodForAllCreateNewCampaign(
      "FoodRequester3",
      30,            
      time, // Epoc time stamp
      "945666266", 
      "lat : 65.0000 , long 35.4444"
    )); 
  });

});


