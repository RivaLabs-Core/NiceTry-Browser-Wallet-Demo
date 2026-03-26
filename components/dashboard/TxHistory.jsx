// import { shortAddr } from '@/lib/utils'

// function TxRow({ tx }) {
//   const explorer = 'https://sepolia.basescan.org/tx/'
//   const hashEl = tx.txHash
//     ? <a href={`${explorer}${tx.txHash}`} target="_blank" rel="noopener noreferrer"
//         className="text-blue-400 underline hover:text-blue-300 underline-offset-2">{shortAddr(tx.txHash)}</a>
//     : <span className="text-gray-400">—</span>

//   return (
//     <div className="p-3 transition-all border border-gray-800 rounded-lg bg-gray-800/40 hover:border-gray-700">
//       <div className="flex items-center gap-2 mb-2">
//         <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/20">
//           Send + rotate
//         </span>
//         <span className="text-[10px] text-gray-600 font-mono ml-auto">{tx.time}</span>
//       </div>
//       <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
//         <div className="flex items-center col-span-2 gap-2">
//           <span className="text-gray-500 shrink-0">Tx</span>
//           <span className="font-mono truncate">{hashEl}</span>
//         </div>
//         {tx.userOpHash && (
//           <div className="flex items-center col-span-2 gap-2">
//             <span className="text-gray-500 shrink-0">UserOp</span>
//             <span className="font-mono text-gray-400 truncate">{shortAddr(tx.userOpHash)}</span>
//           </div>
//         )}
//         <div className="flex items-center gap-2">
//           <span className="text-gray-500 shrink-0">To</span>
//           <span className="font-mono text-gray-300 truncate">{shortAddr(tx.to)}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-gray-500 shrink-0">Amount</span>
//           <span className="font-mono text-gray-300">{tx.amount} TKN</span>
//         </div>
//         <div className="col-span-2 mt-1 pt-1.5 border-t border-gray-700/50">
//           <div className="flex items-center gap-2">
//             <span className="text-gray-500 text-[10px] shrink-0">Key rotation</span>
//             <div className="flex items-center gap-1.5 font-mono text-[10px]">
//               <span className="line-through text-red-400/70">key[{tx.keyFrom}]</span>
//               <span className="text-gray-600">→</span>
//               <span className="text-emerald-400">key[{tx.keyTo}]</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-1.5 font-mono text-[10px] mt-1">
//             <span className="line-through truncate text-red-400/50">{shortAddr(tx.signerAddr)}</span>
//             <span className="text-gray-600">→</span>
//             <span className="truncate text-emerald-400/80">{shortAddr(tx.newSignerAddr)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function TxHistory({ transactions }) {
//   return (
//     <div className="p-4 bg-[#26272A] border border-gray-800 rounded-xl">
//       <div className="flex items-center gap-2 mb-3">
//         <div className="w-2 h-2 rounded-full bg-cyan-500" />
//         <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Transactions</h2>
//         <span className="text-[10px] text-gray-600 font-mono ml-auto">
//           {transactions.length} tx{transactions.length !== 1 ? 's' : ''}
//         </span>
//       </div>
//       {transactions.length > 0 ? (
//         <div className="pr-1 space-y-2 overflow-y-auto max-h-72">
//           {[...transactions].reverse().map(tx => <TxRow key={tx.id} tx={tx} />)}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center h-20 text-sm text-gray-700">
//           No transactions yet
//         </div>
//       )}
//     </div>
//   )
// }


import { shortAddr } from '@/lib/utils'

function TxRow({ tx }) {
  const explorer = 'https://sepolia.basescan.org/tx/'
  const hashEl = tx.txHash
    ? <a href={`${explorer}${tx.txHash}`} target="_blank" rel="noopener noreferrer"
        className="text-blue-400 underline hover:text-blue-300 underline-offset-2">{shortAddr(tx.txHash)}</a>
    : <span className="text-gray-400">—</span>

  return (
    <div className="p-3 transition-all border border-gray-800 rounded-lg bg-gray-800/40 hover:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/20">
          Send + rotate
        </span>
        <span className="text-[10px] text-gray-600 font-mono ml-auto">{tx.time}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
        <div className="flex items-center col-span-2 gap-2">
          <span className="text-gray-500 shrink-0">Tx</span>
          <span className="font-mono truncate">{hashEl}</span>
        </div>
        {tx.userOpHash && (
          <div className="flex items-center col-span-2 gap-2">
            <span className="text-gray-500 shrink-0">UserOp</span>
            <span className="font-mono text-gray-400 truncate">{shortAddr(tx.userOpHash)}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 shrink-0">To</span>
          <span className="font-mono text-gray-300 truncate">{shortAddr(tx.to)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 shrink-0">Amount</span>
          <span className="font-mono text-gray-300">{tx.amount} ETH</span>
        </div>
        <div className="col-span-2 mt-1 pt-1.5 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[10px] shrink-0">Key rotation</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="line-through text-red-400/70">key[{tx.keyFrom}]</span>
              <span className="text-gray-600">→</span>
              <span className="text-emerald-400">key[{tx.keyTo}]</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] mt-1">
            <span className="line-through truncate text-red-400/50">{shortAddr(tx.signerAddr)}</span>
            <span className="text-gray-600">→</span>
            <span className="truncate text-emerald-400/80">{shortAddr(tx.newSignerAddr)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TxHistory({ transactions }) {
  return (
    <div className="p-4 bg-[#26272A] border border-gray-800 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-cyan-500" />
        <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Transactions</h2>
        <span className="text-[10px] text-gray-600 font-mono ml-auto">
          {transactions.length} tx{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>
      {transactions.length > 0 ? (
        <div className="pr-1 space-y-2 overflow-y-auto max-h-72">
          {[...transactions].reverse().map(tx => <TxRow key={tx.id} tx={tx} />)}
        </div>
      ) : (
        <div className="flex items-center justify-center h-20 text-sm text-gray-700">
          No transactions yet
        </div>
      )}
    </div>
  )
}