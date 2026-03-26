import { useState } from 'react'
import Logo from '@/components/shared/Logo'

export default function UnlockPage({ onUnlock, onDelete }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleUnlock = async () => {
    setError('')
    try { await onUnlock(password) }
    catch { setError('Wrong password') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#26272A] border border-gray-800 flex items-center justify-center mx-auto mb-6">
          <Logo size={36} />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Enter your password to unlock</p>
        <div className="space-y-3">
          <input type="password" placeholder="Password" value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
            className="w-full bg-[#26272A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleUnlock}
            className="w-full py-3 rounded-xl bg-brand hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors">
            Unlock
          </button>
        </div>
        <button onClick={onDelete} className="w-full mt-6 text-[11px] text-red-400/50 hover:text-red-400 transition-colors">
          Delete wallet and start over
        </button>
      </div>
    </div>
  )
}
