// File: wallet.js
const EC = require('elliptic').ec;
const { Blockchain } = require('./blockchain');
const { Transaction } = require('./transaction');

const ec = new EC('secp256k1');
const testeum = new Blockchain();

// Generate new wallet
function createWallet() {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic('hex');
  const privateKey = key.getPrivate('hex');
  return { publicKey, privateKey };
}

// Get balance
function getBalance(address) {
  return testeum.getBalance(address);
}

// Send TES
function sendTES(fromPrivateKey, toAddress, amount) {
  const key = ec.keyFromPrivate(fromPrivateKey);
  const fromAddress = key.getPublic('hex');
  const tx = new Transaction(fromAddress, toAddress, amount);
  tx.signTransaction(key);
  testeum.addTransaction(tx);
  console.log(`\u2709\ufe0f Transaction of ${amount} TES sent from ${fromAddress.slice(0, 12)}... to ${toAddress.slice(0, 12)}...`);
}

// Mine block for address
function mineWallet(address) {
  console.log(`\u26cf\ufe0f Mining TES reward to ${address.slice(0, 12)}...`);
  testeum.minePendingTransactions(address);
}

module.exports = { createWallet, getBalance, sendTES, mineWallet, testeum };
