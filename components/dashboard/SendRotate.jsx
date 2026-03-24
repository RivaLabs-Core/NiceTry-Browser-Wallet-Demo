// import { shortAddr } from '@/lib/utils'
// import Spinner from '@/components/shared/Spinner'

// export default function SendRotate({ activeKey, nextKey, currentIndex, busy, onSend, recipient, amount, onRecipientChange, onAmountChange }) {
//   return (
//     <div className="space-y-3">
//       {/* Send form */}
//       <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl">
//         <h2 className="mb-4 text-sm font-semibold">Send tokens</h2>

//         <div className="mb-5 space-y-3">
//           <div>
//             <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Recipient address</label>
//             <input value={recipient} onChange={e => onRecipientChange(e.target.value)}
//               placeholder="0x…"
//               className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 font-mono text-[12px] text-gray-300 focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
//           </div>
//           <div>
//             <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Amount</label>
//             <div className="relative">
//               <input value={amount} onChange={e => onAmountChange(e.target.value)}
//                 placeholder="0"
//                 className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-16 font-mono text-[12px] text-gray-300 focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
//               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 font-semibold">TKN</span>
//             </div>
//           </div>
//         </div>

//         <button onClick={onSend} disabled={busy || !nextKey}
//           className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
//             busy ? 'bg-brand/20 text-brand animate-pulse'
//                  : 'bg-brand hover:bg-emerald-400 text-gray-950'
//           }`}>
//           {busy
//             ? <span className="flex items-center justify-center gap-2"><Spinner className="w-4 h-4" color="border-brand" /> Sending + rotating…</span>
//             : 'Send + rotate key'}
//         </button>
//       </div>

//       {/* Key rotation info */}
//       <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
//         <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-3">Key rotation preview</p>
//         <div className="flex items-center gap-2">
//           <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2.5">
//             <p className="text-[9px] text-blue-400/60 font-semibold mb-0.5">SIGNS TX</p>
//             <p className="font-mono text-[11px] text-blue-400 truncate">
//               key[{currentIndex}] {activeKey ? shortAddr(activeKey.address) : ''}
//             </p>
//           </div>
//           <span className="text-lg text-gray-700 shrink-0">→</span>
//           <div className="flex-1 bg-purple-500/10 border border-purple-500/25 rounded-lg px-3 py-2.5">
//             <p className="text-[9px] text-purple-400/60 font-semibold mb-0.5">ROTATES TO</p>
//             <p className="font-mono text-[11px] text-purple-400 truncate">
//               key[{currentIndex + 1}] {nextKey ? shortAddr(nextKey.address) : '—'}
//             </p>
//           </div>
//         </div>
//         <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">
//           This transaction will be signed with the current key, then the signer
//           atomically rotates to the next key. The old key is destroyed.
//         </p>
//       </div>
//     </div>
//   )
// }

import { shortAddr } from '@/lib/utils'
import Spinner from '@/components/shared/Spinner'

export default function SendRotate({ activeKey, nextKey, currentIndex, busy, onSend, recipient, amount, onRecipientChange, onAmountChange }) {
  return (
    <div className="space-y-3">
      {/* Send form */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-2xl">
        <h2 className="mb-4 text-sm font-semibold">Send tokens</h2>

        <div className="mb-5 space-y-3">
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Recipient address</label>
            <input value={recipient} onChange={e => onRecipientChange(e.target.value)}
              placeholder="0x…"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 font-mono text-[12px] text-gray-300 focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 font-medium block mb-1.5">Amount (ETH)</label>
            <div className="relative">
              <input value={amount} onChange={e => onAmountChange(e.target.value)}
                placeholder="0.001"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-16 font-mono text-[12px] text-gray-300 focus:border-brand focus:outline-none transition-colors placeholder:text-gray-600" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 font-semibold">ETH</span>
            </div>
          </div>
        </div>

        <button onClick={onSend} disabled={busy || !nextKey}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
            busy ? 'bg-brand/20 text-brand animate-pulse'
                 : 'bg-brand hover:bg-emerald-400 text-gray-950'
          }`}>
          {busy
            ? <span className="flex items-center justify-center gap-2"><Spinner className="w-4 h-4" color="border-brand" /> Sending + rotating…</span>
            : 'Send + rotate key'}
        </button>
      </div>

      {/* Key rotation info */}
      <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-3">Key rotation preview</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2.5">
            <p className="text-[9px] text-blue-400/60 font-semibold mb-0.5">SIGNS TX</p>
            <p className="font-mono text-[11px] text-blue-400 truncate">
              key[{currentIndex}] {activeKey ? shortAddr(activeKey.address) : ''}
            </p>
          </div>
          <span className="text-lg text-gray-700 shrink-0">→</span>
          <div className="flex-1 bg-purple-500/10 border border-purple-500/25 rounded-lg px-3 py-2.5">
            <p className="text-[9px] text-purple-400/60 font-semibold mb-0.5">ROTATES TO</p>
            <p className="font-mono text-[11px] text-purple-400 truncate">
              key[{currentIndex + 1}] {nextKey ? shortAddr(nextKey.address) : '—'}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-3 leading-relaxed">
          This transaction will be signed with the current key, then the signer
          atomically rotates to the next key. The old key is destroyed.
        </p>
      </div>
    </div>
  )
}