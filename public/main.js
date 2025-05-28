// DOM elements
const createWalletBtn = document.getElementById('createWalletBtn');
const publicKeySpan = document.getElementById('publicKey');
const privateKeySpan = document.getElementById('privateKey');
const balanceSpan = document.getElementById('balance');
const mineBtn = document.getElementById('mineBtn');
const miningStatus = document.getElementById('miningStatus');
const sendForm = document.getElementById('sendForm');
const toAddressInput = document.getElementById('toAddress');
const amountInput = document.getElementById('amount');
const sendStatus = document.getElementById('sendStatus');

let wallet = null;

async function createWallet() {
  miningStatus.textContent = '';
  sendStatus.textContent = '';
  const res = await fetch('/api/wallet/new');
  wallet = await res.json();
  publicKeySpan.textContent = wallet.publicKey;
  privateKeySpan.textContent = wallet.privateKey;
  balanceSpan.textContent = '0';
  mineBtn.disabled = false;
  sendForm.querySelector('button[type="submit"]').disabled = false;
  await updateBalance();
}

async function updateBalance() {
  if (!wallet) return;
  const res = await fetch(`/api/balance/${wallet.publicKey}`);
  const data = await res.json();
  balanceSpan.textContent = data.balance;
}

async function mine() {
  if (!wallet) return;
  miningStatus.textContent = 'Mining... Tunggu sebentar.';
  const res = await fetch('/api/mine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: wallet.publicKey }),
  });
  const data = await res.json();
  if (data.status === 'success') {
    miningStatus.textContent = data.message;
    await updateBalance();
  } else {
    miningStatus.textContent = 'Mining gagal: ' + data.error;
  }
}

async function sendTES(toAddress, amount) {
  if (!wallet) return;
  sendStatus.textContent = 'Mengirim TES...';
  const res = await fetch('/api/transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromPrivateKey: wallet.privateKey,
      toAddress,
      amount: Number(amount),
    }),
  });
  const data = await res.json();
  if (data.status === 'success') {
    sendStatus.textContent = data.message;
    await updateBalance();
    toAddressInput.value = '';
    amountInput.value = '';
  } else {
    sendStatus.textContent = 'Gagal kirim TES: ' + data.error;
  }
}

// Event listeners
createWalletBtn.addEventListener('click', createWallet);
mineBtn.addEventListener('click', mine);
sendForm.addEventListener('submit', e => {
  e.preventDefault();
  sendTES(toAddressInput.value.trim(), amountInput.value);
});
