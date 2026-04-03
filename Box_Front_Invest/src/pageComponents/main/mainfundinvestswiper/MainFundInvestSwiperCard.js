/** @jsxImportSource @emotion/react */

import {cardItem02Style} from 'assets/style/ComponentStyle'
import {useHistory} from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from "modules/utils/StringUtils";
import {useContext} from "react";
import {CommonContext} from "modules/contexts/common/CommomContext";

const MainFundInvestSwiperCard = (props) => {
    const {data} = props
    const commonContext = useContext(CommonContext);
    const history = useHistory()

    return (
        <div className="carditem02" css={cardItem02Style}>
            <div className="info_wrap">
                <p className="name">{data['invmCmpPtrnNm']}</p>
                <p className="title">{data['pageTtl']}</p>
                <p className="content">{data['pageCon']}</p>
                <button className='button button_link'
                        // onClick={() => commonContext.actions.callbackAfterOnlyLoginCheck(() => history.push(ROUTER_NAMES.EVENT + '?invmCmpExusPageId=' + data['invmCmpExusPageId']))}>
                        onClick={() => {
                            history.push(ROUTER_NAMES.EVENT + '?invmCmpExusPageId=' + data['invmCmpExusPageId']);
                        }}>
                    바로가기
                </button>
            </div>
            <div className="img_section">
                <div className="img_wrap">{
                    StringUtils.hasLength(data?.imgUrl)
                        ? <img src={data['imgUrl']} alt={data['pageTtl']}/>
                        : <img src={require('assets/images/no_img.jpg').default} alt="이미지가 없습니다"/>
                }</div>
            </div>
        </div>
    )
}
export default MainFundInvestSwiperCard
