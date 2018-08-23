pragma solidity ^0.4.24;
import "./Proxy.sol";
import "./ProxyOwnable.sol";

/** 
 * @title Update - Interface
 * This is an interface which will help to upgrade the contract
 * This helps to migrate storage state during an update.
 */
interface Update {
    function implementationBefore() external view returns (address);
    function implementationAfter() external view returns (address);
    function migrateData() external;
}

//Data keeps seperate for inheritance - data and logic sepration for upgradability
contract UpdatableProxyData is ProxyData, ProxyOwnableData {}

// Implementes Update interface, upgraded the contract and migrate the data from old contract
contract UpdatableProxyShared is ProxyData, ProxyOwnable {
    
    function updateMasterCopy(Update update)
        public
        onlyUpgradeOwner
    {
        //masterCopy = newMasterCopy;
        require(update.implementationBefore() == masterCopy);
        masterCopy = update;
        Update(this).migrateData();
        masterCopy = update.implementationAfter();

    }
}

contract UpdatableProxyImplementation is UpdatableProxyShared {
    constructor() public ProxyOwnableData(0) {}
}