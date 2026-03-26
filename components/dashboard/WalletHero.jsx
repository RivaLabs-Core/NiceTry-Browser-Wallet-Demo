import { useState, useEffect, useCallback } from 'react'
import { getAllBalances } from '@/lib/tokens'
import { shortAddr } from '@/lib/utils'

function EthLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 784 784" fill="none">
      <circle cx="392" cy="392" r="392" fill="#627EEA"/>
      <path d="M392.07 92.5V315.24L580.43 399.54L392.07 92.5Z" fill="#fff" fillOpacity=".6"/>
      <path d="M392.07 92.5L203.72 399.54L392.07 315.24V92.5Z" fill="#fff"/>
      <path d="M392.07 536.98V691.15L580.53 432.39L392.07 536.98Z" fill="#fff" fillOpacity=".6"/>
      <path d="M392.07 691.15V536.97L203.72 432.39L392.07 691.15Z" fill="#fff"/>
      <path d="M392.07 504.13L580.43 399.54L392.07 315.26V504.13Z" fill="#fff" fillOpacity=".2"/>
      <path d="M203.72 399.54L392.07 504.13V315.26L203.72 399.54Z" fill="#fff" fillOpacity=".6"/>
    </svg>
  )
}

export default function WalletHero({ smartAddr, onSend, onReceive }) {
  const [balances, setBalances] = useState(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!smartAddr) return
    setLoading(true)
    try { setBalances(await getAllBalances(smartAddr)) } catch {}
    setLoading(false)
  }, [smartAddr])

  useEffect(() => { refresh() }, [refresh])

  const ethBal = balances?.eth
  const tokens = balances?.tokens || []
  const ethDisplay = ethBal ? parseFloat(ethBal.balance).toFixed(6) : '0.000000'

  return (
    <div className="p-5 bg-[#26272A] border border-gray-800 rounded-2xl">

      {/* ETH balance hero */}
      <div className="mb-5 text-center">
        <div className="flex justify-center mb-3">
          <EthLogo size={40} />
        </div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-bold tracking-tight">{ethDisplay}</span>
          <span className="text-lg font-medium text-gray-500">ETH</span>
        </div>
        <button onClick={refresh} disabled={loading}
          className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-30 mt-1">
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {/* Send / Receive */}
      <div className="flex gap-3">
        <button onClick={onSend}
          className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold transition-colors rounded-xl bg-[#3F56E3] hover:bg-[#5D73FF] text-white">
          
          Send
        </button>
        <button onClick={onReceive}
          className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-semibold text-gray-200 transition-colors bg-gray-800 border border-gray-700 rounded-xl hover:bg-[#5D73FF] hover:text-black">
         
          Receive
        </button>
      </div>
{/* 
   
      {tokens.length > 0 && (
        <div className="pt-4 mt-4 space-y-2 border-t border-gray-800">
          {tokens.map(t => (
            <div key={t.address} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center text-[10px] font-bold text-brand">
                  {t.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-[12px] font-medium">{t.symbol}</p>
                  <p className="text-[10px] text-gray-600">{shortAddr(t.address)}</p>
                </div>
              </div>
              <p className="font-mono text-[12px] text-gray-300">{parseFloat(t.balance).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  )
}