import CampaignFactoryContract from '../../../../../build/contracts/CampaignFactory.json'
import FoodForAllCampaignContract from '../../../../../build/contracts/FoodForAllCampaign.json'
import {getAllCampaignList} from '../campaignlist/campaignlistAction'
import store from '../../../../store'
import { browserHistory } from 'react-router'

const contract = require('truffle-contract')

export const NEW_CAMPAIGN_SUBMITTED = 'NEW_CAMPAIGN_SUBMITTED'
function newCampaignCreated(campaigndata) {
  return {
    type: NEW_CAMPAIGN_SUBMITTED,
    payload: campaigndata
  }
}

//action
export function newCampaignCreation(values) {
    let web3 = store.getState().web3.web3Instance
    let name = store.getState().user.data.name

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

        let unixEpocTime = (Date.parse(values.time)/1000);
        let newCampaign = await campaignFactoryInstance.foodForAllCreateNewCampaign(
            name,
            values.quantity,
            unixEpocTime,
            values.deliveryNo,
            values.locAddr,
            {from: account}
        );
        let newCampaignAddress = newCampaign.logs["0"].args.newCampaignProxyAddr;
        
        dispatch(newCampaignCreated({newCampaign: newCampaign}))
        alert('New Campaign Created by :'+name+'with address'+newCampaignAddress);
        console.log("new campaign address ",newCampaignAddress);

       let totalcampaign=  await campaignFactoryInstance.getTotalDeployedFoodCampaigns.call();
       console.log("total campaigns deployed",totalcampaign);

        let newFfaInstance = await foodForAllCampaign.at(newCampaignAddress);
        console.log("New instance",newFfaInstance.address);

        let deployedcampaigns = await campaignFactoryInstance.getAllDeployedFoodCampaigns.call();
        console.log("Deployed Campaigns",deployedcampaigns);

        // added the code for testing from front-end. For producer, new screen needs to be developed.
        // let produceTxn=  await newFfaInstance.contributeByProduceFood(name,{from: account});
        // console.log('Ready to produce food :'+name+'with address'+produceTxn);

        // Used a manual redirect here as opposed to a wrapper.
        // This way, once logged in a user can still access the home page.
    
        return dispatch(getAllCampaignList())
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}
