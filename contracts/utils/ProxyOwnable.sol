pragma solidity ^0.4.24;

//Standard ownable contract , Keeps Data and logic seprate for proxy friendly and upgradability 
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

//Standard ownable contract , Kept Data in another contract seperately. Implement owner transfer functionality
contract ProxyOwnable is ProxyOwnableData {
    function setOwner(address newupgradeOwner)
        public
        onlyUpgradeOwner()
    {
        upgradeOwner = newupgradeOwner;
    }
}
