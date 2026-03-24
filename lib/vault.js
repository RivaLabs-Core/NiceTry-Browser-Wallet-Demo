async function deriveKey(password, salt) {
  const km = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  )
}

export async function encryptVault(password, data) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(data)
  )
  return JSON.stringify({
    salt: Array.from(salt),
    iv: Array.from(iv),
    ct: Array.from(new Uint8Array(ct)),
  })
}

export async function decryptVault(password, blob) {
  const { salt, iv, ct } = JSON.parse(blob)
  const key = await deriveKey(password, new Uint8Array(salt))
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) }, key, new Uint8Array(ct)
  )
  return new TextDecoder().decode(pt)
}

export async function saveVault(phrase, currentIndex, password) {
  const vault = JSON.stringify({ phrase, currentIndex })
  localStorage.setItem('nt_vault', await encryptVault(password, vault))
}

export async function loadVault(password) {
  const blob = localStorage.getItem('nt_vault')
  if (!blob) return null
  const json = await decryptVault(password, blob)
  return JSON.parse(json)
}

export function hasVault() {
  return typeof window !== 'undefined' && !!localStorage.getItem('nt_vault')
}

export function clearVault() {
  localStorage.removeItem('nt_vault')
  localStorage.removeItem('SmartAccount')
  localStorage.removeItem('addresses')
}
