import React from "react";

const NdaProcessImage = () => {

    return (
        <div className="section section01">
            <div className="card_header">
                <div className="ico_title">NDA 체결 진행 절차</div>
            </div>
            <div className="nda_progress_wrap">
                {/*progress_list start*/}
                <ul className="progress_list_type02">
                    <li className="progress_item ">
                        <div className="progress_item_inner">
                            <p className="text01">NDA 서명</p>
                            <p className="text02">
                                NDA 서명 버튼을 눌러 <br />
                                NDA 문서를 생성하고 <br />
                                서명을 합니다.
                            </p>
                        </div>
                    </li>
                    <li className="progress_item ">
                        <div className="progress_item_inner">
                            <p className="text01">NDA 서명 요청</p>
                            <p className="text02">
                                아래 양식을 작성하여 <br />
                                계약 당사자에게 계약서 검토 및 <br />
                                서명을 요청합니다.
                            </p>
                        </div>
                    </li>
                    <li className="progress_item">
                        <div className="progress_item_inner">
                            <p className="text01">NDA 체결</p>
                            <p className="text02">
                                요청을 받은 당사자는 <br />
                                요청메시지의 서명 버튼을 눌러 <br />
                                계약서를 검토 후 서명하고 요청메시지의 <br />
                                수락 버튼을 눌러 체결을 완료합니다.
                            </p>
                        </div>
                    </li>
                </ul>
                {/*progress_list end*/}
            </div>
        </div>
    )
}

export default NdaProcessImage;