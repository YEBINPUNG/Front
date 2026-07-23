import { chipStyle } from '../constants/ui.js'

export default function PageHeader({ icon, color, title, description }) {
  return (
    <div className="page-header">
      <div className="page-icon-circle" style={chipStyle(color)}>
        {icon}
      </div>
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
  )
}
