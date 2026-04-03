/** @jsxImportSource @emotion/react */
import { cardItem01Style } from 'assets/style/ComponentStyle'

import { Link } from 'react-router-dom'
import { LikeBtn } from 'components/atomic/IconButton'
import Slider2 from 'components/common/slider/Slider2'
import {createKey} from "modules/utils/CommonUtils";

/**
 * @deprecated
 */
const CardItem01 = (props) => {
  const { data } = props
  const onClickFavorite = (event) => {
    event.preventDefault()
    return
  }
  const onClickDetail = (event) => {
    event.preventDefault()
    return
  }
  return (
    <div className="carditem01" css={cardItem01Style}>
      <div className="inner" onClick={(event) => onClickDetail(event)} style={{ cursor: 'pointer' }}>
        {data.img.length === 1 ? (
          <div className="img_wrap">
            <div className="img_inner">
              <img src={data.img[0]} alt="" />
            </div>
          </div>
        ) : (
          <div className="img_wrap">
            <Slider2 data={data.img} />
          </div>
        )}
        <div className="container">
          <div className="cont_header">
            <p className="tit">{data.name}</p>
            {/*<LikeBtn onClick={(event) => onClickFavorite(event)} />*/}
          </div>
          <ul className="tag_list">
            {data.tags.map((tag) => (
              <li key={createKey()} className="tag_item">
                {tag}
              </li>
            ))}
          </ul>
          <div className="content">{data.content}</div>
          <div className="cont_footer">
            <span className="location">{data.location}</span>
            <dl className="dl">
              <dt>조회: </dt>
              <dd>{data.view}</dd>
            </dl>
          </div>
        </div>
      </div>
      {/*<Link to={data.url} className="inner">*/}
      {/*  {data.img.length === 1 ? (*/}
      {/*    <div className="img_wrap">*/}
      {/*      <img src={data.img[0]} alt="" />*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <div className="img_wrap">*/}
      {/*      <Slider2 data={data.img} />*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*  <div className="container">*/}
      {/*    <div className="cont_header">*/}
      {/*      <p className="tit">{data.name}</p>*/}
      {/*      /!*<LikeBtn onClick={(event) => onClickFavorite(event)} />*!/*/}
      {/*    </div>*/}
      {/*    <ul className="tag_list">*/}
      {/*      {data.tags.map((tag) => (*/}
      {/*        <li key={tag} className="tag_item">*/}
      {/*          {tag}*/}
      {/*        </li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*    <div className="content">{data.content}</div>*/}
      {/*    <div className="cont_footer">*/}
      {/*      <span className="location">{data.location}</span>*/}
      {/*      <dl className="dl">*/}
      {/*        <dt>조회: </dt>*/}
      {/*        <dd>{data.view}</dd>*/}
      {/*      </dl>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Link>*/}
    </div>
  )
}

export default CardItem01
