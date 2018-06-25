const consoleLogger = require('./consoleLogger');
var config = require('../config/default.json');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var web3 = new Web3();
web3.setProvider(new web3.eth.providers.HttpProvider(config.gethNode));

module.exports = {
	getBalance: async function(address) {
		try {
			var etherBalance = await web3.eth.getBalance(address, function(error, balance) {
				return balance;
			});
		} catch (error) {
			consoleLogger.time('Error: ' + error.toString());
			return {'Error' : error.toString()};
		}

		return {'Data' : web3.utils.fromWei(etherBalance, 'ether')};
	},
	getTransaction: async function(hash) {
		try {
			var data = await web3.eth.getTransaction(hash, function(error, info) {
				return info;
			});
		} catch (error) {
			consoleLogger.time('Error: ' + error.toString());
			return {'Error' : error.toString()};
		}

		return {'Data' : data};
	},
	getGasPrice: async function() {
		return true;
	},
	createWallet: async function() {
		return true;
	}
}