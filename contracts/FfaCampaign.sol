/**
 * @description  FoodForAll base contract
 * @author SijeshP <sijesh.poovalapil@gmail.com>
 * @dev The purpse of this contract is to create a decentralised food distribution system
 * for the people who are struggling to get for food to stay alive.
 * One side, there are lot of food wastage and the other side people are hungry in the same city/place.
 * Many hotels/houses throwing the food after lunch/dinner and people are dying
 * Those who are aware about the people who are hungry can create a ffa campaign with 
 * location details, quantity of the people required food , approximate time of delivery etc.
 * (any volunteer or the hungry person/group itself can create campaign
 * Once the campaign is init
 ated, volunteers can contribute by supplying food or delivery 
 * the supplied food to the desired location. 
 * (Please read the draft whitepaper for details - included along with this project submission)
 * @notice The contract has been splitted to seperate data and logic (to make this proxy friendly)
 * by splitting this way, we can deploy the campain contract with minimum cost.Also in place contract
 * upgrade is possible by migrating data. 
 * CAUTION: storage must be aligned while writing the upgrade contract.
 */


pragma solidity ^0.4.11;

import "./Utils/Proxy.sol";
import "./Utils/UpdatableProxy.sol";
import "zeppelin/contracts/lifecycle/Pausable.sol";


/** @title FoodForAllCampaignHeader 
 *  HeaderContract contains all the events and enums. The events has been seperated from the main logic 
 *  and data to make the layout proxy-friendly, which will help reduce the cost on contract
 *  creation and make the contract upgradable. 
 */
contract FoodForAllCampaignHeader {
    // FFA contract workflow status
    enum ContractStatus {
         NotCreated,
         Requested,
         ProducerReady, 
         DeliveryPersonReady, 
         FoodReadyForDelivery,
         FoodOutForDelivery,
         FoodDelivered,
         FoodDeliveryAck
    }
    event FoodForAllCampaignProxyCreated (
        address indexed ContractOwner,
        address indexed requesterAddress,
        uint indexed quantity,
        string _locationAddr
    );
    event FoodProducerReady(address indexed producerAddress, string producerName);
    event FoodDeliveryPersonReady(address indexed deliveryPersonAddress, string deliveryPersonName);
    event FfaStatusChange(address indexed statusModifier,ContractStatus newStatus);
    event FoodProductionReadyTimeSet(address indexed producer, uint expectedProdReadyTime);
    event FoodDeliveryPickUpTimeSet(address indexed deliveryPerson, uint deliveryPickTime);
}


/** 
 * @title FoodForAllCampaignDataInternal 
 *  Contract contains all the data. The data has been seperated from the main logic 
 *  to make the layout proxy-friendly and made internal for access restriction.
 *  This data-logic seprtation  will help reduce the cost on contract
 *  creation and make the contract upgradable by aligning the storage layout
 */
contract FoodForAllCampaignDataInternal is UpdatableProxyData,FoodForAllCampaignHeader {

    address internal requesterAddress;      // food requester address
    string internal requesterName;          //  food requester name
    address internal producerAddress ;      //  food supplier address
    string internal producerName;           // food supplier name
    uint internal productionReadyTime;      //  time when the food will be ready 
    address internal deliveryPersonAddress; // delivery persion address
    string internal deliveryPersonName;     // delivery person name
    uint internal deliveryPickTime;         // delivery pickup time
    string internal deliveryPointContactNo; // point of contact for delivery
    uint internal quantity;                 // quantity of food
    string internal zipcode ;               // location zipcode
    string internal locationAddr;           // delivery location address
    uint internal deliverytime ;            // when the delivery required
    string internal description ;           // campaign description if any 
    string internal ifpsMediaLink ;         // image can be uploaded 
    uint internal campaignIndex;            // index in the factory contract
    ContractStatus internal status;         // Contract status 
}


/** 
 * @title FoodForAllCampaignProxy 
 * Contract contains only the constructor.By moving constuctor code out of baseContract(FfaCamapign)
 * we can an avoid the following
 * (a) deploying the base class with the extra initialization method
 * (b) modifying the original contract to make sure state initialization only occurs once and 
 *  only on an uninitialized state
 * (c) risking having initialization on an uninitialized contract state hijacked by an unauthorized party 
 */
