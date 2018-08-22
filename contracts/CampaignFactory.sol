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
    //mapping (address => address[] ) userContractMap; // TODO - delete function to be implemented.

    // Events broadcasted by the factory contract / Log events
    event CampaignCreation(
        address creator, 
        uint _deliverytime,
        FoodForAllCampaign newCampaignProxyAddr, 
        uint quantity
    );
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

    function getAllDeployedFoodCampaigns() 
        public 
        view 
        returns (address[]) 
    {
        return deployedFoodCampaigns;
    }

    function getDeployedFoodCampaignWithIndex(uint index) public view returns (address) {
        return deployedFoodCampaigns[index];
    }

    function getTotalDeployedFoodCampaigns()  
        public 
        view 
        returns (uint totalDeployedCampaigns ) 
    {
        totalDeployedCampaigns = deployedFoodCampaigns.length;
    }

}
