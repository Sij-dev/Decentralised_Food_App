/**
 * @description Unit tests the User management functions
 * User managment has been seperated as library for reusing purpose.
 * Later FFA can access standarard user mgmt module for user mgmt.
 * @author Sijesh P 
 */
const FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const assert = chai.assert;

var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
web3 = new Web3(provider);

/** Test for campaign factory contract. */
contract('User management functionality test', async (accounts) => {
    let ffaInstance;
    let ffaFactoryInstance;
    let [coinbase,userAddress1, userAddress2,userAddress3,userAddress4]= accounts;
    // 1st user details
    let userName1 = "UserName-1"
    let useremail1 = "xxxx@gmail.com"
    let userPhone1 = "29034983"
    let useripfsHash1 = "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85";
    // 2nd User details
    let userName2 = "UserName-2"
    let useremail2 = "xxxx2@gmail.com"
    let userPhone2 = "200000000"
    let useripfsHash2 = "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85";
  
    // Deploy the base contract and factory contract before executing the test
    beforeEach(async () => {
        ffaInstance = await FoodForAllCampaign.deployed();
        ffaFactoryInstance = await CampaignFactory.deployed(ffaInstance.address);
    })

    // signup new user and check the user count updated properly 
    it(" Test the user signUp", async () => {
      assert.ok(await ffaFactoryInstance.userSignup(userName1,useremail1,userPhone1,useripfsHash1,{from: userAddress1}));
      let userCount = await ffaFactoryInstance.getUserCount();
      assert.equal(userCount,1,"User  not updated");
    });

    // login with earlier signed up address.
    it(" Test the user Login", async () => {
      let getUserLoginName = await ffaFactoryInstance.userLogin({from :userAddress1});
      assert.equal(web3.toUtf8(getUserLoginName),userName1,"Signup is not success");
    });

    // Test the user update functionality, verify updated in storage properly use getUserSummary
    it(" Test the user Update ", async () => {
      let Name2,email2,Phone2, ipfsHash2;
      await ffaFactoryInstance.userUpdate(userName2,useremail2,userPhone2,{from: userAddress1});
      [Name2,email2,Phone2,ipfsHash2] = await ffaFactoryInstance.getUserSummary(userAddress1,{from: userAddress1});
      assert.equal(web3.toUtf8(Name2),userName2,"User Update is not success");
    });
    
    //  Test user index functionality 
    it(" Test the user index update in storage", async () => {
      assert.ok(await ffaFactoryInstance.userSignup(userName2,useremail2,userPhone2,useripfsHash2,{from: userAddress2}));
      let index = await ffaFactoryInstance.getUserIndex({from :userAddress2});
      let getUserAddress = await ffaFactoryInstance.getUserAddressAtIndex(index,{from :userAddress2});
      assert.equal(getUserAddress,userAddress2,"User  not updated");
    });
    
    //  Test user delete functionality 
    it(" Test the user delete functionaliy and verify the storage update", async () => {
      let userCountBefore = await ffaFactoryInstance.getUserCount();
      assert.ok(await ffaFactoryInstance.deleteUser({from: userAddress2}));
      let userCountAfter = await ffaFactoryInstance.getUserCount();
      assert.equal(userCountBefore-1,userCountAfter,"Get the user not deleted from storage");
    });

    //Negative test cases - only non registered user should signup
    it(" Signup should not allow for already registered user ", async () => {
      await assert.isRejected(ffaFactoryInstance.userSignup(userName1,useremail1,userPhone1,useripfsHash1,{from: userAddress1}));
    });

    //Negative test cases - only egistered user should be able to login
    it(" Login should not allow for non-registered user  ", async () => {
      await assert.isRejected(ffaFactoryInstance.userLogin({from :userAddress2}));
    });

    //Negative test cases - only registered user should be able to update the record.
    it(" Update should not allow for non-registered user  ", async () => {
      await assert.isRejected(ffaFactoryInstance.userUpdate(userName2,useremail2,userPhone2,{from: userAddress2}));
    });
    
    //Negative test cases - a user able to delete only his record.
    it(" Update should not allow for non-registered user  ", async () => {
      await assert.isRejected(ffaFactoryInstance.deleteUser({from: userAddress2}));
    });

    //  Test to delete last user (Boundary condition).
    it(" Test - Delete the only exisiting user.(Boundary condition)", async () => {
      let userCountBefore = await ffaFactoryInstance.getUserCount();
      await ffaFactoryInstance.deleteUser({from: userAddress1});
      assert.equal(userCountBefore-1,0,"Last user - Not able to delete only last existing user");
    });
  
    
})