function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

const ICONS = {
  edit: EditIcon,
  delete: DeleteIcon,
}

function AdminIconButton({ variant = 'edit', label, as: Component = 'button', className = '', ...props }) {
  const Icon = ICONS[variant] || EditIcon

  return (
    <Component
      className={`admin-icon-btn${className ? ` ${className}` : ''}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon />
    </Component>
  )
}

export default AdminIconButton
