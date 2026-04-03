/** @jsxImportSource @emotion/react */
import { titleStyle } from 'assets/style/AtomicStyle'

const Title = (props) => {
  const { children } = props
  return (
    <div className="divider_title" css={titleStyle}>
      <h3 className="title">{children}</h3>
    </div>
  )
}

export default Title
