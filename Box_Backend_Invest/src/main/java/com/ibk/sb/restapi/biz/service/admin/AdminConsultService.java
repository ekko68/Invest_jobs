package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminConsultRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminConsultService {

    private final AdminConsultRepo repo;

    private final MessageSource messageSource;

    private final PlatformAlarmService platformAlarmService;

    /**
     * 운영자 포탈 - 컨설팅 목록 조회
     * @return
     */
    public PagingVO<ConsultingVO> searchConsultList(RequestSearchVO params) throws Exception {
        List<ConsultingVO> list = repo.selectConsultList(params);
        list = list == null ? new ArrayList<>() : list;
        return new PagingVO<>(params, list);
    }

    /**
     * 운영자 포탈 - 컨설팅 상세 조회
     * @param cnsgReqsId
     * @return
     */
    public ConsultingVO findConsultingDetail(String cnsgReqsId) throws Exception {
        ConsultingVO detail = repo.selectConsultDetail(cnsgReqsId);
        if(detail == null) {
            throw new BizException(StatusCode.MNB0003);
        }
        return detail;
    }

    /**
     * 운영자 포탈 - 컨설팅 답변
     * @param requestBodyAdminVO
     * @return
     */
    public boolean replyConsultingAnswer(RequestBodyAdminVO<ConsultingVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);
        requestBodyAdminVO.getParams().setCnsgSttsCd(ComCode.CONSULT_COMPLETE.getCode());
        requestBodyAdminVO.getParams().setRplyMngrId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        boolean result = repo.udpateConsultReplayAnswer(requestBodyAdminVO.getParams());

        // 알림전송
        if(result) {
            // 컨설팅 정보 조회
            ConsultingVO consultingVO = repo.selectConsultDetail(requestBodyAdminVO.getParams().getCnsgReqsId());

            // 알림 아이디, 타이틀 설정
            RequestAlarmVO requestAlarmVO = new RequestAlarmVO(AlarmCode.AlarmCodeEnum.CONSULT_ANSWER);

            // url 설정
            requestAlarmVO.setPcLinkUrlCon(AlarmCode.AlarmLinkEnum.CONSULT_ANSWER_URL.getBaseUrl() + consultingVO.getCnsgReqsId());

            // 알림 내용 설정
            requestAlarmVO.setAlrtCon(
                    messageSource.getMessage(
                            AlarmCode.AlarmCodeEnum.CONSULT_ANSWER.getTemplateId(),
                            new Object[]{consultingVO.getCnsgReqsTtl()},
                            null
                    )
            );

            // 알림 전송
            InvestAlarmSendResultVO alarmResult =  platformAlarmService.sendInvestAlarm(requestAlarmVO, consultingVO.getReqsInttId(), requestBodyAdminVO.getAdminUser());
            // 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResult);
        }

        return result;
    }

}
