/** @jsxImportSource @emotion/react */
import { cardItem03Style } from 'assets/style/ComponentStyle'
import ReactEvent from 'modules/utils/ReactEvent'

{
  /*
    @INFO
    type : "" : type02
*/
}

const CardItem03 = (props) => {
  const { type, data } = props

  const onClickCardItem = () => {
    ReactEvent.dispatchEvent('clickRecommendedCompany', data)
  }

  if (type === 'type02') {
    return (
      <div className="carditem03 type02" css={cardItem03Style} onClick={onClickCardItem} style={{ cursor: 'pointer' }}>
        <div className="img_wrap">
          <img src={data.img} alt="" />
        </div>
        <div className="content">
          <p className="title">{data.title}</p>
          <p className="type">
            <span className="type_item">{data.location}</span>
            <span className="type_item">{data.term}</span>
          </p>
          <p className="name">{data.name}</p>
          <p className="info">{data.info}</p>
        </div>
      </div>
    )
  }

  else if (type === 'type04') {
      // 매칭 투자희망기업
      return (
          <div className="carditem03 type02">
              {/*좋아요 클릭하면 like_wrap + active*/}
              <div className="like_wrap">
                  <div className="number">123</div>
              </div>
              <div className="img_wrap">
                  {data.img ? (
                      <img src={data.img} alt="" />
                  ) : (
                      <img src={require('assets/images/no_img.jpg').default} alt="이미지가 없습니다" />
                  )}
              </div>
              <div className="content">
                  <p className="title">{data.title}</p>
                  <p className="type">
                      <span className="type_item">{data.location}</span>
                      <span className="type_item">{data.term}</span>
                  </p>
                  <p className="name">{data.name}</p>
                  <p className="info">{data.info}</p>
              </div>
          </div>
      )
  }

  else {
    return (
      <div className="carditem03" css={cardItem03Style} style={{ cursor: 'pointer' }} onClick={onClickCardItem}>
        <div className="img_wrap">
          <img src={data.img} alt="" />
        </div>
        <div className="content">
          <p className="type">{data.type}</p>
          <p className="name">{data.name}</p>
          <p className="info">{data.info}</p>
        </div>
      </div>
    )
  }
}

export default CardItem03
