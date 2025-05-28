const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { testeum, createWallet, sendTES, mineWallet, getBalance } = require('./wallet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint buat generate wallet baru
app.get('/api/wallet/new', (req, res) => {
  const wallet = createWallet();
  res.json(wallet);
});

// Endpoint cek saldo TES
app.get('/api/balance/:address', (req, res) => {
  const address = req.params.address;
  const balance = testeum.getBalance(address);
  res.json({ address, balance });
});

// Endpoint kirim TES
app.post('/api/transaction', (req, res) => {
  const { fromPrivateKey, toAddress, amount } = req.body;
  if (!fromPrivateKey || !toAddress || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  try {
    sendTES(fromPrivateKey, toAddress, amount);
    res.json({ status: 'success', message: `Sent ${amount} TES to ${toAddress}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint mining TES reward ke address
app.post('/api/mine', (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Missing address' });
  }
  try {
    mineWallet(address);
    res.json({ status: 'success', message: `Mining reward sent to ${address}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint untuk lihat blockchain (debug)
app.get('/api/chain', (req, res) => {
  res.json(testeum.chain);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
