package com.ibk.sb.restapi.app.common.constant;

import com.ibk.sb.restapi.app.annotation.PropertyComponent;
import org.springframework.beans.factory.annotation.Value;

@PropertyComponent
public class AlarmCode {

    /**
     * 알림 관련 Constant
     *
     * 알림아이디의 경우
     * 개발서버와 운영서버 운영자포탈에서 발급된 ID(자동발급)가 서로 다를 수 있으므로
     * Bean, Profile 로 관리하지 않고 ID는 properties로 따로 처리
     */

    /*
    알림 코드 Enum
     */
    public enum AlarmCodeEnum {

//        // 투자박스 Q&A 답변 알림
//        QNA_ANSWER(AlarmCode.qnaAnswerId, "신청하신 Q&A에 답변이 등록되었습니다.", "alarm.template.qna.answer"),
//
//        // 신규 투자심사 제안 알림
//        AUDIT_SUGGEST(AlarmCode.auditSuggestId, "신규 투자심사 제안이 등록되었습니다.", "alarm.template.audit.suggest"),
//        // 신규 투자심사 요청 알림
//        AUDIT_REQUEST(AlarmCode.auditRequestId, "신규 투자심사 요청이 등록되었습니다.", "alarm.template.audit.request"),
//        // 투자심사 상태전환 알림
//        AUDIT_CHANGE_STEP(AlarmCode.auditChangeStepId, "진행중인 투자심사의 진행상태가 변경되었습니다.", "alarm.template.audit.step-change"),
//        // 투자심사 요청건 60일경과 알림
//        AUDIT_OVER_TIME(AlarmCode.auditOverTimeId, "투자희망요청 중 60일 이상 경과한 투자건이 있습니다.", "alarm.template.audit.over-time"),
//        // 투자심사 메시지 수신
//        AUDIT_MESSAGE_RECEIVE(AlarmCode.auditMessageReceiveId, "새로운 투자심사 메시지가 등록되었습니다.", "alarm.template.audit.receive-message"),
//
//        // 컨설팅 의뢰 답변 등록 알림
//        CONSULT_ANSWER(AlarmCode.consultAnswerId, "신청하신 컨설팅 의뢰에 답변이 등록되었습니다.", "alarm.template.consult.answer"),
//
//        // 사업문의 알림
//        BIZ_INQUIRY(AlarmCode.bizInquiryId, "신규 사업문의가 등록되었습니다.", "alarm.template.biz-inquiry"),
//        // 사업문의 답변 알림
//        BIZ_INQUIRY_ANSWER(AlarmCode.bizInquiryAnswerId, "신청하신 사업문의에 답변이 등록되었습니다.", "alarm.template.biz-inquiry.answer"),
//
//        // NDA 체결 요청 알림
//        NDA_REQUEST(AlarmCode.ndaRequestId, "신규 NDA 요청이 등록되었습니다.", "alarm.template.nda.request"),
//        // NDA 상태 전환 알림
//        NDA_CHANGE_STEP(AlarmCode.ndaChangeStepId, "진행중인 NDA의 진행상태가 변경되었습니다.", "alarm.template.nda.step-change"),
//
//        // 이용기관 전환(투자사)
//        CONVERT_TO_INVESTOR(AlarmCode.convertToInvestorId, "투자희망기업 -> 투자사로 계정 전환", "alarm.template.convert.investor"),
//        // 이용기관 전환(기업)
//        CONVERT_TO_COMPANY(AlarmCode.convertToCompanyId, "투자사 -> 투자희망기업으로 계정 전환", "alarm.template.convert.company");

        // 투자박스 Q&A 답변 알림
        QNA_ANSWER("신청하신 Q&A에 답변이 등록되었습니다.", "alarm.template.qna.answer"),

        // 신규 투자심사 제안 알림
        AUDIT_SUGGEST("신규 투자심사 제안이 등록되었습니다.", "alarm.template.audit.suggest"),
        // 신규 투자심사 요청 알림
        AUDIT_REQUEST("신규 투자심사 요청이 등록되었습니다.", "alarm.template.audit.request"),
        // 투자심사 상태전환 알림
        AUDIT_CHANGE_STEP("진행중인 투자심사의 진행상태가 변경되었습니다.", "alarm.template.audit.step-change"),
        // 투자심사 요청건 60일경과 알림
        AUDIT_OVER_TIME("투자희망요청 중 60일 이상 경과한 투자건이 있습니다.", "alarm.template.audit.over-time"),
        // 투자심사 메시지 수신
        AUDIT_MESSAGE_RECEIVE("새로운 투자심사 메시지가 등록되었습니다.", "alarm.template.audit.receive-message"),

        // 컨설팅 의뢰 답변 등록 알림
        CONSULT_ANSWER("신청하신 컨설팅 의뢰에 답변이 등록되었습니다.", "alarm.template.consult.answer"),

