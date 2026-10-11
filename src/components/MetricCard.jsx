import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react'

const statusMeta = {
  Good: { className: 'status-good', icon: CheckCircle2 },
  Healthy: { className: 'status-good', icon: CheckCircle2 },
  Excellent: { className: 'status-good', icon: CheckCircle2 },
  'Needs Attention': { className: 'status-warning', icon: AlertTriangle },
  'Needs Improvement': { className: 'status-danger', icon: AlertTriangle },
  Critical: { className: 'status-danger', icon: ShieldCheck },
}

export default function MetricCard({ title, score, detail, status, accent = 'blue', onViewDetails }) {
  const meta = statusMeta[status] ?? statusMeta.Good
  const Icon = meta.icon
  const percent = Math.min(score, 100)

  return (
    <article className={`metric-card ${accent}`}>
      <div className="card-header-row">
        <div>
          <p className="eyebrow">{title}</p>
          <div className="score-row">
            <span className="metric-score">{score}</span>
            <span className="score-slash">/100</span>
          </div>
        </div>
        <span className={`status-badge ${meta.className}`}>
          <Icon size={12} />
          {status}
        </span>
      </div>

      <div className="progress-track">
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="metric-detail">{detail}</p>

      <button type="button" className="secondary-button" onClick={onViewDetails}>
        View Details
      </button>
    </article>
  )
}
