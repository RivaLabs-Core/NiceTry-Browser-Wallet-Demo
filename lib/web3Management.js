// import { http, encodeFunctionData, concat, createWalletClient } from 'viem'
// import { baseSepolia } from 'viem/chains'
// import { privateKeyToAccount } from 'viem/accounts'
// import { createSmartAccountClient } from 'permissionless'
// import {
//   publicClient, ENTRYPOINT_ADDRESS, buildSmartAccountFromWallet, ownerAbi,
// } from './smartAccount'

// const mintAbi = [{
//   name: 'mint', type: 'function', stateMutability: 'nonpayable',
//   inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
//   outputs: [],
// }]

// const executeAbi = [{
//   name: 'execute', type: 'function', stateMutability: 'nonpayable',
//   inputs: [
//     { name: 'to', type: 'address' },
//     { name: 'value', type: 'uint256' },
//     { name: 'data', type: 'bytes' },
//   ],
//   outputs: [],
// }]

// const transferAbi = [{
//   name: 'transfer', type: 'function', stateMutability: 'nonpayable',
//   inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
//   outputs: [{ name: '', type: 'bool' }],
// }]

// async function cdpRpc(method, params) {
//   const url = process.env.NEXT_PUBLIC_PAYMASTER_URL
//   if (!url) throw new Error('Paymaster URL not configured')
//   const res = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(
//       { jsonrpc: '2.0', id: 1, method, params },
//       (_, v) => typeof v === 'bigint' ? '0x' + v.toString(16) : v
//     ),
//   })
//   const text = await res.text()
//   let json
//   try { json = JSON.parse(text) }
//   catch { throw new Error(`Non-JSON response: ${text.slice(0, 200)}`) }
//   if (json.error) throw new Error(`${method}: ${JSON.stringify(json.error)}`)
//   return json.result
// }

// function buildClient(account) {
//   return createSmartAccountClient({
//     account,
//     chain: baseSepolia,
//     bundlerTransport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
//     paymaster: {
//       getPaymasterData: op => cdpRpc('pm_getPaymasterData', [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
//       getPaymasterStubData: op => cdpRpc('pm_getPaymasterStubData', [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
//     },
//     userOperation: {
//       estimateFeesPerGas: async () => {
//         const { baseFeePerGas } = await publicClient.getBlock()
//         const base = baseFeePerGas ?? 1_000_000n
//         return { maxFeePerGas: base * 2n, maxPriorityFeePerGas: 2_000_000n }
//       },
//     },
//   })
// }

// export async function createSmartAccount(walletClient) {
//   if (!process.env.NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS) throw new Error('Factory address not configured')
//   const account = await buildSmartAccountFromWallet(walletClient)
//   localStorage.setItem('SmartAccount', account.address)
//   return account
// }

// export async function mintTxHash(smartAccountAddress) {
//   const pvk = process.env.NEXT_PUBLIC_PVK_TOKEN_OWNER
//   if (!pvk) throw new Error('Token owner key not configured')
//   const tokenOwner = privateKeyToAccount(pvk)
//   const wc = createWalletClient({
//     account: tokenOwner, chain: baseSepolia, transport: http('https://sepolia.base.org'),
//   })
//   return wc.sendTransaction({
//     to: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
//     data: encodeFunctionData({
//       abi: mintAbi, functionName: 'mint',
//       args: [smartAccountAddress, 1000n * 10n ** 18n],
//     }),
//   })
// }

// export async function rotation(walletClient, recipientAddress, nextOwnerAddress, amount = 100n) {
//   const contractAddress = localStorage.getItem('SmartAccount')
//   const currentOwner = walletClient?.account?.address
//   if (!contractAddress) throw new Error('No smart account found')
//   if (!recipientAddress) throw new Error('Recipient address missing')
//   if (!nextOwnerAddress) throw new Error('Next owner address missing')

//   const bytecode = await publicClient.getBytecode({ address: contractAddress })
//   const isDeployed = !!bytecode && bytecode !== '0x'

//   if (isDeployed) {
//     const onChainOwner = await publicClient.readContract({
//       address: contractAddress, abi: ownerAbi, functionName: 'owner',
//     })
//     if (onChainOwner.toLowerCase() !== currentOwner.toLowerCase()) {
//       throw new Error(`Not the owner. On-chain: ${onChainOwner}, wallet: ${currentOwner}`)
//     }
//   }

//   const account = await buildSmartAccountFromWallet(walletClient, contractAddress)
//   const client = buildClient(account)

