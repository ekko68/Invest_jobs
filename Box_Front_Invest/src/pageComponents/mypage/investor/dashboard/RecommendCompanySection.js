import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react'
import RecommendCompanyCardSlider from 'pageComponents/mypage/investor/dashboard/RecommendCompanySlider'
import NoResult from "components/common/NoResult";

import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels, CheckYn} from "modules/consts/BizConst";
import Api from "modules/consts/Api";
import {CommonContext} from "modules/contexts/common/CommomContext";

const RecommendCompanySection = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);
    const [list, setList] = useState([]);

    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = (list) => {
        setList(list);
    }

    const onClickUpdateLikeToggle = async (targetUsisId) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.company.likeToggleSave, {id: targetUsisId}));
            if (res?.data?.code == '200') {
                const _list = deepCopyByRecursion(list);

                const _targetIdx = _list.findIndex(e => e.utlinsttId === targetUsisId);

                const rsltLike = res.data.data.isPrefer;

                if (_targetIdx > -1) _list[_targetIdx] = {
                    ..._list[_targetIdx],
                    loginUsisLikeYn: rsltLike === CheckYn.YES ? CheckYn.YES : CheckYn.NO,
                    prefCnt: rsltLike === CheckYn.YES ? _list[_targetIdx].prefCnt + 1 : _list[_targetIdx].prefCnt - 1
                };

                setList(_list);

            } else {
                if(props.alertPopRef) exeFunc(props.alertPopRef, 'open', AlertLabels.askAdmin);
            }
        }, true, true)
    }

    return (
        <div className="section section02">
            <div className="section_header">
                <h3 className="section_title">추천 기업</h3>
            </div>
            <div className="recommend_invest_wrap">
                {
                    list?.length > 0
                        ? <RecommendCompanyCardSlider list={list} toggleLike={targetUsisId => onClickUpdateLikeToggle(targetUsisId)}/>
                        : <NoResult msg={'추천 기업 정보가 없습니다.'} style={{marginBottom: '150px'}}/>
                }
            </div>
        </div>
    )
});

export default RecommendCompanySection;
