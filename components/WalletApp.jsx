'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { generatePhrase, rootFromPhrase, deriveTree, deriveKey, makeWalletClient } from '@/lib/hdWallet'
import { saveVault, loadVault, hasVault, clearVault } from '@/lib/vault'
import { createSmartAccount, rotation, publicClient } from '@/lib/web3Management'
import { ownerAbi } from '@/lib/smartAccount'
import { shortAddr, timestamp } from '@/lib/utils'

import LandingPage from '@/components/auth/LandingPage'
import CreatePassword from '@/components/auth/CreatePassword'
import ShowSeed from '@/components/auth/ShowSeed'
import RecoverSeed from '@/components/auth/RecoverSeed'
import RecoverPassword from '@/components/auth/RecoverPassword'
import RecoverScanning from '@/components/auth/RecoverScanning'
import UnlockPage from '@/components/auth/UnlockPage'
import Dashboard from '@/components/dashboard/Dashboard'

export default function WalletApp() {
  const [page, setPage] = useState('landing')
  const [loading, setLoading] = useState(false)
  const [generatedPhrase, setGeneratedPhrase] = useState('')
  const [recoverPhrase, setRecoverPhrase] = useState('')
  const [recoverSteps, setRecoverSteps] = useState([])
  const [recoverResult, setRecoverResult] = useState(null)

  const [tree, setTree] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [smartAddr, setSmartAddr] = useState('')
  const [logs, setLogs] = useState([])
  const [busy, setBusy] = useState(false)
  const [txHistory, setTxHistory] = useState([])
  const [recipient, setRecipient] = useState('0x000000000000000000000000000000000000dEaD')
  const [amount, setAmount] = useState('0.001')
  const [sessionPw, setSessionPw] = useState('')

  const rootRef = useRef(null)

  useEffect(() => {
    if (hasVault()) setPage('unlock')
  }, [])

  const log = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev, { time: timestamp(), msg, type, id: Date.now() + Math.random() }])
  }, [])

  // ── Navigation helper ──────────────────────────────────────────────────

  const navigate = useCallback((p) => setPage(p), [])

  // ── Reset all state ────────────────────────────────────────────────────

  const resetState = useCallback(() => {
    rootRef.current = null
    setTree([]); setCurrentIndex(0); setSmartAddr(''); setLogs([]); setTxHistory([])
    setBusy(false); setGeneratedPhrase(''); setRecoverPhrase('')
    setRecoverSteps([]); setRecoverResult(null); setSessionPw('')
  }, [])

  // ══════════════════════════════════════════════════════════════════════
  //  CREATE WALLET
  // ══════════════════════════════════════════════════════════════════════

  const handleCreate = useCallback(async (password) => {
    setLoading(true)
    try {
      const phrase = generatePhrase()
      const root = rootFromPhrase(phrase)
      rootRef.current = root

      const t = deriveTree(root, 0)
      setTree(t)
      setCurrentIndex(0)
      setSessionPw(password)
      await saveVault(phrase, 0, password)

      const wc = makeWalletClient(t[0].privateKey)
      const sa = await createSmartAccount(wc)
      setSmartAddr(sa.address)
      localStorage.setItem('SmartAccount', sa.address)
      localStorage.setItem('addresses', JSON.stringify(t.map(k => k.address)))

      setGeneratedPhrase(phrase)
      setPage('show-seed')
    } catch (e) {
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  // ══════════════════════════════════════════════════════════════════════
  //  RECOVER WALLET
  // ══════════════════════════════════════════════════════════════════════

  const handleRecoverSeedSubmit = useCallback((phrase) => {
    setRecoverPhrase(phrase)
    setPage('recover-pw')
  }, [])

  const handleRecoverStart = useCallback(async (password) => {
    setPage('recover-scanning')
    setRecoverSteps([])
    setRecoverResult(null)

    const addStep = (msg, type = 'info') => {
      setRecoverSteps(prev => [...prev, { msg, type }])
    }

    try {
      const root = rootFromPhrase(recoverPhrase)
      rootRef.current = root
      addStep('Seed phrase validated')

      const key0 = deriveKey(root, 0)
      addStep(`key[0] derived: ${shortAddr(key0.address)}`)

      const wc = makeWalletClient(key0.privateKey)
      const sa = await createSmartAccount(wc)
      const smartAddress = sa.address
      addStep(`Smart account found: ${shortAddr(smartAddress)}`)

      const bytecode = await publicClient.getBytecode({ address: smartAddress })
      const isDeployed = !!bytecode && bytecode !== '0x'

      if (!isDeployed) {
        addStep('Contract not yet deployed — will be created on first tx', 'warn')
        const t = deriveTree(root, 0)
        setTree(t); setCurrentIndex(0); setSessionPw(password)
        await saveVault(recoverPhrase, 0, password)
        setSmartAddr(smartAddress)
        localStorage.setItem('SmartAccount', smartAddress)
        localStorage.setItem('addresses', JSON.stringify(t.map(k => k.address)))
        setRecoverResult({ index: 0, smartAddress })
        addStep('Recovery complete — index 0', 'ok')
        return
      }

      addStep('Contract deployed — reading on-chain owner…')

      const currentOwner = await publicClient.readContract({
        address: smartAddress, abi: ownerAbi, functionName: 'owner',
      })
      addStep(`On-chain owner: ${shortAddr(currentOwner)}`)
      addStep('Scanning HD tree…')

      const BASE = "m/44'/60'/0'/0"
      let recoveredIndex = -1

      for (let i = 0; i < 100; i++) {
        const node = root.derivePath(`${BASE}/${i}`)
        if (node.address.toLowerCase() === currentOwner.toLowerCase()) {
          recoveredIndex = i
          addStep(`Match found: key[${i}] = ${shortAddr(node.address)}`, 'ok')
          break
        }
        if (i > 0 && i % 10 === 0) addStep(`Scanned ${i} keys…`)
      }

      if (recoveredIndex === -1) {
        addStep('Owner not found in HD tree — wrong seed phrase?', 'err')
        return
      }

      const t = deriveTree(root, recoveredIndex)
      setTree(t); setCurrentIndex(recoveredIndex); setSessionPw(password)
      await saveVault(recoverPhrase, recoveredIndex, password)
      setSmartAddr(smartAddress)
      localStorage.setItem('SmartAccount', smartAddress)
      localStorage.setItem('addresses', JSON.stringify(t.map(k => k.address)))

      if (recoveredIndex > 0) addStep(`${recoveredIndex} rotations detected — ${recoveredIndex} keys burned`, 'info')
      addStep(`Active signer: key[${recoveredIndex}]`, 'ok')
      addStep('Recovery complete', 'ok')
      setRecoverResult({ index: recoveredIndex, smartAddress })

    } catch (e) {
      addStep(`Error: ${e.message}`, 'err')
    }
  }, [recoverPhrase])

  // ══════════════════════════════════════════════════════════════════════
  //  UNLOCK
  // ══════════════════════════════════════════════════════════════════════

  const handleUnlock = useCallback(async (password) => {
    const vault = await loadVault(password)
    if (!vault) throw new Error('Wrong password')

    const root = rootFromPhrase(vault.phrase)
    rootRef.current = root
    setSessionPw(password)
    setTree(deriveTree(root, vault.currentIndex))
    setCurrentIndex(vault.currentIndex)
    setSmartAddr(localStorage.getItem('SmartAccount') || '')
    setPage('dashboard')
  }, [])

  // ══════════════════════════════════════════════════════════════════════
  //  SEND + ROTATE
  // ══════════════════════════════════════════════════════════════════════

  const handleSendRotate = useCallback(async () => {
    if (busy || currentIndex >= tree.length - 1) return
    setBusy(true)

    const cur = tree[currentIndex]
    const next = tree[currentIndex + 1]

    log(`═══ SEND + ROTATE ═══`, 'step')

    // Validate inputs
    if (!smartAddr) {
      log('No smart account address found', 'err')
      setBusy(false)
      return
    }
    if (!recipient || !/^0x[0-9a-fA-F]{40}$/.test(recipient)) {
      log('Invalid recipient address', 'err')
      setBusy(false)
      return
    }
    const parsedAmount = parseFloat(amount)
    if (amount === '' || isNaN(parsedAmount) || parsedAmount < 0) {
      log('Invalid amount', 'err')
      setBusy(false)
      return
    }

    // Check balance before sending
    try {
      const { parseEther, formatEther } = await import('viem')
      const balance = await publicClient.getBalance({ address: smartAddr })      
      const required = parseEther(amount)
      if (balance < required) {
        log(`Insufficient balance: ${formatEther(balance)} ETH available, ${amount} ETH required`, 'err')
        setBusy(false)
        return
      }
      log(`Balance OK: ${formatEther(balance)} ETH`, 'ok')
    } catch (e) {
      log(`Balance check failed: ${e.message}`, 'err')
      setBusy(false)
      return
    }

    log(`Sending ${amount} ETH to ${shortAddr(recipient)}`, 'info')
    log(`Signer: key[${cur.index}] = ${shortAddr(cur.address)}`, 'info')
    log(`Next: key[${next.index}] = ${shortAddr(next.address)}`, 'info')

    let txData = { txHash: '', userOpHash: '' }

    try {
      const wc = makeWalletClient(cur.privateKey)
      log('Signing UserOp…', 'step')
      const result = await rotation(wc, recipient, next.address, amount)
      txData = { txHash: result.txHash, userOpHash: result.userOpHash }
      log(`UserOp: ${shortAddr(result.userOpHash)}`, 'ok')
      log(`Tx: ${shortAddr(result.txHash)}`, 'ok')
      log(`owner() = ${shortAddr(result.newOwner)}`, 'ok')
    } catch (e) {
      log(`Error: ${e.message}`, 'err')
      setBusy(false)
      return
    }

    const newIdx = currentIndex + 1
    setCurrentIndex(newIdx)
    setTree(deriveTree(rootRef.current, newIdx))

    if (sessionPw) {
      try {
        const vault = await loadVault(sessionPw)
        if (vault) await saveVault(vault.phrase, newIdx, sessionPw)
      } catch {}
    }

    log(`Key[${cur.index}] DESTROYED`, 'warn')
    log(`Key[${next.index}] is now active`, 'ok')
    log('═══ ROTATION COMPLETE ═══', 'ok')

    setTxHistory(prev => [...prev, {
      id: Date.now(), time: timestamp(), type: 'rotate',
      txHash: txData.txHash, userOpHash: txData.userOpHash,
      to: recipient, amount,
      keyFrom: cur.index, keyTo: next.index,
      signerAddr: cur.address, newSignerAddr: next.address,
    }])

    setBusy(false)
  }, [busy, currentIndex, tree, recipient, amount, log, sessionPw, smartAddr])

  // ── Lock / Delete ──────────────────────────────────────────────────────

  const handleLock = useCallback(() => {
    resetState()
    setPage(hasVault() ? 'unlock' : 'landing')
  }, [resetState])

  const handleDelete = useCallback(() => {
    clearVault()
    resetState()
    setPage('landing')
  }, [resetState])

  // ══════════════════════════════════════════════════════════════════════
  //  ROUTING
  // ══════════════════════════════════════════════════════════════════════

  switch (page) {
    case 'landing':
      return <LandingPage onNavigate={navigate} />

    case 'create-pw':
      return <CreatePassword onSubmit={handleCreate} onBack={() => navigate('landing')} loading={loading} />

    case 'show-seed':
      return <ShowSeed phrase={generatedPhrase} onContinue={() => { setGeneratedPhrase(''); setPage('dashboard') }} />

    case 'recover-seed':
      return <RecoverSeed onSubmit={handleRecoverSeedSubmit} onBack={() => navigate('landing')} />

    case 'recover-pw':
      return <RecoverPassword onSubmit={handleRecoverStart} onBack={() => navigate('recover-seed')} loading={loading} />

    case 'recover-scanning':
      return <RecoverScanning
        steps={recoverSteps} result={recoverResult}
        onContinue={() => { setRecoverPhrase(''); setPage('dashboard') }}
        onRetry={() => navigate('recover-seed')} />

    case 'unlock':
      return <UnlockPage onUnlock={handleUnlock} onDelete={handleDelete} />

    case 'dashboard':
      return <Dashboard
        smartAddr={smartAddr} tree={tree} currentIndex={currentIndex}
        logs={logs} txHistory={txHistory} busy={busy}
        recipient={recipient} amount={amount}
        onRecipientChange={setRecipient} onAmountChange={setAmount}
        onSend={handleSendRotate} onClearLogs={() => setLogs([])} onLock={handleLock} />

    default:
      return <LandingPage onNavigate={navigate} />
  }
}