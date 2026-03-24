import { useState, useEffect, useCallback } from 'react'
import { getAllBalances } from '@/lib/tokens'

export default function TokenBalances({ smartAddr }) {
  const [balances, setBalances] = useState(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!smartAddr) return
    setLoading(true)
    try {
      const b = await getAllBalances(smartAddr)
      setBalances(b)
    } catch {}
    setLoading(false)
  }, [smartAddr])

  useEffect(() => { refresh() }, [refresh])

  const ethBal = balances?.eth
  const tokens = balances?.tokens || []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-brand" />
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Balances</h2>
        <button onClick={refresh} disabled={loading}
          className="ml-auto text-[10px] text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-30">
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {ethBal ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">E</div>
              <span className="text-sm font-medium">ETH</span>
            </div>
            <span className="font-mono text-sm text-gray-300">
              {parseFloat(ethBal.balance).toFixed(6)}
            </span>
          </div>

          {tokens.map(t => (
            <div key={t.address} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-[10px] font-bold text-brand">
                  {t.symbol.slice(0, 2)}
                </div>
                <span className="text-sm font-medium">{t.symbol}</span>
              </div>
              <span className="font-mono text-sm text-gray-300">
                {parseFloat(t.balance).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center text-gray-700 text-sm">
          {loading ? 'Loading balances…' : 'No balances yet'}
        </div>
      )}
    </div>
  )
}
