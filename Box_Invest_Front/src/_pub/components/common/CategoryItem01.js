/** @jsxImportSource @emotion/react */
import { Link } from 'react-router-dom'

const CategoryItem01 = (props) => {
  const { data } = props

  return (
    <div className={'category_item01'}>
      <Link to={data.url} className="category_inner">
        <img src={data.bg} alt="분야 썸네일" />
        <p className="title">{data.name}</p>
      </Link>
    </div>
  )
}

export default CategoryItem01
