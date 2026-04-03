/** @jsxImportSource @emotion/react */
import {cardItem04Style} from 'assets/style/ComponentStyle'
import React from 'react';
import {useHistory} from 'react-router-dom'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from "modules/utils/StringUtils";
import {createKey, randomEmptyLogoImageIdx} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";

const InvestListCard = (props) => {
    const {data} = props;
    const history = useHistory();

    return (
        <div className="carditem04" css={cardItem04Style}
             onClick={() => history.push(ROUTER_NAMES.INVEST_DETAIL + '?utlinsttId=' + data.utlinsttId)}>
            <div className="img_wrap">
                {
                    (StringUtils.hasLength(data?.logoImageUrl) && data?.defaultLogoYn === CheckYn.NO)
                        ? <img src={data.logoImageUrl} alt={data.bplcNm + ' 로고이미지'}/>
                        : <>
                            <p>{data.defaultLogoChar}</p>
                            {/*<img src={require(`assets/images/empty_${randomEmptyLogoImageIdx(data.key)}.png`).default} alt="이미지가 없습니다"/>*/}
                            <img src={require('assets/images/empty_' + randomEmptyLogoImageIdx(data.key) + '.png').default} alt="이미지가 없습니다"/>
                        </>
                }
            </div>
            <div className="cont_wrap">
                <p className="title">{data?.bplcNm}</p>
                <p className="content">{data?.enprInrdCon}</p>
                <ul className="tag_list">{
                    data?.cnrnFildList?.map((item, i) => (
                        <li className="tag_item" key={createKey()}>
                            {item}
                        </li>
                    ))
                }</ul>
            </div>
        </div>
    )
}

export default InvestListCard
