interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-white/[0.06] rounded-2xl p-4 sm:p-5 ${
        onClick ? 'cursor-pointer hover:border-white/15 hover:bg-card2 transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