        // 사업문의 알림
        BIZ_INQUIRY("신규 사업문의가 등록되었습니다.", "alarm.template.biz-inquiry"),
        // 사업문의 답변 알림
        BIZ_INQUIRY_ANSWER("신청하신 사업문의에 답변이 등록되었습니다.", "alarm.template.biz-inquiry.answer"),

        // NDA 체결 요청 알림
        NDA_REQUEST("신규 NDA 요청이 등록되었습니다.", "alarm.template.nda.request"),
        // NDA 상태 전환 알림
        NDA_CHANGE_STEP("진행중인 NDA의 진행상태가 변경되었습니다.", "alarm.template.nda.step-change"),

        // 이용기관 전환(투자사)
        CONVERT_TO_INVESTOR("투자희망기업 -> 투자사로 계정 전환", "alarm.template.convert.investor"),
        // 이용기관 전환(기업)
        CONVERT_TO_COMPANY("투자사 -> 투자희망기업으로 계정 전환", "alarm.template.convert.company");

        private final String title;
        private final String templateId;

        AlarmCodeEnum(String title, String templateId) {
            this.title = title;
            this.templateId = templateId;
        }

        public String getTitle() { return title; }
        public String getTemplateId() { return templateId; }

        /**
         * 생성자에 직접적으로 넣는 경우, 파일 위치 및 최초 호출 시점에 따라
         * static 영역에 메모리 로드 시점이 꼬일 수 있으므로
         * get 메서드를 이용
         */
        public String getAlarmId() {
            switch (this) {
                case QNA_ANSWER:
                    return AlarmCode.qnaAnswerId;
                case AUDIT_SUGGEST:
                    return AlarmCode.auditSuggestId;
                case AUDIT_REQUEST:
                    return AlarmCode.auditRequestId;
                case AUDIT_CHANGE_STEP:
                    return AlarmCode.auditChangeStepId;
                case AUDIT_OVER_TIME:
                    return AlarmCode.auditOverTimeId;
                case AUDIT_MESSAGE_RECEIVE:
                    return AlarmCode.auditMessageReceiveId;
                case CONSULT_ANSWER:
                    return AlarmCode.consultAnswerId;
                case BIZ_INQUIRY:
                    return AlarmCode.bizInquiryId;
                case BIZ_INQUIRY_ANSWER:
                    return AlarmCode.bizInquiryAnswerId;
                case NDA_REQUEST:
                    return AlarmCode.ndaRequestId;
                case NDA_CHANGE_STEP:
                    return AlarmCode.ndaChangeStepId;
                case CONVERT_TO_INVESTOR:
                    return AlarmCode.convertToInvestorId;
                case CONVERT_TO_COMPANY:
                    return AlarmCode.convertToCompanyId;
                default:
                    return null;
            }
        }
    }

    /*
    투자심사 알림 링크 Enum
     */
    public enum AlarmLinkEnum {
        // 투자박스 Q&A 답변 알림 URL
        QNA_ANSWER_URL("/customersupport/qa/view?inqrSbjcId=", "투자박스 Q&A 상세"),

        // 투자심사 상세 Url - 기업
        AUDIT_DETAIL_COMPANY_URL( "/mypage/company/request/detail?invmExntRqstId=", "투자심사 상세(기업)"),
        // NDA 상세 Url - 기업
        NDA_DETAIL_COMPANY_URL("/mypage/company/nda/view?ndaCnttId=", "NDA 상세(기업)"),
        // 수신 메시지 목록 URL - 기업
        RECEIVE_MESSAGE_COMPANY_URL("/mypage/company/message/receive/view", "수신 메시지 목록(기업)"),
        // 컨설팅 의뢰 답변 등록 알림 URL - 기업
        CONSULT_ANSWER_URL("/mypage/company/consult/detail?cnsgReqsId=", "컨설팅 상세(기업)"),

        // 투자심사 상세 Url - 투자사
        AUDIT_DETAIL_VC_URL("/mypage/investor/request/detail?invmExntRqstId=", "투자심사 상세(투자사)"),
        // NDA 상세 Url - 투자사
        NDA_DETAIL_VC_URL("/mypage/investor/nda/view?ndaCnttId=", "NDA 상세(투자사)"),
        // 수신 메시지 목록 URL - 투자사
        RECEIVE_MESSAGE_VC_URL("/mypage/investor/message/receive/view", "수신 메시지 목록(투자사)"),

        // 투자희망기업 -> 투자사로 계정 전환
        CONVERT_INVESTOR_URL("/mypage/investor/info", "투자사 마이페이지 내정보"),
        // 투자사 -> 투자희망기업으로 계정 전환
        CONVERT_COMPANY_URL("/mypage/company/info", "기업 마이페이지 내정보");

        private final String baseUrl;
        private final String name;

        AlarmLinkEnum(String baseUrl, String name) {
            this.baseUrl = baseUrl;
            this.name = name;
        }
        public String getBaseUrl() { return AlarmCode.alarmPageInvestHostUrl + baseUrl; }

