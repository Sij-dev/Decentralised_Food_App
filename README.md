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
1.	User signup ( first time) 
    - User needs to provide user name ( address picks up from metamask)
    - Avatar-profile pic ( uploads to IPFS – Domonstrat IPFS capabilities) 
    - Once IPFS upload over, User can submit the form. ( Submit button will be enabled only after upload is completed)
    Note : IPFS code is in “./src/user/ui/signupform/SignUpForm.js”

2.	User Login ( alredy registered user address ) 
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
    - Loout the user.

Note : Only user authentication and campaign creations functions has been implmented in the front-end. Complete contract workflow only implemented in the smart contracts and can be tested using truffle test (Given less importance to front-end development due to time constraints and the course focus only on solidity smart contract development )



