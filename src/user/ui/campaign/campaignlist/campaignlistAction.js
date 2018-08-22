import CampaignFactoryContract from '../../../../../build/contracts/CampaignFactory.json'
import FoodForAllCampaignContract from '../../../../../build/contracts/FoodForAllCampaign.json'
import store from '../../../../store'
import { browserHistory } from 'react-router'

const contract = require('truffle-contract')

export const GET_CAMPAIGN_LIST = 'GET_CAMPAIGN_LIST'
function submitDeployedCampaigns(allCampaignlist) {
  return {
    type: GET_CAMPAIGN_LIST,
    payload: allCampaignlist
  }
}

//action
export function getAllCampaignList() {
    let web3 = store.getState().web3.web3Instance
   
  // Double-check web3's status.
  if (typeof web3 !== 'undefined') {

    return async function(dispatch) {
        // Using truffle-contract we create the authentication object.
        const foodForAllCampaign = contract(FoodForAllCampaignContract);
        const campaignFactory = contract(CampaignFactoryContract);
        
        campaignFactory.setProvider(web3.currentProvider);
        foodForAllCampaign.setProvider(web3.currentProvider)

        const account = await web3.eth.coinbase;
        console.log("login account", account)

        const foodForAllInstance = await foodForAllCampaign.deployed();
        const campaignFactoryInstance = await campaignFactory.deployed(foodForAllInstance.address);

        let deployedcampaigns = await campaignFactoryInstance.getAllDeployedFoodCampaigns.call();
        console.log("Deployed Campaigns",deployedcampaigns);

        dispatch(submitDeployedCampaigns({deployedcampaigns: deployedcampaigns}))
        
        var currentLocation = browserHistory.getCurrentLocation()

        if ('redirect' in currentLocation.query){
            return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
        } 
        return browserHistory.push('/campaignlist')

    }
  } else {
    console.error('Web3 is not initialized.');
  }
}