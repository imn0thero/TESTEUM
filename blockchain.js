// File: blockchain.js
const SHA256 = require('crypto-js/sha256');
const { Transaction } = require('./transaction');

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`\u26cf\ufe0f Block mined: ${this.hash}`);
  }

  hasValidTransactions() {
    return this.transactions.every(tx => tx.isValid());
  }
}

class Blockchain {
  constructor() {
    this.coinName = 'TESTEUM';
    this.coinSymbol = 'TES';
    this.totalSupply = 100000000;
    this.circulatingSupply = 0;
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.blockHeight = 1;
  }

  getBlockReward() {
    const halvings = Math.floor(this.blockHeight / 210000);
    const initialReward = 50;
    return initialReward / Math.pow(2, halvings);
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardAmount = this.getBlockReward();
    if (this.circulatingSupply + rewardAmount > this.totalSupply) {
      console.log("Max supply reached. No more rewards.");
      return;
    }

    const rewardTx = new Transaction(null, miningRewardAddress, rewardAmount);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    this.circulatingSupply += rewardAmount;
    this.blockHeight++;
    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) throw new Error('Transaction must include from and to address');
    if (!transaction.isValid()) throw new Error('Invalid transaction');
    this.pendingTransactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) balance -= tx.amount;
        if (tx.toAddress === address) balance += tx.amount;
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (!curr.hasValidTransactions()) return false;
      if (curr.hash !== curr.calculateHash()) return false;
      if (curr.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
