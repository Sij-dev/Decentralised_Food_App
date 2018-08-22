/**
 * @description Unit tests for upgrade the foodForAllCampaign Contract.
 * This is to demonstrat the capability to update the logic of foodforall 
 * campaign contract even after deployment. 
 * The contract has been implemented delegate-proxy pattern
 * and used proxy-friendly storage layout by seperating data and logic
 * @author Sijesh P <sijesh.poovalapil@gmail.com>
 */

const FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const FoodForAllCampaign2 = artifacts.require("FoodForAllCampaign2");
const FoodForAllCampaign2Update = artifacts.require("FoodForAllCampaign2Update");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

/** Test for campaign factory contract. */
contract('Upgrade contract test', async (accounts) => {
    let ffaInstance;
    let ffaFactoryInstance;
    let [coinbase,userAddress1, userAddress2,userAddress3,userAddress4] = accounts;
  
    //Create new  foodforall campain and factory contracts 
    beforeEach(async () => {
        ffaInstance = await FoodForAllCampaign.new();
        ffaFactoryInstance = await CampaignFactory.new(ffaInstance.address);
    });

    /**
     * This testcase is to test the contract updation after creating the FoodForAllCampaign.
     * This demostrate how to deploy a new logic (upgarde) in the already deployed 
     * foodforAll campagin contract.
     */
    it("New campaign creation using factory contract", async () => {
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
        "FoodRequester1",
        10,            
        1535482156, // Epoc time stamp 
        "945666266662", 
        "lat : 45.0000 , lon 23.23233"
        );
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        let ffa2UpdateInstance =  await FoodForAllCampaign2Update.new(ffaInstance.address,ffa2instance.address);

        // map the updated contract with exisiting proxy (upgrading the contract by updating master copy)
        let ffa2atProxyMappedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        assert.ok(
            await ffa2atProxyMappedInstance.updateMasterCopy(
                ffa2UpdateInstance.address,
                {from: coinbase}
            )
        );

    });

   
    // Verify the new logic and storage is accessable after upgrade.
    //( the new storage variable  contractLifeStatus flag and check value set properly
    it("Verify the newly updated contract logic and storage is accessable", async () => {
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
        "FoodRequester1",
        10,            
        1535482156, // Epoc time stamp 
        "945666266662", 
        "lat : 45.0000 , lon 23.23233"
        );
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        let ffa2UpdateInstance =  await FoodForAllCampaign2Update.new(ffaInstance.address,ffa2instance.address);

        // map the updated contract with exisiting proxy
        let ffa2atProxyMappedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        await ffa2atProxyMappedInstance.updateMasterCopy(ffa2UpdateInstance.address,{from: coinbase})

        // acces the contractlife status in the upgraded contract- this is a new storage added in 
        // the upgraded contract
        let contractLifeStatus = await ffa2atProxyMappedInstance.getContractLifeStatus.call();
        //ensure the updated contract status storage is accessable and value set to true.
        assert.equal(true,contractLifeStatus, "Contract status should be active");

    });


   /**
    * This test case is to check the old contract logic and storage is accessable after upgrade.
    * We should be able to retrive the old contract values from new contract after upgrade.
    * Which ensure data copy logic works fine and storage layout is aligning in new contract.
    */
    it("UpgradeTest:Verify the migration, old contract logic and storage is accessable in the upgraded contract", async () => {
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
        "FoodRequester1",
        10,            
        1535482156, // Epoc time stamp 
        "945666266662", 
        "lat : 45.0000 , lon 23.23233"
        );
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        let ffa2UpdateInstance =  await FoodForAllCampaign2Update.new(ffaInstance.address,ffa2instance.address);

        // map the updated contract with exisiting proxy
        let ffa2atProxyMappedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        await ffa2atProxyMappedInstance.updateMasterCopy(ffa2UpdateInstance.address,{from: coinbase})

        // acces the contractlife status in the upgraded contract- this is a new storage added in 
        // the upgraded contract
        let requesterDetails = await ffa2atProxyMappedInstance.getFfaRequesterSummary.call();
        //ensure the updated contract status storage is accessable and value set to true.
        assert.equal(requesterDetails[0],coinbase,"Requester name not set in the storage properly");
        assert.equal(requesterDetails[1],"FoodRequester1","Requester name not set in the storage properly");

    });
  /**
    * This test case is to check the old contract logic and storage is accessable after upgrade.
    * We should be able to retrive the old contract values from new contract after upgrade.
    * Which ensure data copy logic works fine and storage layout is aligning in new contract.
    */
   it("UpgradeTest -veTest:Only the contract owner shoul be able to upgrade the contract", async () => {
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
        "FoodRequester1",
        10,            
        1535482156, // Epoc time stamp 
        "945666266662", 
        "lat : 45.0000 , lon 23.23233"
        );
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        let ffa2UpdateInstance =  await FoodForAllCampaign2Update.new(ffaInstance.address,ffa2instance.address);

        // map the updated contract with exisiting proxy
        let ffa2atProxyMappedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        //Only contract deployer(owner) should be able to deploy the upgraded contract.
        await assert.isRejected(
            ffa2atProxyMappedInstance.updateMasterCopy(
                ffa2UpdateInstance.address,
                {from: userAddress1}
            )
        );
    });

    // Access the new logic implemented in the upgraded contract
    it("UpgradeTest: Verify the new functions are accessable ", async () => {
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
        "FoodRequester1",
        10,            
        1535482156, // Epoc time stamp 
        "945666266662", 
        "lat : 45.0000 , lon 23.23233"
        );
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        let ffa2UpdateInstance =  await FoodForAllCampaign2Update.new(ffaInstance.address,ffa2instance.address);

        // map the updated contract with exisiting proxy
        let ffa2atProxyMappedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        await ffa2atProxyMappedInstance.updateMasterCopy(ffa2UpdateInstance.address,{from: coinbase})

        // acces the contractlife status in the upgraded contract- this is a new storage added in 
        // the upgraded contract
        await ffa2atProxyMappedInstance.makeContractInactive();
        let contractLifeStatus = await ffa2atProxyMappedInstance.getContractLifeStatus.call();
        //ensure the updated contract status storage is accessable and value set to true.
        assert.equal(false,contractLifeStatus, "Contract status should be active");

    });

    
    it("UpgradeTest: Replace the master contract in the factory create new contract instance ", async () => {
        
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        //ffa2instance.address
        await ffaFactoryInstance.updateMasterContractCopy(ffa2instance.address);
  
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
            "FoodRequester1",
            10,            
            1535482156, // Epoc time stamp 
            "945666266662", 
            "lat : 45.0000 , lon 23.23233"
            );
        
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        assert.ok(ContractProxyAddr,"New contract address set")

    });

    it("UpgradeTest: Replace the master contract in the factory and access functions in the replaced contract ", async () => {
        
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        //ffa2instance.address
        await ffaFactoryInstance.updateMasterContractCopy(ffa2instance.address);
  
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
            "FoodRequester1",
            10,            
            1535482156, // Epoc time stamp 
            "945666266662", 
            "lat : 45.0000 , lon 23.23233"
            );
        
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;

        let ffaCreatedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        let requesterDetails=  await ffaCreatedInstance.getFfaRequesterSummary.call();
        assert.equal(requesterDetails[0],coinbase,"Requester name not set in the storage properly");
        assert.equal(requesterDetails[1],"FoodRequester1","Requester name not set in the storage properly");
  
    });

    it("UpgradeTest: access the new varialble introduced in the updated contract ", async () => {
        
        // deploy upgraded contract ffa-2
        let ffa2instance = await FoodForAllCampaign2.new();
        //ffa2instance.address
        await ffaFactoryInstance.updateMasterContractCopy(ffa2instance.address);
  
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
            "FoodRequester1",
            10,            
            1535482156, // Epoc time stamp 
            "945666266662", 
            "lat : 45.0000 , lon 23.23233"
            );
        
        // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
        let ContractProxyAddr = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
        assert.ok(ContractProxyAddr,"Address set properly");

        let ffaCreatedInstance = await FoodForAllCampaign2.at(ContractProxyAddr);
        let contractLifeStatus = await ffaCreatedInstance.getContractLifeStatus.call();
        //ensure the updated contract status storage is accessable and value set to true.
        assert.equal(false,contractLifeStatus, "Contract status should be active");
    });
})
