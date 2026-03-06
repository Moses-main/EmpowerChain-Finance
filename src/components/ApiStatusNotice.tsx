interface ApiStatusNoticeProps {
  message: string
  type?: 'warning' | 'error'
}

export default function ApiStatusNotice({ message, type = 'warning' }: ApiStatusNoticeProps) {
  const palette = type === 'error'
    ? { background: '#fee2e2', border: '#fca5a5', text: '#991b1b' }
    : { background: '#fef9c3', border: '#fde68a', text: '#854d0e' }

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 rounded-lg border px-4 py-3 text-sm"
      style={{
        backgroundColor: palette.background,
        borderColor: palette.border,
        color: palette.text,
      }}
    >
      {message}
    </div>
  )
}
