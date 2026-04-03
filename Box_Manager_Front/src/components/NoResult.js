const NoResult = (props) => {
  const { msg = '결과가 없습니다.', ...other } = props
  return (
    <div className="no_result" {...other}>
      {msg}
    </div>
  )
}

export default NoResult
