export function shortAddr(a) {
  return a ? a.slice(0, 8) + '…' + a.slice(-6) : '—'
}

export function timestamp() {
  const d = new Date()
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(n => String(n).padStart(2, '0')).join(':')
}
