const consoleLogger = require('./consoleLogger');
var config = require('../config/default.json');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var web3 = new Web3();
web3.setProvider(new web3.eth.providers.HttpProvider(config.gethNode));

module.exports = {
	// Вызвать метод и провести транзакцию контракта
	transaction: async function(contract, method, wallet, additional, response) {

		let nonceHex = await web3.eth.getTransactionCount(wallet.address).then((nonce) => {
			return web3.utils.toHex(nonce);
		});

        let fromAccount = await web3.eth.accounts.decrypt(wallet.container, wallet.password);
		let nonce       = wallet.nonce;

		let rawData     = web3.eth.abi.encodeFunctionCall(this._initContractMethod(JSON.parse(contract.abi), method), JSON.parse(additional));
        let gasPrice    = web3.utils.toWei(String(contract.gasPrice), "gwei");
        let gasPriceHex = web3.utils.toHex(gasPrice);
        let gasLimitHex = web3.utils.toHex(contract.gasLimit);
		let privateKey  = new Buffer(fromAccount.privateKey.slice(2), 'hex');

		console.log('nonceHex: ' + nonceHex);

        let rawTx = {
            gasPrice: gasPriceHex,
            gasLimit: gasLimitHex,
            nonce:    nonceHex,
            data:     rawData,
            value:    '0x00',
            from:     fromAccount,
            to:       contract.address
        };

        let tx = new Tx(rawTx);
        tx.sign(privateKey);

        let serializedTx     = tx.serialize();
		let serializedFullTx = '0x' + serializedTx.toString('hex');

		try {
			console.log('serialize Tx: ' + serializedFullTx);
			var transaction = web3.eth.sendSignedTransaction(serializedFullTx, function(error, hash) {
				console.log('Error: ' + error);
			});
			
			resultHash = transaction.on('transactionHash', hash => {
		      console.log('Hash: ', hash);
		      response.json({'Data' : hash});
		    });

		} catch (error) {
			consoleLogger.time('Error: ' + error.toString());
			response.json({'Error' : error.toString()});
		}
	},
	// Вызвать метод контракта
	method: async function(contract, method, wallet, additional) {

		var сontractObj = new web3.eth.Contract(JSON.parse(contract.abi), contract.address);

		var contractMethod = `сontractObj.methods.${method}('${additional}').call({from: '${wallet.address}'}, function(error, result){return result;})`;

		try {
			var result = await eval(contractMethod);
		} catch (error) {
			consoleLogger.time('Error: ' + error.toString());
			return {'Error' : error.toString()};
		}

		return {'Data' : result};
	},
	// Инициализация метода контракта
    _initContractMethod: function(abi, name) {
        let method = [];
        for (let i = 0; i < abi.length; i++) {
            let item = abi[i];
            if (item.name && item.name.toLowerCase() === name.toLowerCase() && item.type && item.type == 'function') {
                method = item;
            }
        }
        return method;
    },
}