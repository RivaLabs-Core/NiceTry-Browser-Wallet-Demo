# NiceTry Browser Wallet Demo

> [!TIP]
> This repo covers a single demo. For the full NiceTry project, including the protocol design, see the [main repo](https://github.com/RivaLabs-Core/NiceTry) or the [docs](https://docs.nicetry.xyz/).

A browser-based demo wallet that implements NiceTry's ECDSA rotation flow natively, with browser-based key management.

Live demo: [demowallet.nicetry.xyz](https://demowallet.nicetry.xyz/)

## What this is

This repo is a self-contained wallet that shows what NiceTry's rotation mechanism looks like when signing and key management live inside the wallet itself. It generates a BIP-39 seed, derives an HD tree at `m/44'/60'/0'/0/{i}`, and walks forward one index per transaction. The private key at the current index signs a single UserOperation that atomically sends value and rotates the onchain owner to `key[i+1]`. `key[i]` is then dropped from memory.

Logging into an existing wallet or importing a seed syncs with onchain state.

It is a demo, not a production wallet. No hardware-backed key storage, no multi-device support, no real threat model for a hot browser context. But the UX tradeoffs are genuinely small: one click sends and rotates, and the user never has to think about which key is active.

## What you can do with it

Create a wallet (generates a 12-word seed and an encrypted vault), or recover one from a seed phrase. The recovery flow reads the smart account's onchain active signer and scans the HD addresses to determine which key[i] matches, so the UI picks up exactly where the previous session left off. From the dashboard: receive funds and send ETH, where each send is also a rotation. Key state is written back to the encrypted vault after every rotation so a refresh never desyncs the active index from the chain.

## Stack

Next.js 14, ethers v6 for HD derivation, viem + permissionless for ERC-4337, Pimlico for bundling and gas sponsorship. Base Sepolia. Vault is AES-256-GCM with PBKDF2 (100k iterations, SHA-256) via Web Crypto, stored in `localStorage`.


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
