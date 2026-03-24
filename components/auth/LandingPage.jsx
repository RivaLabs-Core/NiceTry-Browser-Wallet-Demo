import Logo from '@/components/shared/Logo'

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-8">
          <Logo size={48} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Nice Try</h1>
        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
          Quantum-resistant wallet.<br />
          One key per transaction. Always ahead.
        </p>
        <div className="space-y-3">
          <button onClick={() => onNavigate('create-pw')}
            className="w-full py-3.5 rounded-xl bg-brand hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors">
            Create new wallet
          </button>
          <button onClick={() => onNavigate('recover-seed')}
            className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm border border-gray-700 transition-colors">
            Recover wallet
          </button>
        </div>
      </div>
    </div>
  )
}
