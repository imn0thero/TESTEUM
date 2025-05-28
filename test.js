// File: test.js
const { createWallet, getBalance, sendTES, mineWallet, testeum } = require('./wallet');

// 1. Buat dua wallet
const walletA = createWallet();
const walletB = createWallet();

console.log('🔐 Wallet A:', walletA);
console.log('🔐 Wallet B:', walletB);

// 2. Mining untuk wallet A agar dapat TES
mineWallet(walletA.publicKey);

// 3. Cek saldo awal
console.log(`💰 Saldo A: ${getBalance(walletA.publicKey)} TES`);
console.log(`💰 Saldo B: ${getBalance(walletB.publicKey)} TES`);

// 4. Kirim 10 TES dari A ke B
sendTES(walletA.privateKey, walletB.publicKey, 10);

// 5. Mining agar transaksi masuk block
mineWallet(walletA.publicKey);

// 6. Cek saldo akhir
console.log(`💰 Saldo A: ${getBalance(walletA.publicKey)} TES`);
console.log(`💰 Saldo B: ${getBalance(walletB.publicKey)} TES`);

// 7. Cetak chain
console.log('\n📦 Blockchain:');
console.log(JSON.stringify(testeum.chain, null, 2));
