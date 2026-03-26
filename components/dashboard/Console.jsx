import { useRef, useEffect } from 'react'

const colors = {
  info: 'text-blue-400', ok: 'text-emerald-400',
  warn: 'text-amber-400', err: 'text-red-400', step: 'text-[#00D1A0]',
}

export default function Console({ logs, onClear }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight }, [logs])

  return (
    <div>
      {logs.length > 0 && (
        <div className="flex justify-end mb-2">
          <button onClick={onClear} className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">Clear</button>
        </div>
      )}
      <div ref={ref} className="p-3 overflow-y-auto rounded-lg bg-gray-950 max-h-40">
        {logs.length > 0 ? logs.map(l => (
          <div key={l.id} className="flex gap-2 py-1 border-b border-white/5 last:border-0 font-mono text-[11px] leading-relaxed">
            <span className="text-gray-600 shrink-0">{l.time}</span>
            <span className={colors[l.type] || 'text-gray-400'}>{l.msg}</span>
          </div>
        )) : <p className="text-gray-700 text-[11px] font-mono">Waiting…</p>}
      </div>
    </div>
  )
}