/** @jsxImportSource @emotion/react */
import { bannerItem01Style } from 'assets/style/ComponentStyle'

import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'

const BannerItem01 = (props) => {
  const { data, idx } = props

  return (
    <div
      className="bannerItem01"
      css={bannerItem01Style(data.img)}
      style={{ background: `url(${data.img}) 0 center no-repeat` }}
    >
      <div className="container">
        <p className="content">{data.content}</p>
        <Button theme={idx === 0 ? colors.black : colors.blue}>더보기</Button>
      </div>
    </div>
  )
}

export default BannerItem01
