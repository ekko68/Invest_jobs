/** @jsxImportSource @emotion/react */
import { cardItem02Style } from 'assets/style/ComponentStyle'
import { LinkBtn } from 'components/atomic/IconButton'

const CardItem02 = (props) => {
  const { data } = props
  return (
    <div className="carditem02" css={cardItem02Style}>
      <div className="info_wrap">
        <p className="name">{data.name}</p>
        <p className="title">{data.title}</p>
        <p className="content">{data.intro}</p>
        <LinkBtn>바로가기</LinkBtn>
      </div>
      <div className="img_section">
        <div className="img_wrap">
          <img src={data.img} alt="" />
        </div>
      </div>
    </div>
  )
}

export default CardItem02
