import { shortAddr } from '@/lib/utils'

const icons = { ok: '✓', err: '✗', warn: '!', info: '→' }
const colors = { ok: 'text-emerald-400', err: 'text-red-400', warn: 'text-amber-400', info: 'text-blue-400' }
const bgColors = { ok: 'bg-emerald-500/15', err: 'bg-red-500/15', warn: 'bg-amber-500/15', info: 'bg-blue-500/15' }

export default function RecoverScanning({ steps, result, onContinue, onRetry }) {
  const hasError = steps.some(s => s.type === 'err')
  const scanning = !result && !hasError

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold mb-2 text-center">
          {result ? 'Wallet recovered' : 'Recovery in progress…'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {result ? shortAddr(result.smartAddress) : 'Scanning HD tree against on-chain owner…'}
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[12px]">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bgColors[step.type]}`}>
                  <span className={`text-[10px] font-bold ${colors[step.type]}`}>{icons[step.type]}</span>
                </div>
                <span className={`${colors[step.type]} leading-relaxed`}>{step.msg}</span>
              </div>
            ))}
            {scanning && steps.length > 0 && (
              <div className="flex items-center gap-2.5 text-[12px]">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <span className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                </div>
                <span className="text-gray-500">Processing…</span>
              </div>
            )}
          </div>
        </div>

        {result && (
          <>
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="text-gray-500 mb-0.5">Smart account</p>
                  <p className="font-mono text-brand text-[11px]">{shortAddr(result.smartAddress)}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Active signer</p>
                  <p className="font-mono text-brand text-[11px]">key[{result.index}]</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Keys burned</p>
                  <p className="font-mono text-red-400 text-[11px]">{result.index}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5">Rotations done</p>
                  <p className="font-mono text-blue-400 text-[11px]">{result.index}</p>
                </div>
              </div>
            </div>
            <button onClick={onContinue}
              className="w-full py-3.5 rounded-xl bg-brand hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors">
              Open wallet
            </button>
          </>
        )}

        {hasError && (
          <button onClick={onRetry}
            className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm border border-gray-700 transition-colors">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
