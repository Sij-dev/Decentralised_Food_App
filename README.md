# FoodForAll
Around the world, more than 800 million people go to bed hungry every day. That is roughly one in every 10 people remain hungry in the globe. Hunger still remains one of the biggest problems in the world.

Greatest paradox is roughly one third of the food produced in the world for human consumption every year gets lost or wasted. The food wastage in an year is equivalent to more than half of the world's annual cereals crop (2.3 billion tonnes in 2009/2010). Food losses and waste amounts to roughly US$ 680 billion in industrialized countries and US$ 310 billion in developing countries.

The real meaning of a disruptive technology like blockchain is realized when it touches the heart of poorest of the poor. A blockchain network like ethereum is an ideal platform to address this problem. 

### What is FoodForAll
FoodForAll is a decentralized food assimilation, recovery and delivery network, which addresses the issue of food security by intervening in food wastage and utilize existing resources to create more food secure communities.

### What we do 

We provide a decentralized platform, which aims to connect the below entities through ethereum blockchain network.
- Those who are in need of food. (Food Requester)
- Those who are ready to provide food/Those who have excess quantity of food (Food Provider)
- Those who are ready to transport food. (Delivery provider)

Food chain will provide a platform for all these entities to interact, connect and fulfill the requirements of needy in an effective and efficient manner.

## Project setup 

Setup a truffle development environement mentioned in the project documentaion. The following tools is mandatory to execute this project
```
- Truffle
- Metamask ( google chrome with metamask plugin)
- Ganache-cli or truffle-devleop
- npm
```

#### Clone repository and install necessary module.
```
 git clone https://github.com/Sij-dev/FoodForAll.git
 cd FoodForAll
 npm install
 truffle install zeppelin

```
#### Compile, migrate and deploy smart contract 

```
ganache-cli   (Run blockchain locally)
connect metamask to this blockchain network
> truffle migrate
> npm run start
```
access the app in  http://localhost:3000

#### Smart contract test
```
> truffle test
```
## Operational workflow
This is the basic front end operational procedure to interact with the localy deploye contract(ganache-cli). 

![alt text](https://github.com/Sij-dev/FoodForAll/blob/master/docs/FFA_CampaignWorkflow.png)

## Operational procedure
1.	User signup 
    - User needs to provide user name ( address picks up from metamask)
    - Avatar-profile pic ( uploads to IPFS – Demonstrate IPFS capabilities) 
    - Once IPFS upload over, User can submit the form. ( Submit button will be enabled only after upload is completed.Upload time varies depends on image size.)
    Note : IPFS code is in “./src/user/ui/signupform/SignUpForm.js”

2.	User Login
    - Click login button, it will authenticate the registered user(picks up the address from metamask)  and redirect to Dashboard
    - Dashboard displays username and address.

3.	Dashboard
    - User can contribute to this movement by 
    - Creating food request ( implemented in frontend and backend)
    - Volunteering food supply ( implemented only in backend(contracts)- To Be done in frontend)
    - Volunteering delivery of food from the supplier location to delivery location set by the requester ( implemented only in backend(contracts)- To Be done in frontend)

4.	Create New Food For all Campaign 
(Click the button -This is the only option available in the frontend for the time being
   - Enter the required fields
   - How many people required food ( enter a number between 1 -5000)
   - Enter delivery point contact phone no. 
   - Enter delivery location address 
   - Enter date and time in specified format
   - Click the submit button
Note :  Minimum validity checks implemented in the frontend

5.	Campaign List
    - List all the created campaigns. 

6.	Profile 
    - User can update the username . 
7.	Logout
    - Logout the user.

Note : Only user authentication and campaign creations functions has been implemented in the front-end. Complete contract workflow only implemented in the smart contracts and can be tested using truffle test (Given less importance to front-end development due to time constraints and the course focus only on solidity smart contract development)

## Technical Spec

#### Abstract

This project constitute follwing main modules for executing the functionalities 

- FfaCampaign.sol     	- Main logic and functionalities
- CampaignFactory.sol 	- Factory contract which generates FFACampaign
- UserMgmt.sol 		    - User management functionalities
- UpgradedCampaign.sol 	- Contracts for inplace upgrade.

#### FFACampaign:

This is the base contract contains all the functioality for workflow mangement. 

The basic workflow is , A volunteer (or the person required food) create an FFACampaign request. Based on this request, other volunteers can come forward to produce food and deliver food in the particular location. 

FFACampaign  constitutes following contracts, 
(FfaCampaign.sol, UpdatableProxy.sol, ProxyOwnable.sol, Proxy.sol)

- ProxyData             - Stores master contract copy
- Proxy			        - Generic proxy logic
- ProxyOwnableData 	    - Owner data storage and modifiers
- ProxyOwnable		    -  SetOwner functionality
- interface Update	    -  Upgrade data migration logic
- UpdatableProxyData    -  used for Proxy friendly data-logic seperation
- UpdatableProxyShared  – Logic for replacing old contract with new contract
- UpdatableProxyImplementation-Used to inherit to base contrac(ffaCampaign)
- FoodForAllCampaignHeader-  contains evets declaration
- FoodForAllCampaignDataInternal – contains all contract data
- FoodForAllCampaignProxy – Proxy for ffaCampaign Contract creation 
- FoodForAllCampaign    – Base contract contains functionalities

By designing this way, we could separate the logic and data which enabled us to create a proxy-friendly contract and create cheap clones using factory contracts.
Thanks to Alan Lu of Gnosis for his research on “Delegate proxy” contracts which has been referred to create this design.

FFACampain implements following workflow functionalities, 
- FoodForAllCampaignProxy-constructory  :  New FFACampaign creation 
- contributeByProduceFood() :  Volunteer committement to produce food
- contributeByDeliverFood: Volunteer committement to deliver food
- Other supporting set/get functionalities. 
(Please refer Design diagram for details)

####### FoodForAll Campaign-  Contracts Design Diagram

![alt text](https://github.com/Sij-dev/FoodForAll/blob/master/docs/FFA_CampaignWorkflow-FFA_UML.png)

#### Factory Contract

Factory contract creates FFACampign and track the deployed contracts. This uses FFACampaignProxy (initialisation logic of FFACampaign implemented in proxy contract) to create new FFACampaigns. Factor contracts also manges the users access using UserMgmt contract. (Pleae refer Design diagrams)

####### CampaignFactor and UserMgmt Design Diagram

![alt text](https://github.com/Sij-dev/FoodForAll/blob/master/docs/FFA_CampaignWorkflow-FFA_Factory.png)

User creation,updation, deletions and dapp logins are managed by UserMgmt contract. Circuit breaker logic is also implemented in factory contract to stop creating campaigns in case of emergency.


#### UpgradedCampaign

UpgradeCampaign.sol contains “FoodForAllCampaign2” contract which is an upgrade version of “FoodForAllCampaign”. This is an in place upgrade and upgrade capabiliites are demonstrated using testcase implemented in “test\Upgrade\ testContractUpgrade.js”. The upgraded contracts contains additional data field and logics. Migration capabilities has been implimented using “Update” interface. 