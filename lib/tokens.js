import { publicClient } from './smartAccount'
import { formatEther, formatUnits } from 'viem'

const ERC20_BALANCE_ABI = [{
  name: 'balanceOf', type: 'function', stateMutability: 'view',
  inputs: [{ name: 'account', type: 'address' }],
  outputs: [{ name: '', type: 'uint256' }],
}]

const ERC20_SYMBOL_ABI = [{
  name: 'symbol', type: 'function', stateMutability: 'view',
  inputs: [], outputs: [{ name: '', type: 'string' }],
}]

const ERC20_DECIMALS_ABI = [{
  name: 'decimals', type: 'function', stateMutability: 'view',
  inputs: [], outputs: [{ name: '', type: 'uint8' }],
}]

export async function getEthBalance(address) {
  const balance = await publicClient.getBalance({ address })
  return { symbol: 'ETH', balance: formatEther(balance), raw: balance }
}

export async function getTokenBalance(tokenAddress, walletAddress) {
  try {
    const [balance, symbol, decimals] = await Promise.all([
      publicClient.readContract({ address: tokenAddress, abi: ERC20_BALANCE_ABI, functionName: 'balanceOf', args: [walletAddress] }),
      publicClient.readContract({ address: tokenAddress, abi: ERC20_SYMBOL_ABI, functionName: 'symbol' }),
      publicClient.readContract({ address: tokenAddress, abi: ERC20_DECIMALS_ABI, functionName: 'decimals' }),
    ])
    return { symbol, balance: formatUnits(balance, decimals), raw: balance, decimals, address: tokenAddress }
  } catch {
    return null
  }
}

export async function getAllBalances(walletAddress) {
  const eth = await getEthBalance(walletAddress)
  const tokens = []

  const tokenAddr = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
  if (tokenAddr) {
    const tkn = await getTokenBalance(tokenAddr, walletAddress)
    if (tkn) tokens.push(tkn)
  }

  return { eth, tokens }
}
