package com.ibk.sb.restapi.biz.service.message;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.message.vo.RequestBizAskMessageVO;
import com.ibk.sb.restapi.biz.service.message.repo.MessageRepo;
import com.ibk.sb.restapi.biz.service.message.vo.*;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.InvestAlarmSendResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
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
public class MessageService {

    private final MessageRepo messageRepo;

    private final InvestAuditService investAuditService;

    private final PlatformAccountService platformAccountService;

    private final PlatformAlarmService platformAlarmService;

    private final MessageSource messageSource;

    private final VentureCapitalService ventureCapitalService;

    /**
     * 최근 메시지 리스트 조회
     * @param
     * @return
     * @throws Exception
     */
    public List<MessageSummaryVO> searchRecentMessageList() throws Exception {

        RequestMessageVO requestVO = new RequestMessageVO();

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        requestVO.setUtlinsttId(user.getUserGroupId());

        // 수신, 발신 포함 최근 20개 리스트 조회
        requestVO.setPage(1);
        requestVO.setRecord(20);
        requestVO.setPageSize(1);
        requestVO.setListType(null); // 수신 + 발신

        List<MessageSummaryVO> result = messageRepo.selectMessageList(requestVO);

        return result == null ? new ArrayList<>() : result;
    }

    /**
     * 수신 메시지 목록 조회
     * 읽지 않음 상태 및 카운트 뱃지 존재
     * 메인 - 댓글 형식 리스트
     * @return
     */
    public BadgePagingVO<MessageSummaryVO> searchReceiveMessageList(RequestMessageVO requestMessageVO) throws Exception {

        // 로그인 유저 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        requestMessageVO.setUtlinsttId(user.getUserGroupId());

        // 리스트 조회
        requestMessageVO.setListType(IvtCode.TransmitTypeEnum.RECEIVE.name());

        // 답글, 부모글 구분 없이 수신, 발신 기준으로만 구분 (2023.06)
        List<MessageSummaryVO> rcvMsgList = messageRepo.selectMessageList(requestMessageVO);
        rcvMsgList = rcvMsgList == null ? new ArrayList<>() : rcvMsgList;

        // 읽지 않은 수신 메시지 카운트 조회
        Integer unreadCnt = messageRepo.selectUnreadReceiveMessageCount(user.getUserGroupId(), null);

        // 페이징 리턴
        return new BadgePagingVO<>(requestMessageVO, rcvMsgList, unreadCnt == null ? 0 : unreadCnt);
    }

    /**
     * 발신 메시지 목록 조회
     * @param requestMessageVO
     * @return
     * @throws Exception
     */
    public PagingVO<MessageSummaryVO> searchSendMessageList(RequestMessageVO requestMessageVO) throws Exception {

        // 로그인 유저정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        requestMessageVO.setUtlinsttId(user.getUserGroupId());

        // 리스트 조회
        // 답글, 부모글 구분 없이 수신, 발신 기준으로만 구분 (2023.06)
        requestMessageVO.setListType(IvtCode.TransmitTypeEnum.SEND.name());
//        List<MessageSummaryVO> sendMsgList = searchParentAndChildMessageList(requestMessageVO);
        List<MessageSummaryVO> sendMsgList = messageRepo.selectMessageList(requestMessageVO);
        sendMsgList = sendMsgList == null ? new ArrayList<>() : sendMsgList;

        // 발신인명 세팅
        // 목록 조회 시간을 줄이기 위해 테이블에 스냅샷 컬럼을 추가
//        sendMsgList = setMessageSummaryCompanyInfo(sendMsgList);

        // 페이징 리턴
        return new PagingVO<>(requestMessageVO, sendMsgList);
    }

    /**
     * 읽지 않은 수신 메시지 카운트
     * @param auditId
     * @return
     * @throws Exception
     */
    public int searchUnreadReceiveMessageCnt(String auditId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자심사 아이디가 있을 경우 -> 투자심사 관련 읽지않은 메시지 카운트
        // auditId가 null일 경우 전체 수신 메시지 중 읽지 않은 메시지 카운트
        Integer result = messageRepo.selectUnreadReceiveMessageCount(user.getUserGroupId(), auditId);

        return result == null ? 0 : result;
    }

