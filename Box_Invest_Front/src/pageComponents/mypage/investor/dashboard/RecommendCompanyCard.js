/** @jsxImportSource @emotion/react */
import React, {useContext} from "react";
import {useHistory} from 'react-router-dom'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from 'modules/utils/StringUtils'
import {randomEmptyLogoImageIdx} from "modules/utils/CommonUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CheckYn, UsisType} from "modules/consts/BizConst";

const RecommendCompanyCard = (props) => {

    const {item, toggleLike=null} = props
    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const onClickCardItem = () => {
        const url = ROUTER_NAMES.COMPANY_DETAIL + '?utlinsttId=' + item['utlinsttId']
        history.push(url)
    }

    return (
        <div className="carditem03 type03" style={{cursor: 'pointer'}}>
            {
                commonContext.state.user?.info?.type === UsisType.INVESTOR &&
                <div className={`like_wrap${item.loginUsisLikeYn === CheckYn.YES ? ' active' : ''}`}
                     onClick={() => toggleLike && toggleLike(item.utlinsttId)}>
                    <div className="number">{item.prefCnt}</div>
                </div>
            }
            <div className="img_wrap" onClick={onClickCardItem} >
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
            <div className="content" onClick={onClickCardItem}>
                <p className="type">{item['enprDsncClsfNm']}</p>
                <p className="name">{item['bplcNm']}</p>
                <div className="worker_info">
                    <p className="worker_info_item">{item['invmStgNm']}</p>
                    <p className="worker_info_item">{item['invmAmtNm']}</p>
                </div>
                <p className="info"
                   dangerouslySetInnerHTML={{
                       __html: StringUtils.hasLength(item.enprInrdCon)
                           ? StringUtils.toBr(item.enprInrdCon) : ''
                   }}
                ></p>
            </div>
        </div>
    )
}

export default RecommendCompanyCard
