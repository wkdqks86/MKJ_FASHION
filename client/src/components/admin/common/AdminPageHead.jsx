function AdminPageHead({ breadcrumb, title, description }) {
  return (
    <div className="admin-page-head">
      {breadcrumb && <p className="admin-page-head__breadcrumb">{breadcrumb}</p>}
      <h1 className="admin-page-head__title">{title}</h1>
      {description && <p className="admin-page-head__desc">{description}</p>}
    </div>
  )
}

export default AdminPageHead
