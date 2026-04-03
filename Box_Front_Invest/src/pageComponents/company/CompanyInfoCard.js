/** @jsxImportSource @emotion/react */
import React, {useContext} from "react";
import {useHistory} from 'react-router-dom'

import Flag from 'components/atomic/Flag'
import {cardItem03Style} from 'assets/style/ComponentStyle'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from "modules/utils/StringUtils";
import {createKey, randomEmptyLogoImageIdx} from "modules/utils/CommonUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CheckYn, UsisType} from "modules/consts/BizConst";

const CompanyInfoCard = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const companyInfo = props.companyInfo
    const getFlagIcon = () => {
        if (companyInfo['invmHopeYn'] === CheckYn.NO && companyInfo['rcmdEnprStupYn'] === CheckYn.NO) return <></>
        if (companyInfo['invmHopeYn'] === CheckYn.YES && companyInfo['rcmdEnprStupYn'] === CheckYn.NO)
            return <Flag text={'투자희망'} bg={'#093b78'} key={createKey()}/>
        if (companyInfo['invmHopeYn'] === CheckYn.NO && companyInfo['rcmdEnprStupYn'] === CheckYn.YES)
            return <Flag text={'추천기업'} bg={'#00baff'} key={createKey()}/>
        if (companyInfo['invmHopeYn'] === CheckYn.YES && companyInfo['rcmdEnprStupYn'] === CheckYn.YES) {
            return (
                <>
                    <Flag text={'투자희망'} bg={'#093b78'} key={createKey()}/>
                    <Flag text={'추천기업'} bg={'#00baff'} key={createKey()}/>
                </>
            )
        }
    }
    const onClickCompanyInfo = (companyInfo) => {
        const url = ROUTER_NAMES.COMPANY_DETAIL + '?utlinsttId=' + companyInfo['utlinsttId']
        history.push(url)
    }

    return (
        <div className="company_item" style={{cursor: 'pointer'}}>
            <div className="flag_wrap">{getFlagIcon()}</div>
            <div className="carditem03 type02" css={cardItem03Style}>
                {
                    commonContext.state.user?.info?.type === UsisType.INVESTOR &&
                    <div className={`like_wrap${companyInfo.loginUsisLikeYn === CheckYn.YES ? ' active' : ''}`}
                         onClick={() => props.toggleLike && props.toggleLike(companyInfo.utlinsttId)}>
                        <div className="number">{companyInfo.prefCnt}</div>
                    </div>
                }

                <div className="img_wrap" onClick={() => onClickCompanyInfo(companyInfo)}>
                    {
                        (StringUtils.hasLength(companyInfo?.logoImageUrl) && companyInfo?.defaultLogoYn === CheckYn.NO)
                            ? <img src={companyInfo['logoImageUrl']} alt={companyInfo['bplcNm'] + " 로고이미지"}/>
                            : <>
                                <p>{companyInfo.defaultLogoChar}</p>
                                {/*<img src={require(`assets/images/empty_${randomEmptyLogoImageIdx(companyInfo.key)}.png`).default} alt="이미지가 없습니다"/>*/}
                                <img src={require('assets/images/empty_' + randomEmptyLogoImageIdx(companyInfo.key) + '.png').default} alt="이미지가 없습니다"/>
                            </>
                    }
                </div>
                <div className="content" onClick={() => onClickCompanyInfo(companyInfo)}>
                    <p className="title">{companyInfo['bplcNm']}</p>
                    <p className="type">
                        {/*<span className="type_item">{companyInfo['addrAggr']}</span>*/}
                        {
                            StringUtils.hasLength(companyInfo.bsunDwarCd) && <span className="type_item">{companyInfo.bsunDwarNm}</span>
                        }
                        {
                            StringUtils.hasLength(companyInfo.yearCnt) && <span className="type_item">{companyInfo.yearCnt} 년차</span>
                        }
                    </p>
                    <p className="name">{companyInfo['btnm']}</p>
                    {/*<p className="info">{companyInfo['enprInrdCon']}</p>*/}
                    <p className="info" dangerouslySetInnerHTML={{__html: StringUtils.toBr(companyInfo['enprInrdCon'])}}/>
                </div>
            </div>
        </div>
    )
}
export default CompanyInfoCard
