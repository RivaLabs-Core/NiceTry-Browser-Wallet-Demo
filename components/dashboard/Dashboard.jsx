import { useState } from 'react'
import Logo from '@/components/shared/Logo'
import { shortAddr } from '@/lib/utils'
import WalletHero from './WalletHero'
import SendRotate from './SendRotate'
import KeyTree from './KeyTree'
import TxHistory from './TxHistory'
import Console from './Console'
import ReceiveModal from './ReceiveModal'

export default function Dashboard({
  smartAddr, tree, currentIndex, logs, txHistory, busy,
  recipient, amount, onRecipientChange, onAmountChange,
  onSend, onClearLogs, onLock,
}) {
  const [view, setView] = useState('home')
  const [showReceive, setShowReceive] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [sendConsoleOpen, setSendConsoleOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const activeKey = tree[currentIndex]
  const nextKey = tree[currentIndex + 1]

  const copyAddress = async () => {
    await navigator.clipboard.writeText(smartAddr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-md mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0">
            <Logo size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight">Nice Try</h1>
              <span className="text-[9px] text-whitefont-semibold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5  bg-[#231DF9] animate-pulse" />
                Sepolia
              </span>
            </div>
          </div>
          <button onClick={onLock}
            className="text-[11px] text-gray-500 hover:text-gray-300 font-medium px-2.5 py-1.5 border border-gray-800 rounded-lg transition-colors shrink-0">
            Lock
          </button>
        </div>

        {/* ── Smart account address (clickable to copy) ── */}
        <button onClick={copyAddress}
          className="flex items-center w-full gap-2 px-3 py-2 mb-5 transition-colors border rounded-lg bg-[#26272A]/50 border-gray-800/50 hover:border-gray-700 group">
          <span className="font-mono text-[11px] text-gray-500 truncate flex-1 text-left">{smartAddr}</span>
          <span className={`text-[10px] font-medium shrink-0 transition-colors ${
            copied ? 'text-brand' : 'text-gray-600 group-hover:text-gray-400'
          }`}>
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>

        {/* ── Navigation tabs ── */}
        <div className="flex gap-1 p-1 mb-4 bg-[#26272A] border border-gray-800 rounded-xl">
          {[
            { id: 'home', label: 'Wallet' },
            { id: 'send', label: 'Send' },
            { id: 'activity', label: 'Activity' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                view === tab.id ? 'bg-[#1E4942] text-[#00D1A0]]' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Views ── */}

        {view === 'home' && (
          <div className="space-y-3">
            <WalletHero
              smartAddr={smartAddr}
              onSend={() => setView('send')}
              onReceive={() => setShowReceive(true)}
            />

            <div className="p-4 bg-[#26272A] border border-gray-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Signer status</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 border rounded-lg bg-blue-500/10 border-blue-500/30">
                  <p className="text-[9px] text-blue-400/60 font-semibold mb-0.5">ACTIVE KEY</p>
                  <p className="font-mono text-[11px] text-blue-400 truncate">key[{currentIndex}]</p>
                </div>
                <span className="text-gray-700 shrink-0">→</span>
                <div className="flex-1 px-3 py-2 border rounded-lg bg-[#134134] border-[#00D1A0]">
                  <p className="text-[9px] text-[#00D1A0]  font-semibold mb-0.5">NEXT</p>
                  <p className="font-mono text-[11px] text-[#00D1A0] truncate">key[{currentIndex + 1}]</p>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-[11px]">
                <span className="text-gray-500">Rotations: <span className="font-mono font-semibold text-[#00D1A0]]">{currentIndex}</span></span>
                <span className="text-gray-500">Keys left: <span className="font-mono font-semibold text-[#00D1A0]]">{tree.length - currentIndex - 1}</span></span>
              </div>
            </div>

            {txHistory.length > 0 && (
              <div className="p-4 bg-[#26272A] border border-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Recent</h2>
                  </div>
                  <button onClick={() => setView('activity')} className="text-[10px] text-brand hover:text-emerald-300 transition-colors">View all</button>
                </div>
                <div className="space-y-2">
                  {txHistory.slice(-2).reverse().map(tx => (
                    <div key={tx.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/40">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15">
                          <span className="text-[10px] text-amber-400">↑</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium">Send + Rotate</p>
                          <p className="text-[10px] text-gray-500 font-mono">{shortAddr(tx.to)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-mono text-gray-300">-{tx.amount} ETH</p>
                        <p className="text-[10px] text-gray-600">{tx.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'send' && (
          <div className="space-y-3">
            <SendRotate
              activeKey={activeKey} nextKey={nextKey} currentIndex={currentIndex}
              busy={busy} onSend={onSend}
              recipient={recipient} amount={amount}
              onRecipientChange={onRecipientChange} onAmountChange={onAmountChange}
            />
            {logs.length > 0 && (
              <div className="overflow-hidden bg-[#26272A] border border-gray-800 rounded-xl">
                <button onClick={() => setSendConsoleOpen(!sendConsoleOpen)}
                  className="flex items-center w-full gap-2 p-4 transition-colors hover:bg-gray-800/30">
                  <div className={`w-2 h-2 rounded-full ${busy ? 'bg-amber-500 animate-pulse' : logs.some(l => l.type === 'err') ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                    {busy ? 'Processing…' : logs.some(l => l.type === 'err') ? 'Error' : 'Done'}
                  </h2>
                  <span className="text-[9px] font-mono text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">{logs.length}</span>
                  <svg className={`ml-auto w-4 h-4 text-gray-600 transition-transform ${sendConsoleOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {sendConsoleOpen && (
                  <div className="px-4 pb-4">
                    <Console logs={logs} onClear={onClearLogs} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'activity' && (
          <div className="space-y-3">
            <TxHistory transactions={txHistory} />
            <KeyTree tree={tree} currentIndex={currentIndex} />

            <div className="overflow-hidden bg-[#26272A] border border-gray-800 rounded-xl">
              <button onClick={() => setConsoleOpen(!consoleOpen)}
                className="flex items-center w-full gap-2 p-4 transition-colors hover:bg-gray-800/30">
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <h2 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Console</h2>
                {logs.length > 0 && (
                  <span className="text-[9px] font-mono text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">{logs.length}</span>
                )}
                <svg className={`ml-auto w-4 h-4 text-gray-600 transition-transform ${consoleOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {consoleOpen && (
                <div className="px-4 pb-4">
                  <Console logs={logs} onClear={onClearLogs} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showReceive && <ReceiveModal smartAddr={smartAddr} onClose={() => setShowReceive(false)} />}
    </div>
  )
}