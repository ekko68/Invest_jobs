/** @jsxImportSource @emotion/react */
import { flagStyle } from 'assets/style/AtomicStyle'

const Flag = (props) => {
  const { className, text, bg } = props
  return (
    <div className={`flag ${className ? className : ''}`} css={flagStyle(bg)}>
      {text}
    </div>
  )
}

export default Flag
