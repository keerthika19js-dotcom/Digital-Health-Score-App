export default function ScoreRing({ score = 78, label = 'Digital Health Score', status = 'GOOD', trend = '+6.4% from previous scan', lastScanned = 'Today, 10:42 AM' }) {
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div className="score-ring-card">
      <div className="score-visual">
        <svg viewBox="0 0 200 200" className="score-ring-svg" aria-label={`${label} ${score}`}>
          <circle cx="100" cy="100" r={radius} className="ring-bg" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="ring-progress"
            style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
          />
        </svg>

        <div className="score-text-wrap">
          <div className="score-value">{score}</div>
          <div className="score-max">/ 100</div>
        </div>
      </div>

      <div className="score-summary">
        <div className="score-label">{label}</div>
        <div className="score-status">{status}</div>
        <div className="scan-meta">Last scanned: {lastScanned}</div>
        <div className="trend-up">{trend}</div>
      </div>
    </div>
  )
}
