pragma solidity ^0.4.24;

/**
 * @title ProxyData
 * @dev This is Proxy-firendly storage layout for generic proxy contract to seperate 
 * data and logic
 * ref : https://blog.gnosis.pm/solidity-delegateproxy-contracts-e09957d0f201
 */

contract ProxyData {
    address internal masterCopy;        // holds the master copy address 
}

/**
 * @title Proxy -Generic proxy contract 
 * @dev  Indicates that a contract will be proxied.
 * allows to execute all transactions applying the code of a master contract.
 * data seperated from logic for maintain the storage layout
 */

contract Proxy is ProxyData {

    /** @dev Constructor function sets address of master copy contract.
        * @param _masterCopy Master copy address.
        */
    constructor(address _masterCopy)
        public
    {
        require(_masterCopy != 0);
        masterCopy = _masterCopy;
    }

    ///@dev Fallback function forwards all transactions and returns all received return data.
    function ()
        external
        payable
    {
        
        address _masterCopy = masterCopy;
        // Assembly to act proxy . Execute the logic in the master contract with supplied data in the proxy
        // Using returndatacopy and returndatasize recommended in EIP 211. 
        assembly {
            let freememstart := mload(0x40)
            calldatacopy(freememstart, 0, calldatasize())
            let success := delegatecall(not(0), _masterCopy, freememstart, calldatasize(), freememstart, 0)
            returndatacopy(freememstart, 0, returndatasize())
            switch success
            case 0 { revert(freememstart, returndatasize()) }
            default { return(freememstart, returndatasize()) }
        }
    }

}



