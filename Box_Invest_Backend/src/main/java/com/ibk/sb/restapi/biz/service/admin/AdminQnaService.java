package com.ibk.sb.restapi.biz.service.admin;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminQnaRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminQnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminQnaService {

    private final AdminQnaRepo repo;

    private final PlatformAlarmService platformAlarmService;

    private final MessageSource messageSource;

    /**
     * 운영자 포탈 - Q&A 페이징 리스트 조회
     * @param requestSearchVO
     * @return
     * @throws Exception
     */
    public PagingVO<QnaVO> searchQnaList(RequestSearchVO requestSearchVO) throws Exception {

        List<QnaVO> qaList = repo.selectQnaList(requestSearchVO);
        qaList = qaList == null ? new ArrayList<>() : qaList;

        return new PagingVO<>(requestSearchVO, qaList);
    }

    /**
     * 운영자 포탈 - Q&A 상세조회
     * @param qaId
     * @return
     * @throws Exception
     */
    public QnaVO searchQna(String qaId) throws Exception {

        QnaVO qnaVO = repo.selectQna(qaId);

        if(qnaVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        return qnaVO;
    }

    /**
     * 운영자 포탈 - Q&A 등록
     * @param qnaVO
     * @throws Exception
     */
    public boolean saveQna(QnaVO qnaVO) throws Exception {

        // 작성자 정보 세팅
        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        qnaVO.setAmnnUserId(user.getUsername());

        // 등록
        if(!StringUtils.hasLength(qnaVO.getInqrSbjcId())) {
            // QA 아이디 설정
            qnaVO.setInqrSbjcId(UUID.randomUUID().toString());
            qnaVO.setPgstCd(ComCode.QA_STANDBY.getCode());
            
            // 최초 작성 등록정보 세팅
            qnaVO.setRgsrUsisId(user.getUserGroupId());
            qnaVO.setRgsnUserId(user.getUsername());
            qnaVO.setRgsnUserNm(user.getUserNm()); // 작성자명
            
            // QA 등록
            repo.insertQna(qnaVO);
        }
        return true;
    }

    /**
     * 운영자 포탈 - Q&A 요청 취소
     * @param qnaVO
     * @return
     * @throws Exception
     */
    public boolean cancelQna(QnaVO qnaVO) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 기존 정보 조회
        QnaVO beforeData = repo.selectQna(qnaVO.getInqrSbjcId());

        // 기존 데이터 등록자 확인
        if(!(StringUtils.hasLength(beforeData.getRgsnUserId()) && user.getUsername().equals(beforeData.getRgsnUserId())
                && StringUtils.hasLength(beforeData.getRgsrUsisId()) && user.getUserGroupId().equals(beforeData.getRgsrUsisId()))) throw new BizException(StatusCode.COM0005);

        // 기존 데이터 상태코드 확인
        if(!beforeData.getPgstCd().equals(ComCode.QA_STANDBY.getCode())) throw new BizException(StatusCode.COM0005);

        // Qna 요청 취소
        return repo.cancelQna(qnaVO.getInqrSbjcId(), ComCode.QA_CANCEL.getCode(), user.getUsername()) > 0;
    }

    /**
     * 운영자 포탈 - Q&A 답변
     * @param requestBodyAdminVO
     * @return
     */
    public boolean replayQnaAnswer(RequestBodyAdminVO<AdminQnaVO> requestBodyAdminVO) throws Exception {

        // 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);

        // 기존 정보 조회
        QnaVO beforeData = repo.selectQna(requestBodyAdminVO.getParams().getInqrSbjcId());

        // 요청 Qna 진행상태코드가 대기상태가 아닌 경우 Exception
        if(!beforeData.getPgstCd().equals(ComCode.QA_STANDBY.getCode())) throw new BizException(StatusCode.COM0005);

        // Qna 완료 코드 설정
        requestBodyAdminVO.getParams().setPgstCd(ComCode.QA_COMPLETE.getCode());
        requestBodyAdminVO.getParams().setRplyMngrId(requestBodyAdminVO.getAdminUser().getAdminUserId());

        boolean result =  repo.updateQnaAnswer(requestBodyAdminVO.getParams());

        // 알림 전송
        if(result) {
            // 알림 아이디, 타이틀, base url 설정
            RequestAlarmVO requestAlarmVO = new RequestAlarmVO(AlarmCode.AlarmCodeEnum.QNA_ANSWER);

            // url 추가 설정
            requestAlarmVO.setPcLinkUrlCon(AlarmCode.AlarmLinkEnum.QNA_ANSWER_URL.getBaseUrl() + requestBodyAdminVO.getParams().getInqrSbjcId());

            // 알림 내용 설정
            requestAlarmVO.setAlrtCon(
                    messageSource.getMessage(
                            AlarmCode.AlarmCodeEnum.QNA_ANSWER.getTemplateId(),
                            new Object[]{beforeData.getInqrSbjcTtl()},
                            null
                    )
            );

            // 알림 전송
            InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, beforeData.getRgsrUsisId(), requestBodyAdminVO.getAdminUser());
            // 알림 전송 결과 저장
            platformAlarmService.saveInvestAlarmSendResult(alarmResult);
        }

        return result;
    }

}
