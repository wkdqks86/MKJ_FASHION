function AdminDisplayToggle({
  displayed,
  onToggle,
  disabled,
  ariaLabelOn = '진열 중',
  ariaLabelOff = '진열 안함',
}) {
  return (
    <button
      type="button"
      className={`admin-toggle${displayed ? ' admin-toggle--on' : ''}`}
      onClick={onToggle}
      disabled={disabled}
      aria-label={displayed ? ariaLabelOn : ariaLabelOff}
    >
      <span className="admin-toggle__knob" />
    </button>
  )
}

export default AdminDisplayToggle