contract FoodForAllCampaignProxy is Proxy, FoodForAllCampaignDataInternal {
    /** @dev FFACampaign contract creation logic moved in to a Proxy. Reduce the contract creation gas.
      * @param _masterContractAddr ffaCampaign deployed master contract.Proxy creates copy of this
      * @param _contractOwner Specifies the contract owner. deployer(Coinbase) set as owner by factory by defalut.
      * @param _requesterAddress new ffa campaign requester. ( msg.sender)
      * @param _quantity qunatity of the food required
      * @param _deliverytime when the people need food
      * @param _deliveryPointContactNo point of contract (phone no.)
      * @param _locationAddr location address
      * @param _campaingIndex created campaign index - for front end reference.
      */
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
        Proxy (_masterContractAddr)
        ProxyOwnableData(_contractOwner)
    {
        //user input overflow check
        require(bytes(_requesterName).length < 100 ,"input string is too large");
        require(bytes(_deliveryPointContactNo).length < 30 ,"input string is too large");
        require(bytes(_locationAddr).length < 250 ,"input string is too large");
        // requester make foodrequest for next 30 days max
        require (_deliverytime < (now + 30 days),"food request restricted for next 30 days");
        //limiting the user input
        require (_quantity>0 && _quantity<5000, "Food quantity limited between 1 to 5000");
        requesterAddress = _requesterAddress;
        requesterName = _requesterName;
        quantity = _quantity;
        deliveryPointContactNo = _deliveryPointContactNo;
        locationAddr = _locationAddr;
        deliverytime = _deliverytime;
        campaignIndex = _campaingIndex;
        status = ContractStatus.Requested;
        emit FoodForAllCampaignProxyCreated(_contractOwner,_requesterAddress,_quantity,_locationAddr) ;
    }
}


/** 
 * @title FoodForAllCampaign 
 * This is base contract. all the data, events , initialisation are implemented out of 
 * this contract. This will reduce the deployement cost significantly. 
 */
