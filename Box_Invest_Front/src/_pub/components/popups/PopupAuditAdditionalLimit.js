import React from 'react';
import PopupConfirm from "./PopupConfirm";
import PopupFooter from "./PopupFooter";
import Button from "../atomic/Button";
import PopupHeader from "./PopupHeader";

// 기술등급 제한 팝업
export const Temp1 = (props) => {

    return (
        <PopupConfirm>
            <div className="popup_content invest_judge">
                <div className="txt_inner">
                    <p className={'highlight_blue'}>
                        고객님의 IBK 내 유효한 기술등급이 존재하지 않습니다. <br/>
                        투자심사를 위해 가까운 영업점 방문해주시어 <br/>
                        기술등급을 신청해 주십시오.
                        {/*IBK기업은행의 기술투자 대상은 다음과 같습니다. <br/>*/}
                        {/*해당 고객님은 기술투자 대상조건 미달로 신청이 불가합니다. <br/>*/}
                    </p>

                    {/*<div className="text_box">*/}
                    {/*  <div className="text_box_title">*/}
                    {/*    <p>-TCB평가 기술등급 T-3 이상 기업</p>*/}
                    {/*  </div>*/}
                    {/*  <div className="text_box_title">*/}
                    {/*    <p>-TCB평가 기술등급 T-4 기업 중 12대 국가전략기술 해당 기업</p>*/}
                    {/*    <div className="text_box_list">*/}
                    {/*      <p>1. 반도체, 디스플레이</p>*/}
                    {/*      <p>2. 이차전지</p>*/}
                    {/*      <p>3. 차세대 원자력</p>*/}
                    {/*      <p>4. 모빌리티</p>*/}
                    {/*      <p>5. 우주항공, 해양</p>*/}
                    {/*      <p>6. 첨단 바이오</p>*/}
                    {/*      <p>7. 사이버 보안</p>*/}
                    {/*      <p>8. 수소</p>*/}
                    {/*      <p>9. AI</p>*/}
                    {/*      <p>10. 차세대 통신</p>*/}
                    {/*      <p>11. 첨단로봇</p>*/}
                    {/*      <p>12. 양자</p>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</div>*/}

                </div>
            </div>
            <PopupFooter className="popup_footer">
                <div className="btn_group">
                    <Button className={'button btn_blue'}>확인</Button>
                </div>
            </PopupFooter>
        </PopupConfirm>
    )
}

// 기간 제한 확인 팝업
export const Temp2 = (props) => {

    return (
        <PopupConfirm>
            <div className="popup_content invest_judge">
                <div className="txt_inner">
                    <p className={'highlight_full_lemon'}>
                        <span className='text'>투자 유치 신청을 이미 완료하셨습니다.</span>
                    </p>
                </div>
                <p className='title_text'>신청현황에서 진행상황을 확인할 수 있습니다.</p>
                <p className="highlight_blue">*최근 투자신청일로부터 1년 이후에 재신청이 가능합니다.</p>
                <div className="text_box">
                    <p>궁금한 사항은 아래로 문의하세요.</p>
                    <p>IBK 혁신투자부 02)729-7093</p>
                    <p>(평일) 오전 9시 ~ 오후 6시</p>
                </div>
            </div>
            <PopupFooter className="popup_footer">
                <div className="btn_group">
                    <Button className={'button btn_blue'}>신청현황 보기</Button>
                </div>
            </PopupFooter>
        </PopupConfirm>
    )
}

// 추천 영업점
export const Temp3 = (props) => {

    return (
        <div className="popup_wrap reco_popup">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container">
                <PopupHeader title={'추천 영업점 조회'} />
                <div className="popup_content">
                    <div className="cnt_wrap">
                        <div className="input_section">
                            <input placeholder={'영업점이름 또는 영업점 코드를 입력하세요.'}/>
                            <Button theme={colors.blue} type={'linear'}>조회</Button>
                        </div>

                        <div className="reco_search_wrap">
                            <div className="reco_search">
                                <ul className="reco_search_list scroll">
                                    <li className="reco_search_item">
                                        -을지 6가(0331)
                                    </li>
                                    <li className="reco_search_item">
                                        -을지로(0334)
                                    </li>
                                    <li className="reco_search_item">
                                        -기타등등(0335)
                                    </li>
                                </ul>
                            </div>

                            {/*<div className="reco_search">*/}
                            {/*  <div className="reco_search_nodata">*/}
                            {/*    일치하는 영업점이 없습니다.*/}
                            {/*  </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

// 추천 직원 조회
export const Temp4 = (props) => {

    return (
        <div className="popup_wrap reco_popup">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container">
                <PopupHeader title={'추천 직원 조회'} />
                <div className="popup_content">
                    <div className="cnt_wrap">
                        <div className="input_section">
                            <input placeholder={'추천 직원 이름을 입력하세요.'}/>
                            <Button theme={colors.blue} type={'linear'}>조회</Button>
                        </div>

                        <div className="reco_search_wrap">
                            <div className="reco_search">
                                <ul className="reco_search_list scroll">
                                    <li className="reco_search_item">
                                        -김영희(123123)
                                    </li>
                                    <li className="reco_search_item">
                                        -김민수(123456)
                                    </li>
                                    <li className="reco_search_item">
                                        -홍길동(123123)
                                    </li>
                                </ul>
                            </div>

                            {/*<div className="reco_search">*/}
                            {/*  <div className="reco_search_nodata">*/}
                            {/*    일치하는 직원이 없습니다.*/}
                            {/*  </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}