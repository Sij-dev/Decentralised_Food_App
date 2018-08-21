# FoodForAll
Around the world, more than 800 million people go to bed hungry every day. That is roughly one in every 10 people remain hungry in the globe. Hunger still remains one of the biggest problems in the world.
Greatest paradox is roughly one third of the food produced in the world for human consumption every year gets lost or wasted. The food wastage in an year is equivalent to more than half of the world's annual cereals crop (2.3 billion tonnes in 2009/2010). Food losses and waste amounts to roughly US$ 680 billion in industrialized countries and US$ 310 billion in developing countries.

Any technology realizes once it is able to touch upon the elementary issues of the soceity

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
ganache-cli  - Run  blockchain locally
connect metamask to this blockchain network
> truffle migrate
> npm run start
```
access the app in  http://localhost:3000

#### Smart contract test
```
>truffle test
```