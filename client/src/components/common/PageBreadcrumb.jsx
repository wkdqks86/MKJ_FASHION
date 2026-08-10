import { Link } from 'react-router-dom'

function PageBreadcrumb({ className, items }) {
  return (
    <nav className={className} aria-label="breadcrumb">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && <span>&gt;</span>}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export default PageBreadcrumb
