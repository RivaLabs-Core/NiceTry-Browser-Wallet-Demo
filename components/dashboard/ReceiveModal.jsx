import { useState } from 'react'

function QRCode({ data, size = 200 }) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=111827&color=37E8A5&format=svg`
  return <img src={url} alt="QR Code" width={size} height={size} className="rounded-lg" />
}

export default function ReceiveModal({ smartAddr, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(smartAddr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-[#26272A] border border-gray-800 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">Receive</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg leading-none">&times;</button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-gray-800 p-3 rounded-xl">
            <QRCode data={smartAddr} size={180} />
          </div>
        </div>

        <p className="text-[10px] text-gray-500 text-center mb-2">Smart account address</p>
        <div className="bg-gray-800/50 rounded-lg px-3 py-2.5 mb-4">
          <p className="font-mono text-[11px] text-gray-300 break-all text-center leading-relaxed">{smartAddr}</p>
        </div>

        <button onClick={handleCopy}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            copied ? 'bg-brand/20 text-brand' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
          }`}>
          {copied ? 'Copied!' : 'Copy address'}
        </button>

        <p className="text-[10px] text-gray-600 text-center mt-3">
          This address stays the same. Only the signing key rotates.
        </p>
      </div>
    </div>
  )
}
