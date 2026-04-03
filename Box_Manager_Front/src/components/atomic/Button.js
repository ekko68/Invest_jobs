const Button = (props) => {
  const { className = '', children, ...others } = props
  return (
    <button className={`button ${className}`} {...others}>
      {children}
    </button>
  )
}

export default Button
