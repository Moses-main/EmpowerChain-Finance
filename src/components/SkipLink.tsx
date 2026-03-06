import { useState, type ReactNode } from 'react'

interface SkipLinkProps {
  children: ReactNode
}

export default function SkipLink({ children }: SkipLinkProps) {
  const [focused, setFocused] = useState(false)

  return (
    <a
      href="#main-content"
      className={`absolute left-0 top-0 -translate-y-full transition-transform focus:translate-y-0 z-[100] px-4 py-2 bg-green-600 text-white font-medium rounded-b-md ${
        focused ? 'translate-y-0' : ''
      }`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      Skip to main content
    </a>
  )
}
