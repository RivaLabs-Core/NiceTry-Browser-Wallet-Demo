export default function ShowSeed({ phrase, onContinue }) {
  const words = phrase.split(' ')
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-bold mb-2 text-center">Your seed phrase</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Write it down and store it somewhere safe.</p>

        <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400 text-sm font-bold">!</div>
            <div>
              <p className="text-red-400 text-sm font-semibold mb-1">You won't see this again</p>
              <p className="text-red-400/70 text-[12px] leading-relaxed">
                This seed phrase will not be shown again. If you lose both your password
                and seed phrase, you lose access to your wallet. Save it now.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#26272A] border border-gray-800 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-1.5">
            {words.map((w, i) => (
              <div key={i} className="bg-gray-800/60 rounded-lg px-2.5 py-2 flex items-center gap-2 font-mono text-[12px]">
                <span className="text-gray-600 text-[10px] w-4 text-right">{i + 1}</span>
                <span className="text-gray-200">{w}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onContinue}
          className="w-full py-3.5 rounded-xl bg-brand hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors">
          I've saved it, continue
        </button>
        <p className="text-[10px] text-gray-600 text-center mt-4">
          The seed phrase will be cleared from memory after this step.
        </p>
      </div>
    </div>
  )
}