    /**
     * 로그인 정보 기준 메시지 조회
     * @param messageId
     * @return
     * @throws Exception
     */
    public MessageVO searchMessageWithLoginInfo(String messageId) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 메시지 정보 조회
        MessageVO messageVO = messageRepo.selectMessage(messageId);

        if(messageVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 메시지 조회 아이디 체크
        if(!(StringUtils.hasLength(messageVO.getDsmsInttId()) && messageVO.getDsmsInttId().equals(user.getUserGroupId()))
                && !(StringUtils.hasLength(messageVO.getRcvInttId()) && messageVO.getRcvInttId().equals(user.getUserGroupId()))) {
            throw new BizException(StatusCode.COM0005);
        }

        // 수신메시지 + 읽지 않은 상태일 경우 메시지 읽음 처리
        if(messageVO.getRcvInttId().equals(user.getUserGroupId()) && messageVO.getCnfaYn().equals(IvtCode.YnTypeEnum.N.name())) {
            messageRepo.updateMessageRead(messageVO.getMsgId(), user.getUsername());
        }

        return searchMessage(messageVO);
    }

    /**
     * 사업자 번호 기준 메시지 조회
     * @param messageId
     * @param bizrno
     * @return
     * @throws Exception
     */
    public MessageVO searchMessageWithBizNum(String messageId, String bizrno) throws Exception {

        // 사업자 번호 기준 이용기관 정보 조회
        if(!StringUtils.hasLength(bizrno)) throw new BizException(StatusCode.COM0005);
        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyByBizNum(bizrno);
        if(mainCompanyVO == null) throw new BizException(StatusCode.COM9998);

        // 메시지 정보 조회
        MessageVO messageVO = messageRepo.selectMessage(messageId);

        if(messageVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 메시지 조회 아이디 체크
        if(!(StringUtils.hasLength(messageVO.getDsmsInttId()) && messageVO.getDsmsInttId().equals(mainCompanyVO.getUtlinsttId()))
                && !(StringUtils.hasLength(messageVO.getRcvInttId()) && messageVO.getRcvInttId().equals(mainCompanyVO.getUtlinsttId()))) {
            throw new BizException(StatusCode.COM0005);
        }

        // 수신메시지 + 읽지 않은 상태일 경우 메시지 읽음 처리
        if(messageVO.getRcvInttId().equals(mainCompanyVO.getUtlinsttId()) && messageVO.getCnfaYn().equals(IvtCode.YnTypeEnum.N.name())) {
            messageRepo.updateMessageRead(messageVO.getMsgId(), mainCompanyVO.getUtlinsttId());
        }

        return searchMessage(messageVO);
    }


    /**
     * 메시지 상세 조회
     * @param messageVO
     * @return
     * @throws Exception
     */
    public MessageVO searchMessage(MessageVO messageVO) throws Exception {

        // 발신인명 세팅 -> 스냅샷으로 처리
//        MainUserVO rgsnUser = platformAccountService.searchMainUser(messageVO.getRgsnUserId(), null);
//        if(rgsnUser != null) {
//            messageVO.setRgsnUserNm(rgsnUser.getUserNm());
//        } else {
//            messageVO.setRgsnUserNm("");
//        }

        // 첨부파일 리스트 세팅
        List<MessageFileVO> fileList = messageRepo.selectMessageFileList(messageVO.getMsgId());
        messageVO.setFileList(fileList == null ? new ArrayList<>() : fileList);

        // 메시지 타입이 투자심사 메시지인 경우 답변가능여부 분기처리 -> 투자심사가 취소, 완료되지 않은 경우만 답변 가능
        messageVO.setSendReplyYn(IvtCode.YnTypeEnum.Y.name());
        if(messageVO.getMsgPtrnCd().equals(ComCode.MESSAGE_AUDIT.getCode())) {
            List<InvestAuditStageVO> stageList = investAuditService.searchAuditProgress(messageVO.getInvmExntRqstId());
            if(stageList != null && stageList.size() > 0) {
                String stageCode = stageList.get(stageList.size() - 1).getInvmExntPgsgCd();
                if(stageCode.equals(ComCode.AUDIT_CANCEL.getCode()) || stageCode.equals(ComCode.AUDIT_EXPIRED.getCode()) || stageCode.equals(ComCode.AUDIT_COMPLETE.getCode())) {
                    messageVO.setSendReplyYn(IvtCode.YnTypeEnum.N.name());
                }
            } else {
                throw new BizException(StatusCode.COM0001);
            }
        }

        return messageVO;
    }


    /**
     * 메시지 전체 읽음 요청
     *
     * notice : 최초 부모 메시지 기준으로 발신, 수신 메시지 리스트 조회 구분 변경에 따른 전체 확인 로직 수정
     * -> 수신메시지 목록의 경우 부모메시지의 수신이 사용자 이용기관이며 + 대상 메시지 수신 이용기관이 사용자 이용기관
     * -> 발신메시지 목록의 경우 부모메시지의 발신이 사용자 이용기관이며 + 대상 메시지 수신 이용기관이 사용자 이용기관
     *
     * @todo : 우선 컨트롤러에서 파라미터 처리를 통해 작업 및 변경 로직 검수 후, 이 방식대로 가는 것으로 결정될 경우
     * -> 컨트롤러에서 파라미터를 받는 것이 아닌 컨트롤러 자체를 분리처리하고 api 추가 문서 제출
     */
    public void saveCompanyMessageReadAll(IvtCode.TransmitTypeEnum listTypeEnum) throws Exception {
        
        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        // 수신 메시지 전체 읽음 처리
//        messageRepo.updateMessageReadAll(user.getUserGroupId(), user.getUsername());
        messageRepo.updateMessageReadAllSeparateByListType(new RequestMessageReadAllVO(
                user.getUserGroupId(), user.getUsername(), listTypeEnum != null ? listTypeEnum.name() : "")
        );
    }

    /**
     * 메시지 답변 서비스 (투자박스 메시지함에는 직접적인 메시지 송신과 관련된 기능이 답변만 있음)
     * -> 메시지 메뉴에서 메시지 답변을 하는 경우
     * -> 투자심사, 사업문의 등 다양한 타입에 대해 답변이 달릴 수 있기 때문에 분기처리
     * @param messageVO
     * @throws Exception
     */
    public void replyMessage(MessageVO messageVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 부모 메시지 유효성 검증
        if(!StringUtils.hasLength(messageVO.getPrnsMsgId())) {
            throw new BizException(StatusCode.COM0005);
        }

        MessageVO parentMsg = messageRepo.selectMessage(messageVO.getPrnsMsgId());

        if(parentMsg == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 기업아이디 체크
        if(!user.getUserGroupId().equals(parentMsg.getRcvInttId()) && !user.getUserGroupId().equals(parentMsg.getDsmsInttId())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 설정한 부모 메시지 아이디가 답변 메시지일 경우 부모 메시지 아이디 재설정
        if(StringUtils.hasLength(parentMsg.getPrnsMsgId())) {
            messageVO.setPrnsMsgId(parentMsg.getPrnsMsgId());
        }

        // 부모 메시지 기준 답변할 메시지 타입에 따른 메서드 호출
        // 투자심사문의 답변인 경우
        if(parentMsg.getMsgPtrnCd().equals(ComCode.MESSAGE_AUDIT.getCode())) {
            // 부모메시지 기준으로 투자심사 아이디 재설정
            messageVO.setInvmExntRqstId(parentMsg.getInvmExntRqstId());
            // 투자심사문의 답변 메시지 등록
            sendAuditMessage(messageVO, IvtCode.YnTypeEnum.Y, ComCode.MESSAGE_AUDIT, IvtCode.YnTypeEnum.Y);
        }
        // 사업문의 답변인 경우
        else if(parentMsg.getMsgPtrnCd().equals(ComCode.MESSAGE_INQUIRY.getCode())) {
            // 수신자 아이디 세팅
            if(user.getUserGroupId().equals(parentMsg.getRcvInttId())) {
                messageVO.setRcvInttId(parentMsg.getDsmsInttId());
            } else {
                messageVO.setRcvInttId(parentMsg.getRcvInttId());
            }
            // 답변 메시지 등록
            sendMessage(messageVO, IvtCode.YnTypeEnum.Y, ComCode.MESSAGE_INQUIRY, IvtCode.YnTypeEnum.Y);
        }
        else {
            throw new BizException(StatusCode.COM0005);
        }
    }

    /**
     * 메시지 전송
     * @param messageVO
     * @param replyYnEnum 답변 등록 여부
     * @param msgType
     * @param alarmYnEnum 알림 전송 여부
     * @return
     * @throws Exception
     */
    public MessageVO sendMessage(MessageVO messageVO, IvtCode.YnTypeEnum replyYnEnum, ComCode msgType, IvtCode.YnTypeEnum alarmYnEnum) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 수신 기업 아이디 유효성 조회
        if(!StringUtils.hasLength(messageVO.getRcvInttId())) {
            throw new BizException(StatusCode.COM0005);
        }
        // 현시점 유효한 아이디인지 메인박스 기준 재조회
        if(platformAccountService.searchMainCompanyById(messageVO.getRcvInttId()) == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 발신자 정보 세팅
        messageVO.setDsmsInttId(user.getUserGroupId());
        messageVO.setRgsnUserId(user.getUsername());
        messageVO.setAmnnUserId(user.getUsername());

        // 23.03.30 추가 : 등록자명 스냅샷 추가
        messageVO.setRgsnUserNm(user.getUserNm());

        // 답변 메시지 체크
        // 답변 메시지가 아닌 경우
        // 답변 메시지인 경우 -> 유효성 체크 등은 앞단에서 이뤄진 후에 들어옴
        if(replyYnEnum == IvtCode.YnTypeEnum.N) {
            messageVO.setPrnsMsgId(null);
        }

        // 메시지 타입
        messageVO.setMsgPtrnCd(msgType.getCode());

        // 메시지 등록
        messageVO.setMsgId(UUID.randomUUID().toString());
        messageRepo.insertMessage(messageVO);

        // 메시지 첨부파일 등록
        if(messageVO.getFileList() != null && messageVO.getFileList().size() > 0) {
            for(MessageFileVO item : messageVO.getFileList()) {
                // 아이디 정보 세팅
                item.setMsgId(messageVO.getMsgId());
                item.setRgsnUserId(user.getUsername());
                // 매핑정보 등록
                messageRepo.insertMessageFileMapping(item);
            }
        }

        // 수신 이용기관 알림 전송
        if(alarmYnEnum == IvtCode.YnTypeEnum.Y) {
            // 사업문의 관련
            if(msgType == ComCode.MESSAGE_INQUIRY) {
                if(replyYnEnum == IvtCode.YnTypeEnum.N) {
                    requestMessageAlarm(messageVO.getMsgId(), AlarmCode.AlarmCodeEnum.BIZ_INQUIRY);
                } else {
                    requestMessageAlarm(messageVO.getMsgId(), AlarmCode.AlarmCodeEnum.BIZ_INQUIRY_ANSWER);
                }
            }
        }

        return messageVO;
    }


    /** 투자심사 요청에 종속 **/

    /**
     * 투자심사 메시지 목록 조회 (페이징) With 로그인 정보
     * @param requestAuditMessageVO
     * @return
     * @throws Exception
     */
    public BadgePagingVO<MessageSummaryVO> searchAuditMessageListWithLoginInfo(RequestAuditMessageVO requestAuditMessageVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return searchAuditMessageList(requestAuditMessageVO, user.getUserGroupId());
    }

    /**
     * 투자심사 메시지 목록 조회 (페이징) With 사업자번호
     * @param requestAuditMessageVO
     * @return
     * @throws Exception
     */
    public BadgePagingVO<MessageSummaryVO> searchAuditMessageListWithBiznum(RequestAuditMessageVO requestAuditMessageVO) throws Exception {

        // 사업자 번호 기준 이용기관 정보 조회
        if(!StringUtils.hasLength(requestAuditMessageVO.getBizrno())) throw new BizException(StatusCode.COM0005);
        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyByBizNum(requestAuditMessageVO.getBizrno());
        if(mainCompanyVO == null) throw new BizException(StatusCode.COM9998);

        return searchAuditMessageList(requestAuditMessageVO, mainCompanyVO.getUtlinsttId());
    }

    /**
     * 투자심사 메시지 목록 조회 (페이징)
     * @param  requestAuditMessageVO
     * @throws Exception
     */
    public BadgePagingVO<MessageSummaryVO> searchAuditMessageList(RequestAuditMessageVO requestAuditMessageVO, String userGroupId) throws Exception {

        if(!StringUtils.hasLength(requestAuditMessageVO.getInvmExntRqstId())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 투자심사 메시지 목록 조회
        List<MessageSummaryVO> messageList = messageRepo.selectAuditMessageList(requestAuditMessageVO);
        messageList = messageList == null ? new ArrayList<>() : messageList;

        // 발신인명 리스트 세팅
//        messageList = setMessageSummaryCompanyInfo(messageList);

        // 수신 메시지 중 읽지 않은 메시지 카운트
        int unreadCount = messageRepo.selectUnreadReceiveMessageCount(userGroupId, requestAuditMessageVO.getInvmExntRqstId());

        return new BadgePagingVO<>(requestAuditMessageVO, messageList, unreadCount);
    }

    /**
     * 투자심사 메시지 보내기
     * @throws Exception
     */
    public MessageVO sendAuditMessage(MessageVO auditMessageVO, IvtCode.YnTypeEnum replyYnEnum, ComCode msgType, IvtCode.YnTypeEnum alarmYnEnum) throws Exception {

        // 로그인 유저 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 투자심사 아이디 유효성 체크
        if(!StringUtils.hasLength(auditMessageVO.getInvmExntRqstId())) {
            throw new BizException(StatusCode.COM0005);
        }

        InvestAuditVO auditVO = investAuditService.searchInvestAuditBasic(auditMessageVO.getInvmExntRqstId());
        if(auditVO == null) {
            throw new BizException(StatusCode.MNB0003);
        }

        // 투자심사 상태가 종료(심사완료, 요청취소, 기간만료) 상태일 경우 메시지 전달 기능 불가
        if(auditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_COMPLETE.getCode())
        || auditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_EXPIRED.getCode())
        || auditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_CANCEL.getCode())) {
            throw new BizException(StatusCode.COM0005);
        }

        // 송신자 아이디 세팅
        if(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
            auditMessageVO.setRcvInttId(auditVO.getInvmCmpId());
        } else {
            auditMessageVO.setRcvInttId(auditVO.getRqstEnprId());
        }

        // 발신자 ID 세팅
        auditMessageVO.setDsmsInttId(user.getUserGroupId());
        auditMessageVO.setRgsnUserId(user.getUsername());
        auditMessageVO.setAmnnUserId(user.getUsername());

        // 23.03.30 추가 : 등록자명 스냅샷 추가
        auditMessageVO.setRgsnUserNm(user.getUserNm());

        // 답변 메시지 유무 체크
        // 답변 메시지인 경우 -> 유효성 체크 등은 앞단에서 이뤄진 후에 들어옴
        if(replyYnEnum == IvtCode.YnTypeEnum.N) {
            auditMessageVO.setPrnsMsgId(null);
        }

        // 메시지타입 세팅
        auditMessageVO.setMsgPtrnCd(msgType.getCode());

        // 메시지 등록
        auditMessageVO.setMsgId(UUID.randomUUID().toString());
        messageRepo.insertMessage(auditMessageVO);

        // 메시지 첨부파일 등록
        if(auditMessageVO.getFileList() != null && auditMessageVO.getFileList().size() > 0) {
            for(MessageFileVO item : auditMessageVO.getFileList()) {
                item.setMsgId(auditMessageVO.getMsgId());
                item.setRgsnUserId(user.getUsername());
                // 메시지 - 파일 매핑 저장
                messageRepo.insertMessageFileMapping(item);

                // 파일 권한 세팅
//                fileService.setFileDownloadAuth(item.getFileMngmNo(), auditVO.getRqstUtlinsttId(), auditVO.getInvmExntUtlinsttId(), null);
            }
        }

        // 메시지 투자심사 매핑 등록
        messageRepo.insertAuditMessageMapping(auditMessageVO.getInvmExntRqstId(), auditMessageVO.getMsgId(), user.getUsername());

        // 수신 이용기관 알림 전송
        if(alarmYnEnum == IvtCode.YnTypeEnum.Y) {
            requestMessageAlarm(auditMessageVO.getMsgId(), AlarmCode.AlarmCodeEnum.AUDIT_MESSAGE_RECEIVE);
        }

        // 투자심사 제안/요청 처리시 아이디 값 매핑을 위함
        return auditMessageVO;
    }

    /**========================== 사업문의 ==========================**/

    /**
     * 사업문의 요청
     * @param requestBizAskMessageVO
     * @throws Exception
     */
    public void saveBizAsk(RequestBizAskMessageVO requestBizAskMessageVO) throws Exception {

        // 서비스간 순환참조 발생하므로 company -> message로 이동

        // 로그인 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 회원, 기업 아이디 정보 세팅
        requestBizAskMessageVO.setRgsrUsisId(user.getUserGroupId());
        requestBizAskMessageVO.setRgsnUserId(user.getUsername());

        // 문의 아이디 생성
        requestBizAskMessageVO.setBsnsInqrId(UUID.randomUUID().toString());

        // 사업문의 메시지 발송 저장
        MessageVO bizAskMsg = new MessageVO();
        bizAskMsg.setRcvInttId(requestBizAskMessageVO.getUtlinsttId());
        bizAskMsg.setDsmsInttId(user.getUserGroupId());
        bizAskMsg.setMsgTtl(requestBizAskMessageVO.getInqrTtl());
        bizAskMsg.setMsgCon(requestBizAskMessageVO.getInqrCon());
        // 메시지 발송
        MessageVO resultMsg = this.sendMessage(bizAskMsg, IvtCode.YnTypeEnum.N, ComCode.MESSAGE_INQUIRY, IvtCode.YnTypeEnum.Y);

        // 발송 메시지 아이디 저장
        requestBizAskMessageVO.setDsmsMsgId(resultMsg.getMsgId());

        // 사업문의 요청 저장
        messageRepo.insertBizAskMessage(requestBizAskMessageVO);
    }


    /**============================ ETC ============================**/

    /**
     * 메시지 알림 전송 공통 메서드
     * @param msgId
     * @param alarmCodeEnum
     * @throws Exception
     */
    public void requestMessageAlarm(String msgId, AlarmCode.AlarmCodeEnum alarmCodeEnum) throws Exception {

        // 로그인 유저 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 메시지 정보 조회
        MessageVO resultMsg = messageRepo.selectMessage(msgId);

        // 템플릿 배열, base url, 대상 이용기관 아이디 세팅
        Object[] templateArr = null;
        String linkUrl = "";

        // 투자심사 메시지인 경우
        if(alarmCodeEnum == AlarmCode.AlarmCodeEnum.AUDIT_MESSAGE_RECEIVE) {
            if(user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) {
                linkUrl = AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_VC_URL.getBaseUrl() + resultMsg.getInvmExntRqstId();
                templateArr = new Object[]{resultMsg.getRcvrBplcNm(), resultMsg.getTrntBplcNm()};
            } else {
                linkUrl = AlarmCode.AlarmLinkEnum.AUDIT_DETAIL_COMPANY_URL.getBaseUrl() + resultMsg.getInvmExntRqstId();
                templateArr = new Object[]{resultMsg.getTrntBplcNm(), resultMsg.getRcvrBplcNm()};
            }
        }

        // 사업문의 요청 메시지의 경우
        else if(alarmCodeEnum == AlarmCode.AlarmCodeEnum.BIZ_INQUIRY) {
            linkUrl = AlarmCode.AlarmLinkEnum.RECEIVE_MESSAGE_COMPANY_URL.getBaseUrl();
            templateArr = new Object[]{resultMsg.getTrntBplcNm()};
        }

        // 사업문의 요청 메시지 답변의 경우
        else if(alarmCodeEnum == AlarmCode.AlarmCodeEnum.BIZ_INQUIRY_ANSWER) {
            linkUrl = ventureCapitalService.checkVentureCapital(resultMsg.getRcvInttId())
                    ? AlarmCode.AlarmLinkEnum.RECEIVE_MESSAGE_VC_URL.getBaseUrl() : AlarmCode.AlarmLinkEnum.RECEIVE_MESSAGE_COMPANY_URL.getBaseUrl();
            templateArr = new Object[]{resultMsg.getMsgTtl()};
        }

        // 알림 아이디, 타이틀, base url 설정
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(alarmCodeEnum);
        requestAlarmVO.setPcLinkUrlCon(linkUrl);

        // 알림 내용 설정
        requestAlarmVO.setAlrtCon(
                messageSource.getMessage(
                        alarmCodeEnum.getTemplateId(),
                        templateArr,
                        null
                )
        );

        // 알림 전송
        InvestAlarmSendResultVO alarmResult = platformAlarmService.sendInvestAlarm(requestAlarmVO, resultMsg.getRcvInttId(), null);
        // 알림 전송 결과 저장
        platformAlarmService.saveInvestAlarmSendResult(alarmResult);
    }


}
