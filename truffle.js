//const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'call glow acoustic vintage front ring trade assist shuffle mimic volume reject';


module.exports = {
  networks: {
    // truffle migrate :  default
    development: {
      host: 'localhost', 
      port: 8545,
      gas: 4500000,
      gasPrice: 25000000000,
      network_id: '*' 
    }
    // ,
    // rinkeby: {
    //   // added  to terminate the console.
    //   provider: function() {
    //     return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q');
    //   },
    //   network_id: '4',
    //   gas: 4700000,
    //   gasPrice: 25000000000
    // } 


    // mainnet: {
    //   provider: new HDWalletProvider(mnemonic, 'https://mainnet.infura.io'),
    //   network_id: '*',
    //   gas: 4500000,
    //   gasPrice: 25000000000
    // }
  }
};
//truffle migrate --network rinkeby