/** @jsxImportSource @emotion/react */

import React, {useEffect, useState} from 'react'
import {corpIntroduceStyle} from 'assets/style/CompanyStyle'
import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";

const CompanyIntroduce = (props) => {
    const {vo} = props

    return (
        <div className="company_introduce card_inner" css={corpIntroduceStyle}>
            <div className="card_header">
                <div className="card_title ico_title">기업소개</div>
            </div>
            <div className="card_content">
                <div className="logo_wrap">
                    <div className="img_wrap">
                        {
                            StringUtils.hasLength(vo?.basicData?.logoImageUrl)
                                ? <img src={vo.basicData.logoImageUrl} alt={vo.basicData.bplcNm + ' 로고이미지'}/>
                                : <img src={require('assets/images/no_img.jpg').default} alt="이미지가 없습니다"/>
                        }
                    </div>
                    <div className="info_box">
                        <p className="name">{vo?.basicData?.bplcNm}</p>
                    </div>
                </div>
                <div className="introduce_wrap" dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo?.basicData?.enprInrdCon)}}/>
            </div>
            <ul className="tag_list">
                {
                    vo?.basicData?.cnrnFildList?.map((item, i) => (
                        <li className="tag_item" key={createKey()}>
                            #{item?.cnrnFildNm}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default CompanyIntroduce
