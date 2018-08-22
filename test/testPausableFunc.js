/**
 * @description Unit tests to check the pausable functionality
 * Pasuable implemented for CampaignFactory and User Mgmt functions,
 * In case any emergency, nobody should be able create new contracts or 
 * Create, update or delete users. 
 * @author Sijesh P 
 */

const FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

/** Test for campaign factory contract. */
contract('Test Circuit Breakers-stop execution if certain conditions are met', async (accounts) => {
    let ffaInstance;
    let ffaFactoryInstance;
    let [coinbase,userAddress1, userAddress2,userAddress3,userAddress4] = accounts;

    // Deploy the base contract and factory contract before executing the test
    beforeEach(async () => {
        ffaInstance = await FoodForAllCampaign.deployed();
        ffaFactoryInstance = await CampaignFactory.deployed(ffaInstance.address);
    });

    //Pause the contract in case of emergency 
    it("Pause the contract in case of emergency and should not allcw to create new ffa_Campaign", async () => {
        ffaFactoryInstance.pause();
        // new campaign shold fail
        await assert.isRejected(
            ffaFactoryInstance.foodForAllCreateNewCampaign(
                "FoodRequester1",
                10,            
                1535461200, // Epoc time stamp
                "945666266662", 
                "lat : 45.0000 , lon 23.23233",
                {from: userAddress1}
            )
        );
    });

    // Unpause the contract and create new contract.
    it("UnPause the contract once the emergency is over and create new campaign", async () => {
        ffaFactoryInstance.unpause();
        let newContractTxnResult = await ffaFactoryInstance.foodForAllCreateNewCampaign(
            "FoodRequesterUnPause",
            50,            
            1535461400, // Epoc time stamp
            "945666266662", 
            "lat : 15.0000 , lon 33.23233"
          );
          // get the newely created contract address from log.(map proxy address to FoodForAllCampaign address)
          let deployedContractAddress1 = newContractTxnResult.logs["0"].args.newCampaignProxyAddr;
          assert.ok(deployedContractAddress1,"New contract address set")
    });

    // Test circuit breaker , Signup should not allow in case of emergency 
    it("Pause  in case of emergency and should not allcw to create new user", async () => {
        await ffaFactoryInstance.pause();
        //if pause is enabled, even owner can not create new user. below tried to create using "coinbase"
        await assert.isRejected( 
            ffaFactoryInstance.userSignup(
                "userName1",
                "useremail1@gmail.com",
                "90002002",
                "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85",
                {from: coinbase}
            )
        );
    });
    // Test circuit breaker , if already Paused, should not pause again 
    it("Already emergency stopped, should not allcw to stop again", async () => {
        await assert.isRejected(ffaFactoryInstance.pause({from: coinbase}));
        await ffaFactoryInstance.unpause({from:coinbase});
    });

    // Test circuit breaker , Only contract deployer shold Emergency Pause/UnPause
    it("Only contract deployer shold Emergency Pause/UnPause", async () => {
        await assert.isRejected(ffaFactoryInstance.pause({from:userAddress1 }));
        // by default, sender is coinbase i.e deployer.
        await ffaFactoryInstance.pause();
    });

    // Test circuit breaker , Update should not allow in case of emergency 
    it("Pause  in case of emergency and should not allcw to update user info", async () => {
       // already paused in previous test case.
        await assert.isRejected( 
            ffaFactoryInstance.userUpdate(
                "userName2",
                "useremail2@gmail.com",
                "900030003",
                "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85",
                {from: coinbase}
            )
        );
        
    });
    /**
     * Test circuit breaker, User delete should not allow in case of emergency 
     * After unPause create new user and delete the created user.
     */
    it("Pause in case of emergency and should not allcw to delete user info", async () => {
        await ffaFactoryInstance.unpause({from:coinbase});
        await ffaFactoryInstance.userSignup(
            "userName1",
            "useremail1@gmail.com",
            "90002002",
            "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85",
            {from: userAddress1}
        );
        await ffaFactoryInstance.pause({from:coinbase});
        // trying to delete by owner.
        await assert.isRejected(ffaFactoryInstance.deleteUser({from:coinbase}));
        // trying to delete by the user.
        await assert.isRejected(ffaFactoryInstance.deleteUser({from:userAddress1}));
        await ffaFactoryInstance.unpause();
        assert.ok(await ffaFactoryInstance.deleteUser({from:userAddress1}));
    });
    
})