//   const callData = concat([
//     encodeFunctionData({
//       abi: executeAbi, functionName: 'execute',
//       args: [
//         process.env.NEXT_PUBLIC_TOKEN_ADDRESS, 0n,
//         encodeFunctionData({
//           abi: transferAbi, functionName: 'transfer',
//           args: [recipientAddress, amount * 10n ** 18n],
//         }),
//       ],
//     }),
//     nextOwnerAddress,
//   ])

//   const userOpHash = await client.sendUserOperation({ callData })

//   let receipt = null
//   for (let i = 0; i < 60; i++) {
//     try {
//       receipt = await cdpRpc('eth_getUserOperationReceipt', [userOpHash])
//       if (receipt) break
//     } catch {}
//     await new Promise(r => setTimeout(r, 2000))
//   }
//   if (!receipt) throw new Error('Timeout — no receipt after 120s')
//   if (!receipt.success) throw new Error(`UserOp reverted: ${JSON.stringify(receipt)}`)

//   const newOwner = await publicClient.readContract({
//     address: contractAddress, abi: ownerAbi, functionName: 'owner',
//   })
//   if (newOwner.toLowerCase() !== nextOwnerAddress.toLowerCase()) {
//     throw new Error(`Owner not rotated. On-chain: ${newOwner}, expected: ${nextOwnerAddress}`)
//   }

//   const pool = JSON.parse(localStorage.getItem('addresses') || '[]')
//   localStorage.setItem('addresses', JSON.stringify(
//     pool.filter(a => a.toLowerCase() !== nextOwnerAddress.toLowerCase() && a.toLowerCase() !== currentOwner.toLowerCase())
//   ))

//   return {
//     userOpHash,
//     txHash: receipt.receipt.transactionHash,
//     previousOwner: currentOwner,
//     newOwner: nextOwnerAddress,
//     recipientAddress,
//   }
// }

// export { publicClient }
import { http, encodeFunctionData, concat, createWalletClient } from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { createSmartAccountClient } from 'permissionless'
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

async function cdpRpc(method, params, retries = 3) {
  const url = process.env.NEXT_PUBLIC_PAYMASTER_URL
  if (!url) throw new Error('Paymaster URL not configured')

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { jsonrpc: '2.0', id: 1, method, params },
          (_, v) => typeof v === 'bigint' ? '0x' + v.toString(16) : v
        ),
      })
      const text = await res.text()
      let json
      try { json = JSON.parse(text) }
      catch { throw new Error(`Non-JSON response: ${text.slice(0, 200)}`) }

      if (json.error) {
        const isPaymasterInternal = json.error.code === -32000 && json.error.message?.includes('paymaster')
        if (isPaymasterInternal && attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * attempt))
          continue
        }
        throw new Error(`${method}: ${JSON.stringify(json.error)}`)
      }
      return json.result
    } catch (e) {
      if (attempt === retries) throw e
      await new Promise(r => setTimeout(r, 1500 * attempt))
    }
  }
}

function buildClient(account) {
  return createSmartAccountClient({
    account,
    chain: baseSepolia,
    bundlerTransport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL),
    paymaster: {
      getPaymasterData: op => cdpRpc('pm_getPaymasterData', [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
      getPaymasterStubData: op => cdpRpc('pm_getPaymasterStubData', [op, ENTRYPOINT_ADDRESS, '0x' + baseSepolia.id.toString(16)]),
    },
    userOperation: {
      estimateFeesPerGas: async () => {
        const block = await publicClient.getBlock()
        const base = block.baseFeePerGas ?? 1_000_000n
        return { maxFeePerGas: base * 3n, maxPriorityFeePerGas: base }
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

  const bytecode = await publicClient.getBytecode({ address: contractAddress })
  const isDeployed = !!bytecode && bytecode !== '0x'

  if (isDeployed) {
    const onChainOwner = await publicClient.readContract({
      address: contractAddress, abi: ownerAbi, functionName: 'owner',
    })
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

  let receipt = null
  for (let i = 0; i < 60; i++) {
    try {
      receipt = await cdpRpc('eth_getUserOperationReceipt', [userOpHash])
      if (receipt) break
    } catch {}
    await new Promise(r => setTimeout(r, 2000))
  }
  if (!receipt) throw new Error('Timeout — no receipt after 120s')
  if (!receipt.success) throw new Error(`UserOp reverted: ${JSON.stringify(receipt)}`)

  const newOwner = await publicClient.readContract({
    address: contractAddress, abi: ownerAbi, functionName: 'owner',
  })
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