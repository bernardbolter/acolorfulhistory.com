interface FaultLineProps {
  className?: string
}

/** Asymmetric field/dense boundary — 2px charcoal + 1px cream hairline. */
export default function FaultLine({ className = '' }: FaultLineProps) {
  return (
    <div className={`fault-line ${className}`} role="presentation">
      <span className="fault-line-heavy" />
      <span className="fault-line-light" />
    </div>
  )
}
