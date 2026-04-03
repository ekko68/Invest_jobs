/** @jsxImportSource @emotion/react */
import { newsItem01Style } from 'assets/style/ComponentStyle'
import { Link } from 'react-router-dom'

const NewsItem01 = (props) => {
  const { data } = props
  return (
    <div className="news_item01" css={newsItem01Style}>
      <Link to={data.url}>
        <div className="img_wrap">
          <img src={data.img} alt="" />
        </div>
        <div className="content_wrap">
          <p className="company">{data.name}</p>
          <p className="title">{data.title}</p>
          <p className="content">{data.content}</p>
          <p className="date">{data.date}</p>
        </div>
      </Link>
    </div>
  )
}

export default NewsItem01
