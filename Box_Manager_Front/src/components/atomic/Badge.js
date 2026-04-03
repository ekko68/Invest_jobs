const Badge = (props) => {
  const { className = '', children, ...others } = props
  return (
    <div className={`badge ${className}`} {...others}>
      {children}
    </div>
  )
}

export default Badge
