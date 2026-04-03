/** @jsxImportSource @emotion/react */

const CardLayout = (props) => {
  const { children, type = 'default' } = props
  return <div className={`card_layout ${type === 'dark' ? 'dark' : ''}`}>{children}</div>
}

export default CardLayout
