/** @jsxImportSource @emotion/react */
import { cardItem05Style } from 'assets/style/ComponentStyle'
const CardItem05 = (props) => {
  const { data, idx } = props
  return (
    <div className={'carditem05'} css={cardItem05Style}>
      <div className="profile_pic">
        <img src={data.image} alt={"슬라이드이미지" + idx} />
      </div>
      <div className="profile_txt">
        <p className="cnt">{data.content}</p>
        <span className="ceo">{data.name}</span>
        <span className="company">{data.company}</span>
      </div>
    </div>
  )
}

export default CardItem05
