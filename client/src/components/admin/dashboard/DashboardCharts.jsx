import { ORDER_VOLUME_CHART, REVENUE_CHART } from '@/constants/adminData'

function DashboardCharts() {
  const maxRevenue = Math.max(...REVENUE_CHART.map((d) => d.value))
  const maxVolume = Math.max(...ORDER_VOLUME_CHART.map((d) => d.value))

  return (
    <div className="admin-chart-grid">
      <div className="admin-card admin-chart">
        <h3 className="admin-card__title">월별 매출 추이</h3>
        <div className="admin-line-chart">
          {REVENUE_CHART.map((item) => (
            <div key={item.month} className="admin-line-chart__bar-wrap">
              <div
                className="admin-line-chart__bar"
                style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                title={`${item.month}: ${item.value}%`}
              />
              <span className="admin-line-chart__label">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card admin-chart">
        <h3 className="admin-card__title">일별 주문량</h3>
        <div className="admin-bar-chart">
          {ORDER_VOLUME_CHART.map((item) => (
            <div key={item.day} className="admin-bar-chart__col">
              <div
                className="admin-bar-chart__bar"
                style={{ height: `${(item.value / maxVolume) * 100}%` }}
                title={`${item.day}: ${item.value}건`}
              />
              <span className="admin-line-chart__label">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardCharts
