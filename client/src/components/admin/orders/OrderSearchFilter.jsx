import { useState } from 'react'
import { DATE_PRESETS, ORDER_FILTER_STATUSES } from '@/constants/adminData'

function OrderSearchFilter({ onSearch, onReset }) {
  const [datePreset, setDatePreset] = useState('전체')
  const [statuses, setStatuses] = useState([])
  const [keyword, setKeyword] = useState('')

  const toggleStatus = (key) => {
    setStatuses((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    )
  }

  const handleSearch = () => {
    onSearch({ datePreset, statuses, keyword })
  }

  const handleReset = () => {
    setDatePreset('전체')
    setStatuses([])
    setKeyword('')
    onReset()
  }

  return (
    <div className="admin-card admin-filter-card">
      <h3 className="admin-card__title">주문 검색</h3>

      <div className="admin-filter-row">
        <span className="admin-filter-label">기간</span>
        <div className="admin-chip-group">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`admin-chip${datePreset === preset ? ' admin-chip--active' : ''}`}
              onClick={() => setDatePreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-filter-row">
        <span className="admin-filter-label">주문 상태</span>
        <div className="admin-checkbox-group">
          {ORDER_FILTER_STATUSES.map(({ key, label }) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={statuses.includes(key)}
                onChange={() => toggleStatus(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-filter-row">
        <span className="admin-filter-label">검색</span>
        <div className="admin-search-row">
          <input
            type="text"
            className="admin-input"
            placeholder="주문번호 / 주문자명"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="button" className="admin-btn admin-btn--dark" onClick={handleSearch}>
            검색
          </button>
        </div>
        <button type="button" className="admin-btn admin-btn--outline" onClick={handleReset}>
          초기화
        </button>
      </div>
    </div>
  )
}

export default OrderSearchFilter
