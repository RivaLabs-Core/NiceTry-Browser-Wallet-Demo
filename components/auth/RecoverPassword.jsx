import { useState } from 'react'
import Spinner from '@/components/shared/Spinner'

export default function RecoverPassword({ onSubmit, onBack, loading }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (password.length < 6) { setError('Minimum 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    onSubmit(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">← Back</button>
        <h1 className="text-xl font-bold mb-1">Set a password</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Protect your recovered wallet with a new local password.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Password</label>
            <input type="password" placeholder="Minimum 6 characters" value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="w-full bg-[#26272A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Confirm</label>
            <input type="password" placeholder="Repeat password" value={confirm}
              onChange={e => { setConfirm(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full bg-[#26272A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-semibold text-sm transition-colors mt-1">
            {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Recovering…</span> : 'Start recovery'}
          </button>
        </div>
      </div>
    </div>
  )
}
