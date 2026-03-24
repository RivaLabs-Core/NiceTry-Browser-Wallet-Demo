export default function Spinner({ className = 'w-4 h-4', color = 'border-white' }) {
  return (
    <span className={`${className} border-2 border-transparent ${color} border-t-current rounded-full animate-spin inline-block`} />
  )
}
