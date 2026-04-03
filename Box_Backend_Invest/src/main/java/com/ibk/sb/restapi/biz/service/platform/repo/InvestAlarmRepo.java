package com.ibk.sb.restapi.biz.service.platform.repo;

import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendHistoryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmTargetVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InvestAlarmRepo {

    // 알림 발송 이력 등록
    public Integer insertInvestAlarmSendHistory(InvestAlarmSendHistoryVO investAlarmSendHistoryVO);

    // 알림 수신 대상 등록
    public Integer insertInvestAlarmTarget(InvestAlarmTargetVO investAlarmTargetVO);

    // 알림 송신 결과 등록
    public Integer insertInvestAlarmSendResult(InvestAlarmSendResultVO investAlarmSendResultVO);
}
