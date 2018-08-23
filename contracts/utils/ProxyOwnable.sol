pragma solidity ^0.4.24;

/**
 * @title ProxyOwnableData
 * Standard ownable contract , Keeps Data and logic seprate for proxy friendly 
 * this will enable us to provide in place upgradability.
 */
contract ProxyOwnableData {

    address internal upgradeOwner;
    
    modifier onlyUpgradeOwner() {
        require(msg.sender == upgradeOwner);
        _;
    }

    constructor(address _upgradeOwner)
        public
    {
        upgradeOwner = _upgradeOwner;
    }
}

/**
 * @title ProxyOwnable
 * Standard ownable contract ,
 * Implement owner transfer functionality
 */
contract ProxyOwnable is ProxyOwnableData {
    function setOwner(address newupgradeOwner)
        public
        onlyUpgradeOwner()
    {
        upgradeOwner = newupgradeOwner;
    }
}
