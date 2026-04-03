/** @jsxImportSource @emotion/react */
import { maxCountStyle } from 'assets/style/AtomicStyle'
import { useEffect, useImperativeHandle, useState } from 'react'
import { forwardRef } from 'react'
const MaxLengthCount = forwardRef((props, ref) => {
  const { max = 0, defaultCount = 0, id = '' } = props
  const [count, setCount] = useState(0)
  useImperativeHandle(ref, () => ({
    setData,
    getId
  }))
  useEffect(() => {
    setCount(defaultCount)
  }, [defaultCount])
  const setData = (cnt) => {
    setCount(cnt)
  }
  const getId = () => {
    return id
  }
  return (
    <div className="max_count" css={maxCountStyle}>
      <p className="count">{count}</p>
      <p className="max">{max}</p>
    </div>
  )
});

export default MaxLengthCount;
