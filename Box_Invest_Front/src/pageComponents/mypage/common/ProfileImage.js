import React, {useContext} from "react";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";

const ProfileImage = (props) => {

    const commonContext = useContext(CommonContext);

    return (
        <div className="logo_wrap">
            <div className="img_wrap">
                {
                    StringUtils.hasLength(commonContext.state.user.info?.groupLogoImgUrl)
                        ?   <div className="img_wrap">
                                <img src={commonContext.state.user.info.groupLogoImgUrl} alt="기업로고" />
                            </div>
                        :   <div className="img_wrap">
                                <img src={'images/tmp/invest_list_card_no_image.png'} alt="이미지없음" />
                            </div>
                }
            </div>
            <p className="name">{StringUtils.hasLength(commonContext.state.user.info?.name) ? commonContext.state.user.info.name : ''}</p>
        </div>
    )
}

export default ProfileImage;