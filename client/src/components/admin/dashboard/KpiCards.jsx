import { KPI_STATS } from '@/constants/adminData'

function KpiCards() {
  return (
    <div className="admin-kpi-grid">
      {KPI_STATS.map((kpi) => (
        <article key={kpi.label} className="admin-kpi">
          <div>
            <p className="admin-kpi__label">{kpi.label}</p>
            <p className="admin-kpi__value">{kpi.value}</p>
            {kpi.trendDir !== 'neutral' && (
              <p className={`admin-kpi__trend admin-kpi__trend--${kpi.trendDir}`}>
                {kpi.trend} {kpi.trendDir === 'up' ? 'vs. 어제' : 'vs. 어제'}
              </p>
            )}
            {kpi.trendDir === 'neutral' && (
              <p className="admin-kpi__trend" style={{ color: '#888' }}>{kpi.trend}</p>
            )}
          </div>
          <div className="admin-kpi__icon" aria-hidden="true">{kpi.icon}</div>
        </article>
      ))}
    </div>
  )
}

export default KpiCards
