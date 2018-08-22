# Design Patterns Decisions
 
 Objective of this document is to explain the design patterns used in the “FoodForAll decentralized application smart contracts and the reason for choosing the particular pattern.

### Factory contract pattern

Contract “Campaignfactory” is a factory contract, which creates “FoodForAll” campaign contract. “foodForAllCreateNewCampaign()” function in the contract creates new “FoodForAll” campaign contracts and keep a track of all the deployed campaigns in “deployedFoodCampaigns”.

The proxy factory implementation hides the base contract details behind a façade, providing users with consistent interface for creating “FoodForAll” campaigns. Also factory implementation facilitate the owner to change underlying implementation by upgrading the contract (master copy) 

### Mapping Iterator

Many times we need to iterate a mapping, but since mappings in Solidity cannot be iterated and they only store values, the Mapping Iterator pattern turns out to be extremely useful. This pattern has been implemented in “UserMgmt” contract. Store the index row numbers in the mapped user structures because we can look up that information using key values. The stored structures should point to their respective ‘userIndex’ rows, so we don’t have a problem pinpointing index rows when we need them.
```
mapping(address => UserData) private  users;
address[] private userIndex;
```
By using this pattern gas consumption is expected to remain approximately consistent at any scale because each write operation proceeds in a step-by-step fashion with no branching or loops. This enables to iterate with minimum cost.

### State Machine Pattern

This has been implemented because “FoodForAll“ contract traverse through different states during its life cycle, from “ Requested to FoodDeliveryAck”. (ref. enum ContractStatus ). 
Implementation of the  modifier atContractStatus(ContractStatus _status) guards against incorrect usage of the contract and its state.

### Guard Check

In this project, in many cases user entries are expected. We have to ensure the behavior of the smart contract and its expected input parameters are valid and within the range.
The require() has been used in many part of the contracts (CampaignFactory, FoodForAll, UserMgmt, UpdatableProxy ) to restrict the unacceptable user inputs.

For e.g. in “FoodForAll” contract , the picktime, delivery time etc. set in 30 days range. This avoids malicious time entry. Also many cases user input entries restricted with in range.All the checks has been implemented in the beginning of the functions.

### Restricting Access

This pattern has been used to restrict the read access to state of the contracts by external entities. This has been achieved by declaring the critical state variables as private or internal. Also critical functions access has been restricted using modifiers() in many part of the contracts (CampaignFactory, FoodForAll, UserMgmt, UpdatableProxy ). Modifiers restrict the access to contract functionality according to suitable criteria. 

### Emergency Stop (Circuit Breaker)

CircutBreaker (Pausable) has been implemented to restrict the attack till we upgrade the contract for a known issue. Any new contract creation or user management functions can be restricted once we identify an unexpected behavior or hack of the deployed contract.

“Pausable” contract has been inherited ( EthPM package manager library) to implement the EmergencyStop functionality in UserMgmt and CampaignFactory contracts. Once “Paused” (Stoped in case of emergency) creation of new contracts, update of the mastercontract, user signup, update or delete functionality has been stopped. Only owner can pause (or unpause) during emergency. Modifier “WhenNotPaused()” used to implement this functionality.

### Ownership

This has been used to limits access to certain critical functions to only the owner of the contract.

### DelegateProxy Pattern (Upgradability pattern)

Delegate proxy pattern has been used primarily to overcome the problem of in place upgrade of an existing contract by migrating the data. Also we have to address high overall cost of deployment. 

Traditional library driven development produces contract with redundancy. The state and method parameters have to be passed down into the linked library, and method declarations and events are repeated.

Using generic proxy with proxy-friendly storage layout by moving the contract constructor code out of the base class (FoodForAllCampaign) in to a proxy subclass (FoodForAllCampaignProxy), we can avoid,
-	deploying the base class with the extra initialization method
-	modifying the original contract to make sure state initialization only occurs once and only on an uninitialized state
-	risking having initialization on an uninitialized contract state hijacked by an unauthorized party

Also by using Proxy factories (CampaignFactory) hide the implementation detail behind a facade, providing users with a consistent interface for creating something functionally equivalent to FoodForAllCampaign instances.
By doing this, instances created by the factory method are initialized properly, without any risk of another user intervening in the initialization step. Moreover, our proxy-producing factory is a drop-in replacement for the full instance factory, and the cost of creating new FoodForAllCampaign instances will be drastically cut with the use of this proxy-producing factory. Using the “Update” interface we can move the data migration logic to proxied contract.

Please refer technical spec and design diagrams (Readme.md) to understand the design and how the data and logic separated to create the cheap clone. Thanks to "Alan Lu"  of "Gnosis" for his research on “Delegate proxy” contracts, by using the same we could able to implement upgradability mechanism and way to save gas when deploying many instance of a particular contract.


## Patterns Not Used

### Checks Effects Interactions

Even though there is no value (token) transfer functionalities has been implemented in the project, it has been taken care to update all state variables prior to the external interaction. Also all the checks has been implemented in the beginning of the functions.

Similarly the following patterns also have not been used because these patterns are mainly for value (token) transfers. As mentioned this project (in its current scope) not dealing any token transfers.

-	Withdrawal pattern
-	Rejector pattern
-	Pull over Push




