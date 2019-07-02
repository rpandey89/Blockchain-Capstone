var HDWalletProvider = require('truffle-hdwallet-provider')
var MNEMONIC =
  'doll source together survey box meat assist green sand conduct ostrich ginger'
var INFURA_NODE =
  'https://rinkeby.infura.io/v3/8db2f9dc63264173982c299d9ee46df6'
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, INFURA_NODE)
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: '0.5.1'
    }
  }
}