        public String getName() { return name; }
    }

    // 투자박스 호스트 URL
    private static String alarmPageInvestHostUrl;

    // 투자박스 호스트 URL Setter
    @Value("${ivt.alarm.page.host.url}")
    public void setAlarmPageInvestHostUrl(String alarmPageInvestHostUrl) {
        AlarmCode.alarmPageInvestHostUrl = alarmPageInvestHostUrl;
    }

    /*
    투자박스 알림 ID
     */
    // 신규 투자심사 제안 알림 ID
    private static String auditSuggestId;
    // 신규 투자심사 요청 알림 ID
    private static String auditRequestId;
    // 투자심사 상태전환 알림 ID
    private static String auditChangeStepId;
    // 투자심사 요청건 60일경과 알림 ID
    private static String auditOverTimeId;
    // 메시지 답변 ID
    private static String auditMessageReceiveId;
    // 컨설팅 의뢰 답변 등록 알림 ID
    private static String consultAnswerId;
    // 사업문의 알림 ID
    private static String bizInquiryId;
    // 사업문의 답변 알림 ID
    private static String bizInquiryAnswerId;
    // 투자박스 Q&A 답변 알림 ID
    private static String qnaAnswerId;
    // NDA 체결 요청 알림 ID
    private static String ndaRequestId;
    // NDA 상태전환 알림 ID
    private static String ndaChangeStepId;
    // 계정 전환 알림 (투자희망기업 -> 투자사) ID
    private static String convertToInvestorId;
    // 계정 전환 알림 (투자사 -> 투자희망기업) ID
    private static String convertToCompanyId;

    // 알림 설정 ID Setter
    @Value("${adp.alarm.audit-suggest.id}")
    public void setAuditSuggestId(String auditSuggestId) { AlarmCode.auditSuggestId = auditSuggestId; }
    @Value("${adp.alarm.audit-request.id}")
    public void setAuditRequestId(String auditRequestId) { AlarmCode.auditRequestId = auditRequestId; }
    @Value("${adp.alarm.audit-change-step.id}")
    public void setAuditChangeStepId(String auditChangeStepId) { AlarmCode.auditChangeStepId = auditChangeStepId; }
    @Value("${adp.alarm.audit-over-time.id}")
    public void setAuditOverTimeId(String auditOverTimeId) { AlarmCode.auditOverTimeId = auditOverTimeId; }
    @Value("${adp.alarm.audit-message-receive.id}")
    public void setAuditMessageReceiveId(String auditMessageReceiveId) { AlarmCode.auditMessageReceiveId = auditMessageReceiveId; }
    @Value("${adp.alarm.consult-answer.id}")
    public void setConsultAnswerId(String consultAnswerId) { AlarmCode.consultAnswerId = consultAnswerId; }
    @Value("${adp.alarm.biz-inquiry.id}")
    public void setBizInquiryId(String bizInquiryId) { AlarmCode.bizInquiryId = bizInquiryId; }
    @Value("${adp.alarm.biz-inquiry-answer.id}")
    public void setBizInquiryAnswerId(String bizInquiryAnswerId) { AlarmCode.bizInquiryAnswerId = bizInquiryAnswerId; }
    @Value("${adp.alarm.qna-answer.id}")
    public void setQnaAnswerId(String qnaAnswerId) { AlarmCode.qnaAnswerId = qnaAnswerId; }
    @Value("${adp.alarm.nda-request.id}")
    public void setNdaRequestId(String ndaRequestId) { AlarmCode.ndaRequestId = ndaRequestId; }
    @Value("${adp.alarm.nda-change-step.id}")
    public void setNdaChangeStepId(String ndaChangeStepId) { AlarmCode.ndaChangeStepId = ndaChangeStepId; }
    @Value("${adp.alarm.convert-investor.id}")
    public void setVcConvertAcceptId(String convertToInvestorId) { AlarmCode.convertToInvestorId = convertToInvestorId; }
    @Value("${adp.alarm.convert-company.id}")
    public void setVcConvertDenyId(String convertToCompanyId) { AlarmCode.convertToCompanyId = convertToCompanyId; }

    /*
    알림 대분류 Enumeration
    메인박스 기준 대분류에 따라 수신목록 탭처리가 필요할 수 있으므로 따로 Enum 정리
     */
//    public enum AlrtLrdvDcdEnum {
//        FINANCE("0001", "금융"),
//        NEWS("0002", "뉴스"),
//        BOX("0003", "BOX"),
//        MY("0004", "MY"),
//        NOTICE("0005", "공지"),
//        STORE("0006", "스토어");
//
//        private final String code;
//        private final String name;
//
//        AlrtLrdvDcdEnum(String code, String name) {
//            this.code = code;
//            this.name = name;
//        }
//
//        public String getCode() {
//            return code;
//        }
//        public String getName() {
//            return name;
//        }
//    }
}
