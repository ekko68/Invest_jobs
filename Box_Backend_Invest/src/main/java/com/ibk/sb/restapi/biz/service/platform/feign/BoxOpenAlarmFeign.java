package com.ibk.sb.restapi.biz.service.platform.feign;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveAlarmCountVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestCheckAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxMsgResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.RequestAlarmResponseVO;

@FeignClient(
        name = "box-open-api-cm-alarm", // deveye 저장소 잔여 정보와 충돌하여 alarm -> cm-alarm 수정
        url = "${feign.box-open-api.url}",
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenAlarmFeign {

    /**
     * BOX API 수신 알림 목록 조회
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/cms051/alrtRcvCtlgInq")
    BoxListResponseVO<ReceiveAlarmVO> getInvestBoxReceiveAlarmList(@RequestBody Map<String, String> body);

    /**
     * BOX API 수신 알림 건수 조회
     * idmbId : 개인회원 ID | usisId : 이용기관 ID
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/cms051/alrtRcvNbiInq")
    BoxListResponseVO<ReceiveAlarmCountVO> getAlarmCount(@RequestBody Map<String, String> body);

    /**
     * BOX API 알림 메시지 발송
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/cms053/alrtSndgReg")
    RequestAlarmResponseVO postSendAlarm(@RequestBody RequestAlarmVO body);

    /**
     * BOX API 알림 메시지 수신 완료
     * @param body
     * @return
     */
    @PostMapping("/api/cm/v1/cms052/alrtRcvFnsgPscnUpd")
    BoxMsgResponseVO postCheckAlarm(@RequestBody RequestCheckAlarmVO body);

//    /**
//     * BOX API ibkbox이메일발송
//     * @param body
//     * @return
//     */
//    @PostMapping(value = "/api/cm/v1/cms011/emlSndgInq")
//    BoxListResponseVO<ReceiveEmailVO> emlSndgInq(@RequestBody RequestEmailVO body);
//
//    /**
//     * BOX API SMS발송
//     * @param body
//     * @return
//     */
//    @PostMapping(value = "/api/cm/v1/cps025/posRmteStlmAcccSms")
//    BoxListResponseVO<ReceiveSmsVO> sndgSms(@RequestBody RequestSmsVO body);

    /**
     * 메일 전송 (계정계)
     *
     * @param body
     * @return
     */
    @PostMapping(
            value = "/api/ibk/v1/ibkbox/sndgEml",
            headers = {"appKey=${feign.ibk-api.key}", "appSecret=${feign.ibk-api.secret}"})
    BoxListResponseVO<ReceiveEmailVO> sendPlatformEmail(@RequestBody RequestEmailVO body);

    /**
     * SMS 전송 (계정계)
     *
     * @param body
     * @return
     */
    @PostMapping(
            value = "/api/ibk/v1/ibkbox/sndgSms",
            headers = {"appKey=${feign.ibk-api.key}", "appSecret=${feign.ibk-api.secret}"})
    BoxListResponseVO<ReceiveSmsVO> sendPlatformSms(@RequestBody RequestSmsVO body);


}
