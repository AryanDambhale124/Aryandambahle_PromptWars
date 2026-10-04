import { Eye } from 'lucide-react'

export default function Navbar({ onHome }) {
  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-5">
      <nav aria-label="Primary">
        <button onClick={onHome} className="flex items-center gap-2 rounded-md font-display text-lg font-extrabold tracking-[0.2em]">
          <Eye className="h-5 w-5 text-cyan" aria-hidden="true" />
          BLINDSPOT
        </button>
      </nav>
    </header>
  )
}
