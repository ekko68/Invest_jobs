/** @jsxImportSource @emotion/react */
import { newsItem03Style } from 'assets/style/ComponentStyle'
import { Link } from 'react-router-dom'

const NewsItem03 = (props) => {
  const { data } = props

  return (
    <div className="news_item03" css={newsItem03Style}>
      <Link to={data.url}>
        <div className="news_content">
          <div className="news_content_img">
            <img src={data.img} alt="" />
          </div>
          <div className="news_content_info">
            <p className="title">{data.title}</p>
            <p className="subtitle">{data.subtitle}</p>
            <div className="companyNdate">
              <span>{data.name}</span>
              <span>{data.date}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NewsItem03
