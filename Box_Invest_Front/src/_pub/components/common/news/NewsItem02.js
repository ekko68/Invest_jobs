/** @jsxImportSource @emotion/react */
import { newsItem02Style } from 'assets/style/ComponentStyle'
import { Link } from 'react-router-dom'

const NewsItem02 = (props) => {
  const { data } = props

  return (
    <div className="news_item02" css={newsItem02Style}>
      <Link to={data.url}>
        <div className="img_wrap">
          <img src={data.img} alt="" />
        </div>
        <div className="content_wrap">
          <p className="content">{data.title}</p>
        </div>
      </Link>
    </div>
  )
}

export default NewsItem02
