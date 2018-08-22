import CampaignFactoryContract from '../../../../build/contracts/CampaignFactory.json'
import FoodForAllCampaignContract from '../../../../build/contracts/FoodForAllCampaign.json'
import store from '../../../store'

const contract = require('truffle-contract')

export const USER_UPDATED = 'USER_UPDATED'
function userUpdated(user) {
  return {
    type: USER_UPDATED,
    payload: user
  }
}

export function updateUser(name) {
  let web3 = store.getState().web3.web3Instance

  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return async function(dispatch) {
      // Using truffle-contract we create the authentication object.
      const foodForAllCampaign = contract(FoodForAllCampaignContract);
      const campaignFactory = contract(CampaignFactoryContract);
      console.log("Contract artifacts OK");
     
      campaignFactory.setProvider(web3.currentProvider);
      foodForAllCampaign.setProvider(web3.currentProvider)

      const account = await web3.eth.coinbase;
      console.log("login account", account)

      const foodForAllInstance = await foodForAllCampaign.deployed();
      const campaignFactoryInstance = await campaignFactory.deployed(foodForAllInstance.address);

      //Dummy value - Need to get from front end.
      let updateEmail = 'xxxx@gmail.com';
      let updatePhoneNo = '872634';
      let ipfshash = ''
      console.log ("User update");
      let userUpdateResult = await campaignFactoryInstance.userUpdate(name,updateEmail,updatePhoneNo ,{from: account});

      dispatch(userUpdated({"name": name}))

      return alert('Name updated!')

    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
