const consoleLogger = require('./src/consoleLogger');
const contract = require('./src/contract');
const config = require('./config/default.json');
const express = require('express');
const node = require('./src/node');
const app = express();
const port = 3003;

var bodyParser = require('body-parser');

app.use(bodyParser());

app.post('/contractTransaction', async function (request, response) {
    var data = request.body;

    consoleLogger.time('Call for contract: ' + data.contract.address + ' transaction method: ' + data.method + ' wallet: ' + data.wallet.address + ' params: (' + data.additional + ')');
    await contract.transaction(data.contract, data.method, data.wallet, data.additional, response);
});
app.post('/contractMethod', async function (request, response) {
    var data = request.body;

    consoleLogger.time('Call for contract: ' + data.contract.address + ' method: ' + data.method + ' wallet: ' + data.wallet.address + ' params: (' + data.additional + ')');
    response.json(await contract.method(data.contract, data.method, data.wallet, data.additional));
});
app.post('/getTransaction', async function (request, response) {
    var data = request.body;

    consoleLogger.time('getTransaction hash: ' + data.hash);
    response.json(await node.getTransaction(data.hash));
});	
app.post('/getBalance', async function (request, response) {
    var data = request.body;

    consoleLogger.time('getBalance wallet: ' + data.wallet);
    response.json(await node.getBalance(data.wallet));
});
app.post('/createWallet', async function (request, response) {
    response.json(await node.createWallet());
});

app.listen(config.serverPort);
console.log("Server is listening on port:" + config.serverPort);