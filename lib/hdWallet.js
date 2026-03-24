import { Mnemonic, HDNodeWallet } from 'ethers'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

const BASE_PATH = "m/44'/60'/0'/0"
const RPC = 'https://sepolia.base.org'

export function generatePhrase() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const entropy = '0x' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  return Mnemonic.fromEntropy(entropy).phrase
}

export function validatePhrase(phrase) {
  try { Mnemonic.fromPhrase(phrase); return true } catch { return false }
}

export function rootFromPhrase(phrase) {
  return HDNodeWallet.fromSeed(Mnemonic.fromPhrase(phrase).computeSeed())
}

export function deriveKey(root, index) {
  const node = root.derivePath(`${BASE_PATH}/${index}`)
  return { index, path: `${BASE_PATH}/${index}`, address: node.address, privateKey: node.privateKey }
}

export function deriveTree(root, currentIndex, count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    ...deriveKey(root, i),
    status: i < currentIndex ? 'burned' : i === currentIndex ? 'active' : i === currentIndex + 1 ? 'next' : 'future',
  }))
}

export function makeWalletClient(privateKey) {
  return createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: baseSepolia,
    transport: http(RPC),
  })
}
