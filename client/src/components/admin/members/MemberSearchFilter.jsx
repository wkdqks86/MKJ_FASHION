import { useState } from 'react'
import { MEMBER_FILTER_STATUSES, MEMBER_FILTER_TYPES } from '@/constants/adminData'

function MemberSearchFilter({ onSearch, onReset }) {
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [keyword, setKeyword] = useState('')

  const toggleType = (key) => {
    setTypes((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const toggleStatus = (key) => {
    setStatuses((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const handleSearch = () => {
    onSearch({ types, statuses, keyword })
  }

  const handleReset = () => {
    setTypes([])
    setStatuses([])
    setKeyword('')
    onReset()
  }

  return (
    <div className="admin-card admin-filter-card">
      <h3 className="admin-card__title">회원 검색</h3>

      <div className="admin-filter-row">
        <span className="admin-filter-label">회원 유형</span>
        <div className="admin-checkbox-group admin-checkbox-group--two-col">
          {MEMBER_FILTER_TYPES.map(({ key, label }) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={types.includes(key)}
                onChange={() => toggleType(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="admin-filter-row">
        <span className="admin-filter-label">계정 상태</span>
        <div className="admin-checkbox-group admin-checkbox-group--two-col">
          {MEMBER_FILTER_STATUSES.map(({ key, label }) => (
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
            placeholder="이름 / 이메일 / 연락처"
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

export default MemberSearchFilter
