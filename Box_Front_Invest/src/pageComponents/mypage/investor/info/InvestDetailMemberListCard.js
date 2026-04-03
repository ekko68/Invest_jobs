/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react'
import { cardItem06Style } from 'assets/style/ComponentStyle'
import Input from 'components/atomic/Input'
const InvestDetailMemberListCard = (props) => {
  const { data } = props
  // crrCon: "경력1"
  // fileId: null
  // imgUrl: null
  // rprsCrofId: "5dc5f092-9a19-4b07-9238-9273599cc47e"
  // rprsCrofJbcl: "직급1"
  // rprsCrofNm: "테스트멤버1-1"
  // utlinsttId: "C0002222"

  useEffect(() => {}, [])
  const getImage = () => {
    if (data['imgUrl'] === null || data['imgUrl'] === undefined || String(data['imgUrl']).trim() === '') {
      return <img src={'/images/img_person.png'} alt="" />
    } else {
      return <img src={data['imgUrl']} alt="" />
    }
  }
  return (
    <div className={'carditem06'} css={cardItem06Style}>
      <div className="img_wrap img_cover">{getImage()}</div>
      <div className="content">
        <div className="content_inner scroll_lightgrey">
          <p className="position">{data['rprsCrofJbcl']}</p>
          <p className="name">{data['rprsCrofNm']}</p>
          <p className="info">{data['crrCon']}</p>
        </div>
      </div>
    </div>
  )
}

export default InvestDetailMemberListCard
