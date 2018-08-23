/**
 * @description  'food for all' Campaign Contract test
 * Workflow test: RequestForFood => ProducerForFood => Delivery to the location
 * State change test
 * Logic tests 
 * @author Sijesh P 
 */

const FoodForAllCampaign = artifacts.require("FoodForAllCampaign");
const FoodForAllCampaignProxy = artifacts.require("FoodForAllCampaignProxy");
//required for -ve testcase implementation
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const assert = chai.assert;

/** Test for campaign factory contract. */
contract('FoodForAll CampaignContract test', async (accounts) => {
    let ffaInstance;
    let ffaProxy ;
    let coinbase,requesterAddr,producerAddr,deliveryPerssonAddr,nonContributer;
    let contractIndex = 0;
  
    // Befor each test, setup the accouts and deply the base contract using proxy
    beforeEach(async () => {
        // get the account from ganache and assign.
        [coinbase,requesterAddr, producerAddr,deliveryPerssonAddr,nonContributer] = accounts;
        //get the contract instances
        ffaInstance = await FoodForAllCampaign.deployed();
        assert.ok(ffaInstance)

        // Create the Proxy contract. In real scenario Food Requester creates 
        // the new campaign contract through factory contract.
        ffaProxy = await FoodForAllCampaignProxy.new(
            ffaInstance.address, 
            coinbase,
            requesterAddr,
            "Requester1", 
            199, 
            1535461200, 
            "010-28394-23", 
            "Dubai , UAE ",
            contractIndex++
        );
        assert.ok(ffaProxy.address);

    })
  
    /** 
     * Map the proxy contract address base contract to access functionality
     * Contracts splited to seperate data and logic to make a proxy friendly architecture
     * Proxies will help to reduce the gas to create contract through factory
     */
    it("Map the Proxy contract to FoodForAllCampaign to access funcs ", async () => {
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        assert.equal(ffaCampainMappedInstance.address,ffaProxy.address);
    
    });
    
    /** 
     * Test the contract workflow  
     * By seeing the food requirement volunteers comes forward to produce the food. 
     * In this test, testing the producer make the committement, 
     * ensures details updated in storage properly.
     */
    it(" FfaCampaign:workflow test - volunteers committement to produce the food ", async () => {
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        let status = ffaCampainMappedInstance.getFfaStatus.call();
        //Verify the initial status is "Requested"
        assert(status,1,"Status should be Requested");
        // committment by food producer
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        status = await ffaCampainMappedInstance.getFfaStatus.call();
        //Verify the status changed to "Producer Ready"
        assert(status,2,"Status should be ProducerReady");
        //get the producer details and verify
        let producerDetails = await ffaCampainMappedInstance.getFfaProducerSummary.call();
        assert.equal(producerDetails[0],producerAddr,"Producer address not set in the storage");
        assert.equal(producerDetails[1],"Producer1","Producer name not set in the storage");
    });

    /** 
     * Test the contract workflow  
     * In this test, makes food delivery Committement , ensures details updated in storage properly.
     */
    it(" FfaCampaign:workflow test- volunteers committement to deliver the food ", async () => {
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        //delivery person can make committment only after prodcers committment.
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr});
        //verify the delivery person details and status changed properly
        let deliveryPersonDetails = await ffaCampainMappedInstance.getFfaDeliveryPersonSummary.call();
        assert.equal(deliveryPersonDetails[0],deliveryPerssonAddr,"DeliveryPer address not set in the storage");
        assert.equal(deliveryPersonDetails[1],"DeliveryPerson1","DeliveryPer name not set in the storage");
        status = await ffaCampainMappedInstance.getFfaStatus.call();
        assert.equal(status,3,"Status not updated to DeliveryPersonReady"); // 3 =>DeliveryPersonReady status
    });

    /** 
     * Test the contract workflow  
     * Test the food production time ( set and get)
     */
    it(" FfaCampaign:workflow test - set and get prod ready time", async () => {
        let timeFoodProdReady = (Date.parse('20 Sep 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.setFfaExpectedProductionReadyTime(timeFoodProdReady,{from:producerAddr});
        let getProdReadyTime = await ffaCampainMappedInstance.getFfaExpectedProductionReadyTime.call();
        assert.equal(timeFoodProdReady,getProdReadyTime,"Prod ready time get and set is not equal");
    });

    /** 
     * Test the contract workflow  
     * Test the  delivery pickup time set/ get)
     */
    it("FfaCampaign:workflow test - set and get delivery pick time", async () => {

        let pickUpTime = (Date.parse('20 Sep 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await ffaCampainMappedInstance.setFfaDeliveryPickTime(pickUpTime,{from:deliveryPerssonAddr});
        let getDeliveryPickTime = await ffaCampainMappedInstance.getFfaDeliveryPickTime.call();
        assert.equal(pickUpTime,getDeliveryPickTime,"Delivery pick time get and set is not equal");
    });

    /** 
     * Test the contract workflow  
     * Test the  production ready for delivery  status)
     */
    it(" FfaCampaign:workflow test: Only producer update the productionReady status ", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        // only delivery person can change the staus food delivered.
        await ffaCampainMappedInstance.setFoodReadyForDelivery({from:producerAddr});
        status = await ffaCampainMappedInstance.getFfaStatus.call();
        assert.equal(status,4,"Status not updated to FoodReadyForDelivery"); 
    });

    /** 
     * Test the contract workflow  
     * Test the  FoodDelivered staus update)
     */

    it(" FfaCampaign:workflow test : delivery person update the delivered status ", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        // only delivery person can change the staus food delivered.
        await ffaCampainMappedInstance.setFoodDelivered({from:deliveryPerssonAddr});
        status = await ffaCampainMappedInstance.getFfaStatus.call();
        assert.equal(status,6,"Status not updated to FoodDelivered"); 
     
    });

    /** 
     * Test the contract workflow  
     * Test additional info set/ get
     */
    it(" FfaCampaign: set and get additional info ", async () => {
        let ipfsMedia = "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85";
        let description = "Many people are struggling for food in this area. pls help";

        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        // need to set producer/delivery person addrson prior to call function
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});

        await ffaCampainMappedInstance.setFfaCampaignMedia(ipfsMedia,{from:requesterAddr})
        await ffaCampainMappedInstance.setFfaCampaignRequirementDescription(description,{from:producerAddr})
        let addInfoDetails = await ffaCampainMappedInstance.getFfaCampaignMoreInfo.call();
        assert.equal(addInfoDetails[0],description,"Description not set properly in the storage");
        assert.equal(addInfoDetails[1],ipfsMedia,"IPFS media link not set properly in the storage");
    });

    /** 
     * Negative test cases - Only contributers i.e requrester,producer or delivery person should be
     * be able to change the contract status
     */
    it(" FfaCampaign -ve test : Only owner should be able to change the contract status ", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await assert.isRejected(ffaCampainMappedInstance.setStatus(1,{from:nonContributer}));
    });

    /** 
     * Negative test cases - Only delivery person can update the delivery picktime
     */
    it(" FfaCampaign -ve test : Only delivery person should be able to update the delivery picktime ", async () => {
            
        let pickUpTime = (Date.parse('28 Aug 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await assert.isRejected(ffaCampainMappedInstance.setFfaDeliveryPickTime(pickUpTime,{from:nonContributer}));
     
    });

    /** 
     * Negative test cases -  delivery picktime should be with in 30 day range
     */
    it(" FfaCampaign -ve test : delivery picktime should be with in 30 day range ", async () => {
            
        let pickUpTime = (Date.parse('28 Oct 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await assert.isRejected(ffaCampainMappedInstance.setFfaDeliveryPickTime(pickUpTime,{from:deliveryPerssonAddr}));
     
    });

    /** 
     * Negative test cases - Only Producer can update the prod ready time
     * contract State order is not important to set the time
     */
    it(" FfaCampaign -ve test : Only producer should be able to update prod ready time ", async () => {
            
        let pickUpTime = (Date.parse('28 Aug 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await assert.isRejected(ffaCampainMappedInstance.setFfaExpectedProductionReadyTime(pickUpTime,{from:deliveryPerssonAddr}));
     
    });

    /** 
     * Negative test cases -  delivery picktime should be with in 30 day range
     * contract State order is not important to set the time
     */
    it(" FfaCampaign -ve test : expected delivery should be with in 30 day range ", async () => {
            
        let pickUpTime = (Date.parse('28 Oct 2018 13:00:00 GMT')/1000);
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        await ffaCampainMappedInstance.contributeByDeliverFood("DeliveryPerson1",{from:deliveryPerssonAddr})
        await assert.isRejected(ffaCampainMappedInstance.setFfaExpectedProductionReadyTime(pickUpTime,{from:producerAddr}));
     
    });

    /** 
     * Negative test cases - Only contributers i.e requrester,producer or delivery person should be
     * be able to update the description
     */
    it(" FfaCampaign -ve test : : Only contributers should be able to update the description ", async () => {
            
        let ipfsMedia = "QmfWudYY7Git86xGbM7SF3Xa5YAGhzuBmTk7HEv64tNh85";
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await assert.isRejected(ffaCampainMappedInstance.setFfaCampaignMedia(ipfsMedia,{from:nonContributer}));
     
    });
      /** 
     * Negative test cases - Need to maintain the workflow. Delivery person can committ only after
     * Producer committement. 
     */
    it("FfaCampaign -ve test : : Delivery person can commit only after production committement", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await assert.isRejected(
            ffaCampainMappedInstance.contributeByDeliverFood(
                "DeliveryPerson1",
                {from:deliveryPerssonAddr}
            )
        );
    });

    // Negative test case - status changes 

    it(" FfaCampaign -ve test : Only delivery person should be able to update the delivered status ", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        // only delivery person can change the staus food delivered.
        await assert.isRejected(ffaCampainMappedInstance.setFoodDelivered());
     
    });

    it(" FfaCampaign -ve test : Only producer  should be able to update the productionReady status ", async () => {
            
        let ffaCampainMappedInstance = await FoodForAllCampaign.at(ffaProxy.address);
        await ffaCampainMappedInstance.contributeByProduceFood ("Producer1",{from:producerAddr});
        // only delivery person can change the staus food delivered.
        await assert.isRejected(ffaCampainMappedInstance.setFoodReadyForDelivery());
    });


});

