/** @jsxImportSource @emotion/react */

import React, {useEffect} from 'react'

import {colors} from 'assets/style/style.config'
import {teamInfoStyle} from 'assets/style/CompanyStyle'

import Badge from 'components/atomic/Badge'
import NoResult from "components/common/NoResult";

import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";


const TeamInfo = (props) => {
    const {vo} = props

    useEffect(() => {
    }, [])

    return (
        <div className="team_info card_inner" css={teamInfoStyle}>
            <div className="card_header">
                <div className="card_title ico_title">팀원정보</div>
                <Badge theme={colors.blue}>{vo.memberCnt}</Badge>
            </div>
            <div className="team_info_wrap scroll_lightgrey">
                <div className="team_info_list ">{
                    vo?.memberList?.length > 0
                        ? vo?.memberList?.map((item, i) => (
                            <div className="team_info_item" key={createKey()}>
                                <div className="team_user_head">
                                    <div className="img_wrap">
                                        {
                                            StringUtils.hasLength(item?.imgUrl)
                                                ? <img src={item['imgUrl']} alt={'팀원이미지' + i}/>
                                                : <img src='/images/no_img_user.png' alt='이미지없음'/>
                                        }
                                    </div>
                                    <div className="user_info">
                                        <p className="name">{item['tmmbNm']}</p>
                                        <p className="position">{item['tmmbJbcl']}</p>
                                    </div>
                                </div>
                                <div className="user_info_sub">{item['crrCon']}</div>
                            </div>
                        ))
                        // : <NoResult msg={'등록된 팀원정보가 없습니다.'} style={{marginTop: '40px'}}/>
                        : <NoResult msg={'등록된 팀원정보가 없습니다.'} style={{marginTop: '30px', marginBottom: '40px'}}/>
                }</div>
            </div>
        </div>
    )
}

export default TeamInfo
