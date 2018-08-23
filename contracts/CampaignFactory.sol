/**
 * @description  FoodForAll factory contract 
 * @author SijeshP <sijesh.poovalapil@gmail.com>
 * @dev purpose of this contract to hide the base implementation behinde a facade so that user get a
 * consistant interface for creating campaign contract. Also get a summary details from this factory contract
 */

pragma solidity ^0.4.24;

import "./FfaCampaign.sol";
import "./UserMgmt.sol";
import "zeppelin/contracts/lifecycle/Pausable.sol";

/**
 * @title CampaignFactory - Food for All campaign factory contract  
 * @dev Factory contract hide the implementation details behind facade
 * Provide users with a consistant interface
 */
contract CampaignFactory is UserMgmt {
  
    // Campaign contracts
    FoodForAllCampaign private foodForAllCampaignMasterCopy;
    address[] private deployedFoodCampaigns;

    // Events broadcasted by the factory contract / Log events
    event CampaignCreation(
        address creator, 
        uint _deliverytime,
        FoodForAllCampaign newCampaignProxyAddr, 
        uint quantity
    );

    // to log event whenever a master contract update 
    event ContractUpdatedInFactory(address indexed contractOwner, uint time);
    
    /** 
    * @dev Set the Food for all master contract.This is the reference contract for the factory.
    * @param _campaignMasterCopy Maser contract copy of the food for all campaign .
    */
    constructor(FoodForAllCampaign _campaignMasterCopy)
        public
        onlyOwner()
        whenNotPaused()
    {
        foodForAllCampaignMasterCopy = _campaignMasterCopy;
    }

    /** 
    * @dev Creates new FoodForAllCampaign contract.
    * For every food requirement, creates a contract and track the supply and delivery
    * @param _requesterName food requriement requester
    * @param _quantity for how many people food required
    * @param _deliverytime when the food required.(currently made as 'string' for flexibility.)
    * @param _deliveryPointContactNo contact no. at the delivery point
    * @param _locationAddr food delivery location(TODO- add lat/log -integrate gmap frontend)
    */
    function foodForAllCreateNewCampaign(
        string _requesterName, 
        uint _quantity,
        uint _deliverytime, 
        string _deliveryPointContactNo, 
        string _locationAddr
    ) 
        public 
        whenNotPaused()
    {
        uint newCampaignIndex = deployedFoodCampaigns.length+1;
        FoodForAllCampaign newCampaignProxyAddr = FoodForAllCampaign(
            new FoodForAllCampaignProxy (
            foodForAllCampaignMasterCopy, 
            owner,
            msg.sender,
            _requesterName,  
            _quantity, 
            _deliverytime,      
            _deliveryPointContactNo, 
            _locationAddr,
            newCampaignIndex
        ));

        deployedFoodCampaigns.push(newCampaignProxyAddr);
        emit CampaignCreation(msg.sender, _deliverytime, newCampaignProxyAddr, _quantity);
    }

    /** 
     * @dev Set the Food for all master contract.This is the reference contract for the factory.
     * This will give a featur to upgrade only contract logic.
     * @param _campaignMasterCopy Maser contract copy of the food for all campaign .
     */
    function updateMasterContractCopy(FoodForAllCampaign _campaignMasterCopy)
        public
        onlyOwner()
        whenNotPaused()
    {
        foodForAllCampaignMasterCopy = _campaignMasterCopy;
        emit ContractUpdatedInFactory(msg.sender, now);
    }

    //retrives all the deployed campaigns
    function getAllDeployedFoodCampaigns() 
        public 
        view 
        returns (address[]) 
    {
        return deployedFoodCampaigns;
    }

    //retrives deployed campaigns with index
    function getDeployedFoodCampaignWithIndex(uint index) public view returns (address) {
        return deployedFoodCampaigns[index];
    }

    //get total deployed campaigns
    function getTotalDeployedFoodCampaigns()  
        public 
        view 
        returns (uint totalDeployedCampaigns ) 
    {
        totalDeployedCampaigns = deployedFoodCampaigns.length;
    }

}
