import { SearchIcon } from '@/components/admin/common/AdminIcons'

function AdminSearchField({
  variant = 'light',
  value,
  onChange,
  onSearch,
  placeholder = '검색...',
  ariaLabel = '검색',
}) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch?.()
  }

  return (
    <form
      className={`admin-search-field admin-search-field--${variant}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        className="admin-search-field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <button type="submit" className="admin-search-field__btn" aria-label="검색 실행">
        <SearchIcon />
      </button>
    </form>
  )
}

export default AdminSearchField
