# Nice Try — Quantum-Resistant Wallet

Account Abstraction + BIP-44 HD key rotation. One key per transaction.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

## Structure

```
lib/
  hdWallet.js          BIP-39/32/44 key derivation
  vault.js             AES-256-GCM encrypted localStorage
  smartAccount.js      ERC-4337 smart account config
  web3Management.js    Create, mint, rotation on-chain
  tokens.js            ETH + ERC-20 balance reading
  utils.js             Shared helpers

components/
  WalletApp.jsx        Main orchestrator (state + routing)
  auth/
    LandingPage.jsx    Create / Recover entry
    CreatePassword.jsx Password for new wallet
    ShowSeed.jsx       Seed phrase display + warning
    RecoverSeed.jsx    Seed phrase input for recovery
    RecoverPassword.jsx Password for recovered wallet
    RecoverScanning.jsx Visual recovery progress
    UnlockPage.jsx     Returning user login
  dashboard/
    Dashboard.jsx      Main layout
    KeyTree.jsx        HD derivation tree panel
    TokenBalances.jsx  ETH + ERC-20 balances
    SendRotate.jsx     Send + rotate transaction
    TxHistory.jsx      Transaction history
    ReceiveModal.jsx   QR code + address
    Console.jsx        Debug console
  shared/
    Logo.jsx           Nice Try logo
    Spinner.jsx        Loading spinner
```

## How it works

Your wallet address never changes. Each transaction:

1. **key[n]** signs the UserOp (exposes the public key)
2. **Atomically**, in the same tx, the on-chain signer rotates to **addr[n+1]**
3. **key[n]** is destroyed from memory

A quantum computer deriving the private key from the public key (Shor's attack) would arrive too late — that key is no longer valid.
