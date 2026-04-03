/** @jsxImportSource @emotion/react */

import Button from "components/atomic/Button";
import {colors} from "assets/style/style.config";
import {StringUtils} from "modules/utils/StringUtils";
import {CheckYn} from "modules/consts/BizConst";

const CommonBottomBannerCard = (props) => {
    const {data, idx} = props;

    const onClickUrl = () => {
        window.open(data['bnnrLnknUrl']);
    }

    const getImage = () => {
        if (!StringUtils.hasLength(data['imgUrl'])) {
            return <img src={'images/tmp/invest_list_card_no_image.png'} alt="이미지가 없습니다"/>
        } else {
            return <img src={data['imgUrl']} alt={data['bnnrPhrsCon']}/>
        }
    }

    return (
        <div className="bannerItem01">
            {
                StringUtils.hasLength(data['expuYn']) && data['expuYn'] === CheckYn.YES
                    ? <>
                        <div className="img_wrap">
                            {getImage()}
                        </div>
                        <div className="container">
                            <p className="content" dangerouslySetInnerHTML={{ __html: StringUtils.toBr(data['bnnrPhrsCon'])}} />
                            <Button theme={idx === 0 ? colors.black : colors.blue} onClick={() => onClickUrl()}>{StringUtils.hasLength(data['btnPhrsCon']) ? data['btnPhrsCon'] : "더보기"}</Button>
                        </div>
                    </>
                    : <div className="img_wrap">
                        <img src={'images/tmp/invest_list_card_no_image.png'} alt="이미지가 없습니다"/>
                    </div>
            }
        </div>
    )
}

export default CommonBottomBannerCard;