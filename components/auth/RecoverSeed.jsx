import { useState } from 'react'
import { validatePhrase } from '@/lib/hdWallet'

export default function RecoverSeed({ onSubmit, onBack }) {
  const [phrase, setPhrase] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    const cleaned = phrase.trim().toLowerCase()
    const words = cleaned.split(/\s+/)
    if (words.length !== 12 && words.length !== 24) { setError('Enter 12 or 24 words'); return }
    if (!validatePhrase(cleaned)) { setError('Invalid seed phrase'); return }
    onSubmit(cleaned)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">← Back</button>
        <h1 className="text-xl font-bold mb-1">Recover wallet</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Enter your seed phrase to recover your wallet. We'll scan the blockchain
          to find your smart account and the exact active key index.
        </p>
        <div className="space-y-3">
          <textarea rows={4} placeholder="word1 word2 word3 … word12" value={phrase}
            onChange={e => { setPhrase(e.target.value); setError('') }}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600 resize-none" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-brand hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors">
            Continue
          </button>
        </div>
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="text-brand font-semibold">Security: </span>
            Your seed phrase never leaves your browser. It's validated locally
            and encrypted with the password you choose in the next step.
          </p>
        </div>
      </div>
    </div>
  )
}
