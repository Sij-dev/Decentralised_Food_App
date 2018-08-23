/**
 * @description  FoodForAll upgrade contract
 * @author SijeshP <sijesh.poovalapil@gmail.com>
 * @dev purpose of this contract to demonstrat the capability of upgrading the already deployed base contract and
 * deploy upgraded contract through factory for future. 2 kind of upgrade features has been tested.
 *(ref: upgrade test file) by implementing delegate proxy apprch, we can do both inplace upgrade of  
 * already deployed contract with data migration and deploy upgraded contract through factory for the 
 * future purpose.
 */
pragma solidity ^0.4.11;
import "./FfaCampaign.sol";


/**
 * @title FoodForAllCampaign2DataInternal - upgraded version of base contract data contract.
 * @dev Upgrade the contract to implement contract life status ( active/ deactive )
 * aligned storage layout of the base contract and added one more date field
 */
contract FoodForAllCampaign2DataInternal is FoodForAllCampaignDataInternal {
    bool internal contractLifeStatus;  
}


/**
 * @title FoodForAllCampaign2Proxy - upgraded version of base contract initialisation logic
 * @dev Upgrade the contract to implement revised logic
 */
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
        contractLifeStatus = true;
    }
}

/**
 * @title FoodForAllCampaign2 - upgraded version of base contract main function logic
 * @dev Upgrade the contract to implement revised logic
 */
contract FoodForAllCampaign2 is FoodForAllCampaign,FoodForAllCampaign2DataInternal {
    
    // function for changing contract status
    function makeContractInactive() 
        public 
        onlyUpgradeOwner()
    {
        require(contractLifeStatus,"Contract should be active ");
        contractLifeStatus = false;
    }
    
    // updating the base contract logic with newely avialble parameter.
    function contributeByProduceFood (string _producerName) public {
        require(contractLifeStatus,"Contract should be active ");
        super.contributeByProduceFood(_producerName);
    }

    function getContractLifeStatus() public view returns(bool) {
        return contractLifeStatus;
    }

}

/**
 * @title FoodForAllCampaign2 - upgraded version of base contract main function logic
 * @dev update interface describes how storage should be migrated from a FoodForAllCampaign
 * compatable to data set to FoodForAllCampaign2 
 */
contract FoodForAllCampaign2Update is
    FoodForAllCampaignDataInternal,
    FoodForAllCampaign2DataInternal,
    Update
{
    FoodForAllCampaign internal ffaCampaign;
    FoodForAllCampaign2 internal ffaCampaign2;

    // construct sets old and upgrade versions of the contract.
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
    
    // updating the data value in the upgraded contract.
    function migrateData() external {
        contractLifeStatus = true;
    }
}
