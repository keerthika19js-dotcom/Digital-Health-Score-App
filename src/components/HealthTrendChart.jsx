import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function HealthTrendChart({ data, activeMetric = 'overall', setActiveMetric, items = ['Overall', 'Performance', 'Security', 'Accessibility', 'UX'] }) {
  const metricMap = {
    overall: 'overall',
    performance: 'performance',
    security: 'security',
    accessibility: 'accessibility',
    ux: 'ux',
  }

  const visibleData = data.map((point) => ({
    ...point,
    value: point[metricMap[activeMetric]] ?? point.overall,
  }))

  return (
    <section className="panel chart-panel">
      <div className="panel-header-row">
        <div>
          <h3>Digital Health Trend</h3>
        </div>
        <div className="segmented-control" aria-label="Trend metric filters">
          {items.map((item) => {
            const key = item.toLowerCase() === 'overall' ? 'overall' : item.toLowerCase() === 'ux' ? 'ux' : item.toLowerCase()
            const isActive = activeMetric === key
            return (
              <button key={item} type="button" className={isActive ? 'active' : ''} onClick={() => setActiveMetric(key)}>
                {item}
              </button>
            )
          })}
        </div>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={visibleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="healthFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#4cc9f0" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4cc9f0" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2c46" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#7f93b7" />
            <YAxis tickLine={false} axisLine={false} stroke="#7f93b7" domain={[40, 100]} />
            <Tooltip
              contentStyle={{
                background: '#0d1b2a',
                border: '1px solid #1f3a5f',
                borderRadius: '12px',
                color: '#edf5ff',
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#4cc9f0" fill="url(#healthFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
