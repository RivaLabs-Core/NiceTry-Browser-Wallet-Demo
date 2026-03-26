const styles = {
  active: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
  next:   'bg-[#134134] border-[#00D1A0] text-[#00D1A0]',
  burned: 'border-transparent opacity-30 line-through text-gray-500',
  future: 'border-transparent text-gray-500 opacity-40',
}

const tags = {
  active: <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full">SIGNER</span>,
  next:   <span className="text-[9px] font-bold bg-purple-500/20 text-[#00D1A0] px-1.5 py-0.5 rounded-full">NEXT</span>,
  burned: <span className="text-[9px] font-bold bg-red-500/15 text-red-400/60 px-1.5 py-0.5 rounded-full">BURNED</span>,
}

function KeyNode({ k }) {
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] border transition-all duration-300 ${styles[k.status]}`}>
      <span className="font-semibold w-5 text-right shrink-0">{k.index}</span>
      <span className="flex-1 truncate">{k.address}</span>
      {tags[k.status] || null}
    </div>
  )
}

export default function KeyTree({ tree, currentIndex }) {
  const keysLeft = tree.length - currentIndex - 1

  return (
    <div className="bg-[#26272A] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Key tree</h2>
        <span className="text-[10px] text-gray-600 font-mono ml-auto">BIP-44</span>
      </div>
      <p className="text-[10px] font-mono text-gray-600 mb-3">m/44&apos;/60&apos;/0&apos;/0/index</p>
      <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
        {tree.map(k => <KeyNode key={k.index} k={k} />)}
      </div>
      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800 text-[11px]">
        <span className="text-gray-500">Index: <span className="font-mono text-blue-400 font-semibold">{currentIndex}</span></span>
        <span className="text-gray-500">Burned: <span className="font-mono text-red-400 font-semibold">{currentIndex}</span></span>
        <span className="text-gray-500">Left: <span className="font-mono text-emerald-400 font-semibold">{keysLeft}</span></span>
      </div>
    </div>
  )
}
