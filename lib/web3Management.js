import { http, encodeFunctionData, concat, createWalletClient } from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { createSmartAccountClient } from 'permissionless'
import { createPimlicoClient } from 'permissionless/clients/pimlico'
import {
  publicClient, ENTRYPOINT_ADDRESS, buildSmartAccountFromWallet, ownerAbi,
} from './smartAccount'

const mintAbi = [{
  name: 'mint', type: 'function', stateMutability: 'nonpayable',
  inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
  outputs: [],
}]

const executeAbi = [{
  name: 'execute', type: 'function', stateMutability: 'nonpayable',
  inputs: [
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
  ],
  outputs: [],
}]

const transferAbi = [{
  name: 'transfer', type: 'function', stateMutability: 'nonpayable',
  inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
  outputs: [{ name: '', type: 'bool' }],
}]

const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY
const pimlicoUrl = `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${pimlicoApiKey}`

const paymasterClient = createPimlicoClient({
  transport: http(pimlicoUrl),
  entryPoint: {
    address: ENTRYPOINT_ADDRESS,
    version: '0.7',
  },
})

async function waitForContract(address, expectedOwner = null, maxAttempts = 30, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const bytecode = await publicClient.getBytecode({ address })
      if (bytecode && bytecode !== '0x') {
        const owner = await publicClient.readContract({
          address, abi: ownerAbi, functionName: 'owner',
        })
        if (!expectedOwner || owner.toLowerCase() === expectedOwner.toLowerCase()) {
          return owner
        }
      }
    } catch {}
    await new Promise(r => setTimeout(r, intervalMs))
  }
  if (expectedOwner) {
    throw new Error(`Owner not rotated after ${maxAttempts * intervalMs / 1000}s. Expected: ${expectedOwner}`)
  }
  throw new Error(`Contract at ${address} not available after ${maxAttempts * intervalMs / 1000}s`)
}

function buildClient(account) {
  return createSmartAccountClient({
    account,
    chain: baseSepolia,
    bundlerTransport: http(pimlicoUrl),
    paymaster: paymasterClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return (await paymasterClient.getUserOperationGasPrice()).fast
      },
    },
  })
}

export async function createSmartAccount(walletClient) {
  if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS) throw new Error('Factory address not configured')
  const account = await buildSmartAccountFromWallet(walletClient)
  localStorage.setItem('SmartAccount', account.address)
  return account
}

export async function mintTxHash(smartAccountAddress) {
  const pvk = process.env.NEXT_PUBLIC_PVK_TOKEN_OWNER
  if (!pvk) throw new Error('Token owner key not configured')
  const tokenOwner = privateKeyToAccount(pvk)
  const wc = createWalletClient({
    account: tokenOwner, chain: baseSepolia, transport: http('https://sepolia.base.org'),
  })
  return wc.sendTransaction({
    to: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    data: encodeFunctionData({
      abi: mintAbi, functionName: 'mint',
      args: [smartAccountAddress, 1000n * 10n ** 18n],
    }),
  })
}

export async function rotation(walletClient, recipientAddress, nextOwnerAddress, amountEth) {
  const contractAddress = localStorage.getItem('SmartAccount')
  const currentOwner = walletClient?.account?.address
  if (!contractAddress) throw new Error('No smart account found')
  if (!recipientAddress) throw new Error('Recipient address missing')
  if (!nextOwnerAddress) throw new Error('Next owner address missing')
  if (!amountEth) throw new Error('Amount missing')

  let bytecode = await publicClient.getBytecode({ address: contractAddress })
  let isDeployed = !!bytecode && bytecode !== '0x'

  if (isDeployed) {
    const onChainOwner = await waitForContract(contractAddress)
    if (onChainOwner.toLowerCase() !== currentOwner.toLowerCase()) {
      throw new Error(`Not the owner. On-chain: ${onChainOwner}, wallet: ${currentOwner}`)
    }
  }

  const account = await buildSmartAccountFromWallet(walletClient, contractAddress)
  const client = buildClient(account)

  const { parseEther } = await import('viem')
  const weiAmount = parseEther(amountEth.toString())

  const callData = concat([
    encodeFunctionData({
      abi: executeAbi, functionName: 'execute',
      args: [recipientAddress, weiAmount, '0x'],
    }),
    nextOwnerAddress,
  ])

  const userOpHash = await client.sendUserOperation({ callData })

  const receipt = await client.waitForUserOperationReceipt({
    hash: userOpHash,
    timeout: 120_000,
  })
  if (!receipt.success) throw new Error(`UserOp reverted: ${JSON.stringify(receipt)}`)

  const newOwner = await waitForContract(contractAddress, nextOwnerAddress)
  if (newOwner.toLowerCase() !== nextOwnerAddress.toLowerCase()) {
    throw new Error(`Owner not rotated. On-chain: ${newOwner}, expected: ${nextOwnerAddress}`)
  }

  const pool = JSON.parse(localStorage.getItem('addresses') || '[]')
  localStorage.setItem('addresses', JSON.stringify(
    pool.filter(a => a.toLowerCase() !== nextOwnerAddress.toLowerCase() && a.toLowerCase() !== currentOwner.toLowerCase())
  ))

  return {
    userOpHash,
    txHash: receipt.receipt.transactionHash,
    previousOwner: currentOwner,
    newOwner: nextOwnerAddress,
    recipientAddress,
  }
}

export { publicClient }