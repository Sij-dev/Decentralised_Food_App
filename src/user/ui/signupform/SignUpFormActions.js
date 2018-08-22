import CampaignFactoryContract from '../../../../build/contracts/CampaignFactory.json'
import FoodForAllCampaignContract from '../../../../build/contracts/FoodForAllCampaign.json'
import { loginUser } from '../loginbutton/LoginButtonActions'

import store from '../../../store'

const contract = require('truffle-contract')


export function signUpUser(name,ipfsHash) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

      return async function(dispatch) {
      //Using truffle-contract we create the authentication object.
      const foodForAllCampaign = contract(FoodForAllCampaignContract);
      const campaignFactory = contract(CampaignFactoryContract);
      console.log("Contract artifacts inSignUp");

      campaignFactory.setProvider(web3.currentProvider);
      foodForAllCampaign.setProvider(web3.currentProvider)


      // Declaring this for later so we can chain functions on Authentication.

      // const accounts = await web3.eth.accounts;
      let coinbase = web3.eth.coinbase;
      console.log("signup account",coinbase);

      const foodForAllInstance = await foodForAllCampaign.deployed();
      console.log ("FoodforAll instance address",foodForAllInstance.address)
      const campaignFactoryInstance = await campaignFactory.deployed(foodForAllInstance.address);
      console.log ("campagin  instance address",campaignFactoryInstance.address)
      
       //Dummy value - Need to get from front end.
      let email = 'xxxx@gmail.com';
      let phoneNo = '872634';

      console.log ("User signup", ipfsHash);
      let result = await campaignFactoryInstance.userSignup(name,email,phoneNo,ipfsHash,{from: coinbase});
      console.log ("User signup completed. Login user calling");
      return dispatch(loginUser())

    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
