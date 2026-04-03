import React from 'react'

const Skeleton = (props) => {
  const { type, count = 3, colSpan = 2 } = props

  if (type === 'list') {
    return [...Array(count)].map((_, index) => (
      <tr className="is-skeleton" key={'skeletonList' + index}>
        <td className={'ta_center'} colSpan={colSpan}></td>
      </tr>
    ))
  }

  return null
}

export default Skeleton
