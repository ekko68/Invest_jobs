import React, {useState, forwardRef, useImperativeHandle} from 'react'
import NoResult from "components/common/NoResult";
import RecommendInvestorSlider from 'pageComponents/mypage/company/dashboard/RecommendInvestorSlider'

const RecommendInvestorSection = forwardRef((props, ref) => {
    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = (list) => {
        setList(list);
    }

    return (
        <div className="section section02">
            <div className="section_header">
                <h3 className="section_title">추천 투자사</h3>
            </div>
            <div className="recommend_invest_wrap">
                {
                    list?.length > 0
                        ?   <RecommendInvestorSlider list={list}/>
                        :   <NoResult msg={'추천 투자사 정보가 없습니다.'} style={{marginBottom:'150px'}} />
                }
            </div>
        </div>
    )
});

export default RecommendInvestorSection;
