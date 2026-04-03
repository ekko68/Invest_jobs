/** @jsxImportSource @emotion/react */
import React from "react";
import { cardItem03Style } from 'assets/style/ComponentStyle'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from 'modules/utils/StringUtils'
import {randomEmptyLogoImageIdx} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";

const RecommendInvestorCard = (props) => {
  const { item } = props
  const history = useHistory()
  const onClickCardItem = () => {
    const url = ROUTER_NAMES.INVEST_DETAIL + '?utlinsttId=' + item['utlinsttId']
    history.push(url)
  }
  return (
    <div className="carditem03" css={cardItem03Style}
         style={{ cursor: 'pointer' }} onClick={onClickCardItem}>
      <div className="img_wrap">
          {
              (StringUtils.hasLength(item?.logoImageUrl) && item?.defaultLogoYn === CheckYn.NO)
                  ? <img src={item.logoImageUrl} alt={item.bplcNm + " 로고이미지"}/>
                  : <>
                      <p>{item.defaultLogoChar}</p>
                      {/*<img src={require(`assets/images/empty_${randomEmptyLogoImageIdx(item.key)}.png`).default} alt="이미지가 없습니다"/>*/}
                      <img src={require('assets/images/empty_' + randomEmptyLogoImageIdx(item.key) + '.png').default} alt="이미지가 없습니다"/>
                  </>
        }
      </div>
      <div className="content">
        <p className="type">{item['enprDsncClsfNm']}</p>
        <p className="name">{item['bplcNm']}</p>
        <p className="info" dangerouslySetInnerHTML={{
            __html: StringUtils.hasLength(item?.enprInrdCon)
                ? StringUtils.toBr(item.enprInrdCon) : ''
        }}></p>
      </div>
    </div>
  )
}

export default RecommendInvestorCard
