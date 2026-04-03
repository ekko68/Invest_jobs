import React, {forwardRef, useContext, useEffect, useRef, useState} from 'react';

import CommonAxios from "modules/utils/CommonAxios";
import {useHistory} from "react-router-dom";
import DateUtils from "modules/utils/DateUtils";
import {getConfig, getPostConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {StringUtils} from "modules/utils/StringUtils";
import NoResult from "components/common/NoResult";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";

const HeaderScrollAlarmPopup = forwardRef((props, ref) => {
    const loadYn = useRef(false);
    const moreYn = useRef(CheckYn.YES);
    const pageRef = useRef(0);
    const [display, setDisplay] = useState("none");
    const [list, setList] = useState([]);

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const loadAlarmList = async () => {
        loadYn.current = true;
        pageRef.current = pageRef.current + 1;

        const param = {
            page: pageRef.current,
            record: 8
        }

        const res = await CommonAxios(getConfig(Api.common.alarmInvestList, param), false);

        if(res && res.data.code === '200') {
            setList([...list.concat(res.data.data.list)]);
            moreYn.current = (StringUtils.hasLength(res.data.data?.isMoreYn)) ? res.data.data.isMoreYn : CheckYn.NO;
            commonContext.actions.setAlarmUnreadYn(res.data.data.unreadYn);
        }

        loadYn.current = false;
    }

    const handleAlarmScroll = async (event) => {
        const { scrollTop, scrollHeight, offsetHeight } = event.target;
        if((scrollTop + offsetHeight >= (scrollHeight - 10)) && loadYn.current === false && moreYn.current === CheckYn.YES) {
            loadYn.current = true;
            await commonContext.actions.callbackAfterSessionRefresh(loadAlarmList, true, true);
        }
    }

    const getAlarmTs = (item) => {
        let alarmTs = '';
        if(StringUtils.hasLength(item.alrtSndgTs)) {
            alarmTs = String(item.alrtSndgTs).trim().replace(/\D/gm, '');
        }
        return DateUtils.convertYyyyMmDdNormalDate(alarmTs);
    }

    const onClickAlarm = async (item) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const body = {
                id: item.alrtSndgNo
            }
            const res = await CommonAxios(getPostConfig(Api.common.alarmCheck, body));
            if(res && res.data.code === '200') {
                commonContext.actions.setAlarmUnreadYn(res.data.data.unreadYn);
            }
            if(StringUtils.hasLength(item.pcLinkUrlCon)) window.location.href = item.pcLinkUrlCon;
        }, true, true);
    }

    useEffect(() => {
        commonContext.actions.callbackAfterSessionRefresh(async () => {
            await loadAlarmList();
            setDisplay("block");
        }, true, true);
    }, []);

    /** 외부 클릭 모달 종료를 위한 설정 */

    const wrapRef = useRef();

    useEffect(() => {
        const handleClickOutside = e => {
            if (wrapRef?.current && !wrapRef.current.contains(e.target)) {
                if(props.setAlarmOpen) props.setAlarmOpen(false);
            }
        }
        // 일반적으로 'mousedown' 이벤트에 해당 모달 닫기 이벤트를 다는듯 하지만
        // 메인화면에서 메인배너 swiper의 mousedown 이벤트와 충돌하는 상황이 발생하여 click으로 설정함
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="modal_alarm" style={{display:display}} ref={wrapRef}>
            <div className="modal_alarm_header">지난 알림</div>
            <div className="modal_alarm_container scroll" onScroll={e => handleAlarmScroll(e)}>
                <ul className="modal_alarm_list">
                    {
                        list?.length > 0
                         ?   list?.map((item, index) => (
                                <li className={item.alrtRcvYn === CheckYn.YES ? "modal_alarm_item done" : "modal_alarm_item"} key={createKey()} onClick={() => onClickAlarm(item)}>
                                    <p className="content">{item.alrtTtlNm}</p>
                                    <p className="text">{item.alrtCon}</p>
                                    <p className="info">
                                        <span className="info_item">{getAlarmTs(item)}</span>
                                    </p>
                                </li>
                            ))
                        :   <NoResult msg={'등록된 투자박스 알림이 없습니다.'} style={{marginTop:'50px', marginBottom: '50px'}}/>
                    }
                </ul>
            </div>
        </div>
    )
});

export default HeaderScrollAlarmPopup;