/** @jsxImportSource @emotion/react */
import { badgeStyle } from 'assets/style/AtomicStyle'

/*
type = default || linear || rounded
* */
const Badge = (props) => {
  const { className, type = 'default', theme = '#bebbc9', color = '#fff', children, ...other } = props
  return (
    <span className={`badge ${className}`} css={badgeStyle(type, theme, color)}>
      {children}
    </span>
  )
}

export default Badge