contract FoodForAllCampaign is UpdatableProxyImplementation,FoodForAllCampaignDataInternal {
    
    // Modifiers
    modifier atContractStatus(ContractStatus _status) {
        require(
            status == _status,
            "Function cannot be called at this time."
        );
        _;
    }

    //////////////////////////////////////////////////////////
    ////     Contract State Change -  Set functions     //////
    //////////////////////////////////////////////////////////

    /** @dev volunteer willing to produce food for the required person.give the committment by call this func .
      * @param _producerName name of the food producer
      */
    function contributeByProduceFood (string _producerName) 
        public 
        atContractStatus(ContractStatus.Requested)
    {
        require(bytes(_producerName).length < 200 ,"input string is too large");
        producerAddress = msg.sender;
        producerName = _producerName;
        status = ContractStatus.ProducerReady;
        emit FoodProducerReady(producerAddress, producerName);
    }

    /** @dev volunteer willing to deliver the food.Give the committment by call this func to deliver the location.
      * @param _deiverPerName name of the delivery person
      */
    function contributeByDeliverFood (string _deiverPerName ) 
        public 
        atContractStatus(ContractStatus.ProducerReady)
    {
        require(bytes(_deiverPerName).length < 200 ,"input string is too large");
        deliveryPersonAddress = msg.sender;
        deliveryPersonName = _deiverPerName; 
        status = ContractStatus.DeliveryPersonReady;
        emit FoodDeliveryPersonReady(deliveryPersonAddress,deliveryPersonName);
    }

    /** @dev Producer set the expected time to finish the production, ready for delivery.
      * @param _productionReadyTime production ready time.
      */
    function setFfaExpectedProductionReadyTime(uint _productionReadyTime) public {
        require(msg.sender == producerAddress,"Only producer should set the time");
        require (_productionReadyTime < (now + 30 days),"expeceted prod ready time should be with in 30 days");
        productionReadyTime = _productionReadyTime;
        emit FoodProductionReadyTimeSet(msg.sender, productionReadyTime);
    }

    /** @dev Delivery person set the  delivery pick time,restrict advance set time 20 days
      * @param _deliveryPickTime production ready time.
      */
    function setFfaDeliveryPickTime(uint _deliveryPickTime) public {
        require(msg.sender == deliveryPersonAddress,"Only deliveryPer should set the time");
        require (_deliveryPickTime < (now + 30 days),"delivery time should be with in 30 days");
        deliveryPickTime = _deliveryPickTime;
        emit FoodDeliveryPickUpTimeSet(msg.sender, deliveryPickTime);
    }
   
    // set the contract state to food ready for delivery. Restrict for only the prouducer
    function setFoodReadyForDelivery() public {
        require(msg.sender == producerAddress,"Only producer should udate this status");
        status = ContractStatus.FoodReadyForDelivery;
        emit FfaStatusChange(msg.sender,status);
    }

    // set the contract state to out for delivery . Restrict for only the producer and delivery person
    function setFoodOutForDelivery() public {
        require(
            (msg.sender == producerAddress) || 
            (msg.sender == deliveryPersonAddress),
            "only producer or delivery person should update this status"
        );
        status = ContractStatus.FoodOutForDelivery;
        emit FfaStatusChange(msg.sender,status);
    }

    // set the contract state to delivered status.Restrict for only the delivery person
    function setFoodDelivered() public {
        require(msg.sender == deliveryPersonAddress,"Only delivery person should udate this status");
        status = ContractStatus.FoodDelivered;
        emit FfaStatusChange(msg.sender,status);
    }

    // set the contract state to delivery ack. Restrict for only the requester and owner(incase requester not updated.)
    function setFoodDeliveryAcknowledge() public {
        require(
            (msg.sender == requesterAddress) ||
            (msg.sender == upgradeOwner),
            "Only deliveryPer should set the time");
        status = ContractStatus.FoodDeliveryAck;
        emit FfaStatusChange(msg.sender,status);
    }

    /** @dev Set the campign description, additional info etc. Restrict to campaign participants
      * @param _description campign description
      */
    function setFfaCampaignRequirementDescription(string _description) public {
        require(
            msg.sender == requesterAddress ||
            msg.sender == producerAddress  || 
            msg.sender == deliveryPersonAddress,
            "Only contact participants can update the description"
        );
        description = _description;
    }

    /** @dev Set the campign media link, additional info etc. Restrict to campaign participants
      * @param _ifpsMediaLink campign media link( photos, video ,only one link per campaign)
      */
    function setFfaCampaignMedia (string _ifpsMediaLink) public {
        require(
            msg.sender == requesterAddress ||
            msg.sender == producerAddress  || 
            msg.sender == deliveryPersonAddress,
            "Only contact participants can update the description"
        );
        ifpsMediaLink = _ifpsMediaLink;
    }

    /** @dev Set the campign status based on the workflow. Restrict to campaign participants
      * @param _status contract statuser
      * This function is for emergency use. Normal user should not change the status of the contract
      * with breaking the workflow.
      */
    function setStatus(ContractStatus _status) 
        public 
        onlyUpgradeOwner()
    {
        require(
            _status > ContractStatus.NotCreated && 
            _status < ContractStatus.FoodDeliveryAck,
            "Contract status should be with in limit"
        );
        status = _status;
        emit FfaStatusChange(msg.sender,_status);
    }


    ////////////////////////////////////////////////////////
    ////     Utility Get functions -   /////////////////////
    ////////////////////////////////////////////////////////
    
    // get the current contract status 
    function getFfaStatus() public view returns (ContractStatus) {
        return status;
    }
    // Requester address get functions
    function getFfaRequesterAddress() public view returns (address) {
        return requesterAddress;
    }

    function getFfaRequesterName() public view returns (string) {
        return requesterName;
    }

    function getFfaRequesterSummary() public view returns (address ,string) {
        return(requesterAddress, requesterName);
    }

    function getFfaProducerAddress() public view returns (address) {
        return producerAddress;
    }

    function getFfaProducerName(string  ) public view returns (string){
        return producerName ;
    }
    
    function getFfaExpectedProductionReadyTime() public view returns (uint) {
        return productionReadyTime;
    }

    function getFfaProducerSummary() public view returns (address ,string, uint) {
        return(producerAddress, producerName, productionReadyTime);
    }

    function getFfaDeliveryPersonAddress() public view returns (address) {
        return deliveryPersonAddress;
    }

    function getFfaDeliveryPersonName() public view returns (string) {
        return deliveryPersonName;
    }

    function getFfaDeliveryPickTime() public view returns (uint) {
        return deliveryPickTime;
    }

    function getFfaDeliveryPersonSummary() public view returns (address ,string, uint) {
        return(deliveryPersonAddress, deliveryPersonName, deliveryPickTime);
    }

    function getFfaDeliverLocationSummary() public view returns (string,string,string,uint) {
        return(deliveryPointContactNo,zipcode,locationAddr,deliverytime);
    }

    function getFfaCampaignMoreInfo() public view returns (string, string) {
        return (description,ifpsMediaLink);
    }

}
