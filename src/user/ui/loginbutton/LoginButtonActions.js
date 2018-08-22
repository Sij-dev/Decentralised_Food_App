import CampaignFactoryContract from '../../../../build/contracts/CampaignFactory.json'
import FoodForAllCampaignContract from '../../../../build/contracts/FoodForAllCampaign.json'
import { browserHistory } from 'react-router'
import store from '../../../store'

const contract = require('truffle-contract')

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser() {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return async function(dispatch) {
      //Using truffle-contract we create the authentication object.
      const foodForAllCampaign = contract(FoodForAllCampaignContract);
      const campaignFactory = contract(CampaignFactoryContract);
      console.log("Contract artifacts in Login");

      campaignFactory.setProvider(web3.currentProvider);
      foodForAllCampaign.setProvider(web3.currentProvider)
      
      const account = await web3.eth.coinbase;
      console.log("login account", account)

      const foodForAllInstance = await foodForAllCampaign.deployed();
      const campaignFactoryInstance = await campaignFactory.deployed(foodForAllInstance.address);
      let result = await campaignFactoryInstance.userLogin({from: account});
      console.log("login:",result);
    
      var userName = web3.toUtf8(result)
      console.log("login:",userName)

      dispatch(userLoggedIn({"name": userName,"address":account}))

      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

        return browserHistory.push('/dashboard')
        //return browserHistory.push('/participate')
      }
  } else {
    console.error('Web3 is not initialized.');
  }
}
