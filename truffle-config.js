const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
        // provider: function() {
        //     return new Web3.providers.HttpProvider("https://testnet2.matic.network")
        // },
        host: 'localhost',
        port: 8545,
        network_id: '*',
    }
  }
};
