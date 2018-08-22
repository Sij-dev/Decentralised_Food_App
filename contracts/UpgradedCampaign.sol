pragma solidity ^0.4.11;
import "./FfaCampaign.sol";

/* Upgrade the contract to implement contract life status ( active/ deactive )
*  if the contract purpose is over, it's eligible for self destruct. 
*  Functionality needs to be implemented (TODO)
*/

contract FoodForAllCampaign2DataInternal is FoodForAllCampaignDataInternal {
    bool internal contractLifeStatus;  
}

// contract FoodForAllCampaign2Data is FoodForAllCampaignData {
//     bool public contractLifeStatus;
// }

contract FoodForAllCampaign2Proxy is FoodForAllCampaignProxy, FoodForAllCampaign2DataInternal {
    constructor (
        address _masterContractAddr, 
        address _contractOwner,
        address _requesterAddress,
        string _requesterName, 
        uint _quantity, 
        uint _deliverytime, 
        string _deliveryPointContactNo, 
        string _locationAddr,
        uint _campaingIndex
    )
        public 
        FoodForAllCampaignProxy (
            _masterContractAddr, 
            _contractOwner,
            _requesterAddress,
            _requesterName, 
            _quantity, 
            _deliverytime, 
            _deliveryPointContactNo, 
            _locationAddr,
            _campaingIndex
        )

    {
        // set contract is active. Once the food is delivererd set status to false
        // to destruct the contract by owener
        contractLifeStatus = true;
    }
}

contract FoodForAllCampaign2 is FoodForAllCampaign,FoodForAllCampaign2DataInternal {
    
    function makeContractInactive() 
        public 
        onlyUpgradeOwner()
    {
        require(contractLifeStatus,"Contract should be active ");
        contractLifeStatus = false;
    }
    
    function contributeByProduceFood (string _producerName) public {
        require(contractLifeStatus,"Contract should be active ");
        super.contributeByProduceFood(_producerName);
    }

    function getContractLifeStatus() public view returns(bool) {
        return contractLifeStatus;
    }

}

contract FoodForAllCampaign2Update is
    FoodForAllCampaignDataInternal,
    FoodForAllCampaign2DataInternal,
    Update
{
    FoodForAllCampaign internal ffaCampaign;
    FoodForAllCampaign2 internal ffaCampaign2;
    constructor(FoodForAllCampaign _ffaCampaign, FoodForAllCampaign2 _ffaCampaign2)
        public
        ProxyOwnableData(0)
    {
        ffaCampaign = _ffaCampaign;
        ffaCampaign2 = _ffaCampaign2;
    }

    function implementationBefore() external view returns (address)
    {
        return ffaCampaign;
    }
    
    function implementationAfter() external view returns (address) {
        return ffaCampaign2;
    }
    
    function migrateData() external {
        contractLifeStatus = true;
    }
}
